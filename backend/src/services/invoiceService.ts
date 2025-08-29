import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import { Invoice, User, MembershipPlan, Payment } from '../models';

interface InvoiceData {
  userId: number;
  paymentId?: number;
  membershipPlanId?: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  description: string;
  issueDate: Date;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paidDate?: Date;
  metadata?: any;
}

export const createInvoice = async (data: InvoiceData): Promise<Invoice> => {
  const invoiceNumber = await generateInvoiceNumber();
  
  const invoice = await Invoice.create({
    invoiceNumber,
    ...data,
    metadata: data.metadata || {}
  });

  return invoice;
};

export const generateInvoiceNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const count = await Invoice.count({
    where: {
      createdAt: {
        [require('sequelize').Op.gte]: new Date(`${year}-01-01`),
        [require('sequelize').Op.lt]: new Date(`${year + 1}-01-01`)
      }
    }
  });

  const invoiceNumber = `INV-${year}-${String(count + 1).padStart(6, '0')}`;
  return invoiceNumber;
};

export const generateInvoicePDF = async (invoice: Invoice): Promise<string> => {
  const invoiceWithDetails = await Invoice.findByPk(invoice.id, {
    include: [
      { model: User, as: 'user' },
      { model: MembershipPlan, as: 'plan' },
      { model: Payment, as: 'payment' }
    ]
  });

  if (!invoiceWithDetails) {
    throw new Error('Invoice not found');
  }

  const user = invoiceWithDetails.user;
  const plan = invoiceWithDetails.plan;

  const doc = new PDFDocument({ margin: 50 });
  const fileName = `invoice-${invoice.invoiceNumber}.pdf`;
  const filePath = path.join(process.cwd(), 'uploads', 'invoices', fileName);

  const uploadsDir = path.join(process.cwd(), 'uploads', 'invoices');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc
    .fontSize(20)
    .text('FEDERACIÓN MEXICANA DE PICKLEBALL', 50, 50)
    .fontSize(14)
    .text('RFC: FMP123456789', 50, 80)
    .text('Av. Revolución 1234, Ciudad de México', 50, 100)
    .text('CP 01020, México', 50, 120)
    .text('Tel: +52 55 1234 5678', 50, 140)
    .moveDown();

  doc
    .fontSize(16)
    .text(`FACTURA ${invoice.invoiceNumber}`, 400, 50)
    .fontSize(12)
    .text(`Fecha: ${invoice.issueDate.toLocaleDateString('es-MX')}`, 400, 80)
    .text(`Vencimiento: ${invoice.dueDate.toLocaleDateString('es-MX')}`, 400, 100)
    .text(`Estado: ${getInvoiceStatusText(invoice.status)}`, 400, 120);

  if (invoice.paidDate) {
    doc.text(`Pagado: ${invoice.paidDate.toLocaleDateString('es-MX')}`, 400, 140);
  }

  doc
    .moveDown()
    .fontSize(14)
    .text('FACTURAR A:', 50, 200)
    .fontSize(12)
    .text(`${user.username}`, 50, 220)
    .text(`${user.email}`, 50, 240)
    .moveDown();

  const startY = 300;
  doc
    .fontSize(12)
    .text('Descripción', 50, startY, { width: 250 })
    .text('Precio', 320, startY, { width: 80, align: 'right' })
    .text('IVA (16%)', 420, startY, { width: 80, align: 'right' })
    .text('Total', 520, startY, { width: 80, align: 'right' });

  doc
    .moveTo(50, startY + 20)
    .lineTo(550, startY + 20)
    .stroke();

  doc
    .text(invoice.description, 50, startY + 30, { width: 250 })
    .text(`$${invoice.subtotal.toFixed(2)}`, 320, startY + 30, { width: 80, align: 'right' })
    .text(`$${invoice.taxAmount.toFixed(2)}`, 420, startY + 30, { width: 80, align: 'right' })
    .text(`$${invoice.totalAmount.toFixed(2)}`, 520, startY + 30, { width: 80, align: 'right' });

  doc
    .moveTo(50, startY + 60)
    .lineTo(550, startY + 60)
    .stroke();

  doc
    .fontSize(14)
    .text(`TOTAL: $${invoice.totalAmount.toFixed(2)} ${invoice.currency.toUpperCase()}`, 400, startY + 80, { 
      width: 150, 
      align: 'right' 
    });

  if (plan) {
    doc
      .moveDown(2)
      .fontSize(10)
      .text('Detalles del Plan:', 50, startY + 120)
      .text(`Plan: ${plan.name}`, 50, startY + 140)
      .text(`Tipo: ${plan.type}`, 50, startY + 160)
      .text(`Duración: ${plan.duration} ${plan.durationType}`, 50, startY + 180);
  }

  doc
    .moveDown(2)
    .fontSize(10)
    .text('Términos y Condiciones:', 50, startY + 220)
    .text('• El pago debe realizarse antes de la fecha de vencimiento.', 50, startY + 240)
    .text('• Esta factura es válida para efectos fiscales en México.', 50, startY + 260)
    .text('• Para cualquier duda, contacte a soporte@federacionpickleball.mx', 50, startY + 280);

  doc.end();

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  const pdfUrl = `/uploads/invoices/${fileName}`;
  await invoice.update({ pdfUrl });

  return pdfUrl;
};

