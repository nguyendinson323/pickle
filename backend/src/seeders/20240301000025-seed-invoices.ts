import { QueryInterface } from "sequelize";

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert("invoices", [
    {
      invoice_number: "INV-2025-0001",
      user_id: 1,
      payment_id: 1,
      membership_plan_id: 1,
      status: "paid",
      subtotal: 100.00,
      tax_amount: 16.00,
      total_amount: 116.00,
      currency: "mxn",
      description: "Monthly Premium Membership",
      issue_date: new Date("2025-08-01"),
      due_date: new Date("2025-08-10"),
      paid_date: new Date("2025-08-05"),
      pdf_url: "https://example.com/invoices/INV-2025-0001.pdf",
      emailed_at: new Date("2025-08-01"),
      metadata: JSON.stringify({ method: "credit_card" }),
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete("invoices", {}, {});
}