export const sendInvoiceEmail = async (invoice: Invoice): Promise<void> => {
  const invoiceWithDetails = await Invoice.findByPk(invoice.id, {
    include: [
      { model: User, as: 'user' },
      { model: MembershipPlan, as: 'plan' }
    ]
  });

  if (!invoiceWithDetails) {
    throw new Error('Invoice not found');
  }

  const user = invoiceWithDetails.user;
  const plan = invoiceWithDetails.plan;

  if (!process.env.SMTP_HOST) {
    console.warn('SMTP not configured, skipping email send');
    return;
  }

  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const subject = `Factura ${invoice.invoiceNumber} - Federación Mexicana de Pickleball`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
        <h1>Federación Mexicana de Pickleball</h1>
      </div>
      
      <div style="padding: 20px; background-color: #f9fafb;">
        <h2>Estimado/a ${user.username},</h2>
        
        <p>Adjunto encontrará su factura <strong>${invoice.invoiceNumber}</strong> por el monto de <strong>$${invoice.totalAmount.toFixed(2)} MXN</strong>.</p>
        
        <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>Detalles de la Factura</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Número:</strong> ${invoice.invoiceNumber}</li>
            <li><strong>Fecha:</strong> ${invoice.issueDate.toLocaleDateString('es-MX')}</li>
            <li><strong>Vencimiento:</strong> ${invoice.dueDate.toLocaleDateString('es-MX')}</li>
            <li><strong>Estado:</strong> ${getInvoiceStatusText(invoice.status)}</li>
            ${plan ? `<li><strong>Plan:</strong> ${plan.name}</li>` : ''}
          </ul>
        </div>

        <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>Desglose de Costos</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Subtotal:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${invoice.subtotal.toFixed(2)} MXN</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">IVA (16%):</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${invoice.taxAmount.toFixed(2)} MXN</td>
            </tr>
            <tr style="font-weight: bold; background-color: #f3f4f6;">
              <td style="padding: 8px;">Total:</td>
              <td style="padding: 8px; text-align: right;">$${invoice.totalAmount.toFixed(2)} MXN</td>
            </tr>
          </table>
        </div>

        ${invoice.status !== 'paid' ? `
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>⚠️ Recordatorio de Pago</strong></p>
          <p>Por favor, realice el pago antes de la fecha de vencimiento para evitar interrupciones en su membresía.</p>
        </div>
        ` : `
        <div style="background-color: #d1fae5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>✅ Pago Completado</strong></p>
          <p>Gracias por su pago. Su membresía está activa y al día.</p>
        </div>
        `}

        <p>Si tiene alguna pregunta sobre esta factura, no dude en contactarnos:</p>
        <ul>
          <li>Email: facturacion@federacionpickleball.mx</li>
          <li>Teléfono: +52 55 1234 5678</li>
        </ul>

        <p>Gracias por ser parte de la Federación Mexicana de Pickleball.</p>
        
        <p>Saludos cordiales,<br>
        <strong>Equipo de Facturación</strong><br>
        Federación Mexicana de Pickleball</p>
      </div>
      
      <div style="background-color: #374151; color: #d1d5db; padding: 15px; text-align: center; font-size: 12px;">
        <p>© 2025 Federación Mexicana de Pickleball. Todos los derechos reservados.</p>
        <p>Este correo electrónico contiene información confidencial.</p>
      </div>
    </div>
  `;

  const attachments = [];
  if (invoice.pdfUrl && fs.existsSync(path.join(process.cwd(), invoice.pdfUrl.replace('/', '')))) {
    attachments.push({
      filename: `factura-${invoice.invoiceNumber}.pdf`,
      path: path.join(process.cwd(), invoice.pdfUrl.replace('/', ''))
    });
  }

  await transporter.sendMail({
    from: `"Federación Mexicana de Pickleball" <${process.env.SMTP_FROM || 'noreply@federacionpickleball.mx'}>`,
    to: user.email,
    subject,
    html: htmlContent,
    attachments
  });

  await invoice.update({ 
    emailedAt: new Date(),
    status: invoice.status === 'draft' ? 'sent' : invoice.status
  });
};

export const getInvoiceStatusText = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    draft: 'Borrador',
    sent: 'Enviada',
    paid: 'Pagada',
    overdue: 'Vencida',
    cancelled: 'Cancelada'
  };
  
  return statusMap[status] || status;
};

export const markInvoiceOverdue = async (): Promise<void> => {
  const overdueInvoices = await Invoice.findAll({
    where: {
      status: 'sent',
      dueDate: {
        [require('sequelize').Op.lt]: new Date()
      }
    }
  });

  for (const invoice of overdueInvoices) {
    await invoice.update({ status: 'overdue' });
    
    // Send overdue notification
    const user = await User.findByPk(invoice.userId);
    if (user) {
      // You can implement overdue notification logic here
      console.log(`Invoice ${invoice.invoiceNumber} is overdue for user ${user.email}`);
    }
  }
};

export const generateMonthlyReport = async (year: number, month: number) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const invoices = await Invoice.findAll({
    where: {
      issueDate: {
        [require('sequelize').Op.between]: [startDate, endDate]
      }
    },
    include: [
      { model: User, as: 'user' },
      { model: MembershipPlan, as: 'plan' }
    ]
  });

  const totalInvoiced = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
  const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
  const totalOverdue = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + Number(inv.totalAmount), 0);

  return {
    period: `${year}-${month.toString().padStart(2, '0')}`,
    totalInvoices: invoices.length,
    totalInvoiced,
    totalPaid,
    totalOverdue,
    invoices
  };
};