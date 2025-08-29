const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Use SQLite for seeding
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'data/development.sqlite'),
  logging: false,
  define: {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  }
});

// Define models for seeding
const MembershipPlan = sequelize.define('MembershipPlan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('player', 'coach', 'club', 'partner', 'state', 'federation'),
    allowNull: false
  },
  plan_type: {
    type: DataTypes.ENUM('basic', 'premium'),
    allowNull: false
  },
  annual_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  monthly_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  features: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  stripe_price_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'membership_plans',
  timestamps: true
});

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  membership_plan_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'membership_plans', key: 'id' }
  },
  payment_type: {
    type: DataTypes.ENUM('membership', 'upgrade', 'renewal', 'tournament', 'court_rental', 'certification'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'succeeded', 'failed', 'cancelled', 'refunded'),
    allowNull: false,
    defaultValue: 'pending'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'mxn'
  },
  stripe_payment_intent_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stripe_customer_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reference_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  reference_type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  paid_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'payments',
  timestamps: true
});

const Membership = sequelize.define('Membership', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  membership_plan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'membership_plans', key: 'id' }
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'cancelled', 'pending'),
    allowNull: false,
    defaultValue: 'pending'
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  is_auto_renew: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  stripe_subscription_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  last_payment_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'payments', key: 'id' }
  }
}, {
  tableName: 'memberships',
  timestamps: true
});

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  invoice_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  payment_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'payments', key: 'id' }
  },
  membership_plan_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'membership_plans', key: 'id' }
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled'),
    allowNull: false,
    defaultValue: 'draft'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'mxn'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  issue_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  paid_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  }
}, {
  tableName: 'invoices',
  timestamps: true
});

// Membership plans data
const membershipPlansData = [
  // Player Plans
  {
    name: 'Jugador Básico',
    role: 'player',
    plan_type: 'basic',
    annual_fee: 500.00,
    monthly_fee: 45.00,
    features: [
      'Registro en federación',
      'Credencial digital',
      'Participación en torneos',
      'Acceso a rankings',
      'Soporte básico'
    ],
    stripe_price_id: 'price_player_basic_annual',
    description: 'Plan básico para jugadores de pickleball con acceso a funciones esenciales.',
    is_active: true
  },
  {
    name: 'Jugador Premium',
    role: 'player',
    plan_type: 'premium',
    annual_fee: 1200.00,
    monthly_fee: 105.00,
    features: [
      'Todo lo del plan básico',
      'Buscador de jugadores',
      'Reservas prioritarias',
      'Estadísticas avanzadas',
      'Soporte prioritario',
      'Acceso a entrenamientos especiales'
    ],
    stripe_price_id: 'price_player_premium_annual',
    description: 'Plan premium para jugadores serios con funciones avanzadas.',
    is_active: true
  },
  
  // Coach Plans
  {
    name: 'Entrenador Básico',
    role: 'coach',
    plan_type: 'basic',
    annual_fee: 800.00,
    monthly_fee: 70.00,
    features: [
      'Certificación de entrenador',
      'Credencial digital',
      'Gestión de estudiantes',
      'Historial de entrenamientos',
      'Soporte técnico'
    ],
    stripe_price_id: 'price_coach_basic_annual',
    description: 'Plan para entrenadores certificados con herramientas básicas.',
    is_active: true
  },
  {
    name: 'Entrenador Premium',
    role: 'coach',
    plan_type: 'premium',
    annual_fee: 1800.00,
    monthly_fee: 155.00,
    features: [
      'Todo lo del plan básico',
      'Certificaciones avanzadas',
      'Herramientas de análisis',
      'Scheduling avanzado',
      'Reportes detallados',
      'Acceso a cursos especializados'
    ],
    stripe_price_id: 'price_coach_premium_annual',
    description: 'Plan avanzado para entrenadores profesionales.',
    is_active: true
  },
  
  // Club Plans
  {
    name: 'Club Básico',
    role: 'club',
    plan_type: 'basic',
    annual_fee: 2000.00,
    monthly_fee: 175.00,
    features: [
      'Afiliación a federación',
      'Gestión de miembros',
      'Micrositio básico',
      'Comunicaciones',
      'Reportes básicos'
    ],
    stripe_price_id: 'price_club_basic_annual',
    description: 'Plan básico para clubs con funcionalidades esenciales.',
    is_active: true
  },
  {
    name: 'Club Premium',
    role: 'club',
    plan_type: 'premium',
    annual_fee: 5000.00,
    monthly_fee: 425.00,
    features: [
      'Todo lo del plan básico',
      'Gestión de canchas',
      'Creación de torneos',
      'Sistema de reservas',
      'Analytics avanzados',
      'Micrositio premium',
      'Integración con pagos'
    ],
    stripe_price_id: 'price_club_premium_annual',
    description: 'Plan completo para clubs con todas las funcionalidades.',
    is_active: true
  },
  
  // Partner Plans
  {
    name: 'Socio Comercial Premium',
    role: 'partner',
    plan_type: 'premium',
    annual_fee: 8000.00,
    monthly_fee: 700.00,
    features: [
      'Gestión de instalaciones',
      'Creación de torneos',
      'Sistema de reservas completo',
      'Facturación integrada',
      'Analytics de negocio',
      'Micrositio empresarial',
      'Soporte prioritario'
    ],
    stripe_price_id: 'price_partner_premium_annual',
    description: 'Plan empresarial para socios comerciales con funcionalidades completas.',
    is_active: true
  },
  
  // State Plans
  {
    name: 'Comité Estatal',
    role: 'state',
    plan_type: 'premium',
    annual_fee: 15000.00,
    monthly_fee: 1300.00,
    features: [
      'Gestión estatal completa',
      'Organización de torneos estatales',
      'Gestión de afiliados',
      'Micrositio oficial',
      'Reportes gubernamentales',
      'Comunicaciones masivas',
      'Soporte dedicado'
    ],
    stripe_price_id: 'price_state_premium_annual',
    description: 'Plan para comités estatales con funcionalidades gubernamentales.',
    is_active: true
  }
];

async function seedStep4Data() {
  try {
    console.log('🔄 Starting Step 4 payment and membership data seeding...');
    
    // Sync database with new models
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced with new payment models');

    // Seed membership plans
    const plans = await MembershipPlan.bulkCreate(membershipPlansData);
    console.log(`✅ Seeded ${plans.length} membership plans`);

    // Get existing users for creating memberships and payments
    const [users] = await sequelize.query('SELECT id, role FROM users WHERE role != "federation"');
    
    // Create sample memberships for existing users
    const memberships = [];
    const payments = [];
    const invoices = [];
    
    let paymentCounter = 1;
    let invoiceCounter = 1;
    
    for (const user of users) {
      // Find appropriate plan for user role
      const availablePlans = plans.filter(plan => plan.role === user.role);
      if (availablePlans.length === 0) continue;
      
      // Randomly assign basic or premium plan
      const plan = availablePlans[Math.floor(Math.random() * availablePlans.length)];
      
      // Create membership
      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1); // 1 year from now
      
      const membership = await Membership.create({
        user_id: user.id,
        membership_plan_id: plan.id,
        status: 'active',
        start_date: startDate,
        end_date: endDate,
        is_auto_renew: Math.random() > 0.5
      });
      memberships.push(membership);
      
      // Create payment for the membership
      const subtotal = parseFloat(plan.annual_fee);
      const taxAmount = Math.round(subtotal * 0.16 * 100) / 100; // 16% IVA
      const totalAmount = subtotal + taxAmount;
      
      const payment = await Payment.create({
        user_id: user.id,
        membership_plan_id: plan.id,
        payment_type: 'membership',
        status: 'succeeded',
        amount: totalAmount,
        currency: 'mxn',
        stripe_payment_intent_id: `pi_test_membership_${paymentCounter}`,
        stripe_customer_id: `cus_test_${user.id}`,
        subtotal: subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        description: `Membresía anual - ${plan.name}`,
        reference_id: membership.id,
        reference_type: 'membership',
        metadata: {
          plan_name: plan.name,
          plan_type: plan.plan_type,
          user_role: user.role
        },
        paid_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Paid within last 30 days
      });
      payments.push(payment);
      
      // Update membership with payment reference
      await membership.update({ last_payment_id: payment.id });
      
      // Create invoice
      const invoice = await Invoice.create({
        invoice_number: `INV-2024-${String(invoiceCounter).padStart(6, '0')}`,
        user_id: user.id,
        payment_id: payment.id,
        membership_plan_id: plan.id,
        status: 'paid',
        subtotal: subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        currency: 'mxn',
        description: `Factura por membresía anual - ${plan.name}`,
        issue_date: payment.paid_at,
        due_date: payment.paid_at,
        paid_date: payment.paid_at,
        metadata: {
          payment_method: 'credit_card',
          stripe_payment_intent: payment.stripe_payment_intent_id
        }
      });
      invoices.push(invoice);
      
      paymentCounter++;
      invoiceCounter++;
    }
    
    console.log(`✅ Created ${memberships.length} sample memberships`);
    console.log(`✅ Created ${payments.length} sample payments`);
    console.log(`✅ Created ${invoices.length} sample invoices`);
    
    // Create some additional sample payments (upgrades, renewals, etc.)
    const additionalPayments = [];
    
    // Sample premium upgrades
    for (let i = 0; i < 2; i++) {
      const user = users[i];
      const basicPlan = plans.find(p => p.role === user.role && p.plan_type === 'basic');
      const premiumPlan = plans.find(p => p.role === user.role && p.plan_type === 'premium');
      
      if (basicPlan && premiumPlan) {
        const upgradeCost = parseFloat(premiumPlan.annual_fee) - parseFloat(basicPlan.annual_fee);
        const taxAmount = Math.round(upgradeCost * 0.16 * 100) / 100;
        const totalAmount = upgradeCost + taxAmount;
        
        const upgradePayment = await Payment.create({
          user_id: user.id,
          membership_plan_id: premiumPlan.id,
          payment_type: 'upgrade',
          status: 'succeeded',
          amount: totalAmount,
          currency: 'mxn',
          stripe_payment_intent_id: `pi_test_upgrade_${paymentCounter}`,
          stripe_customer_id: `cus_test_${user.id}`,
          subtotal: upgradeCost,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          description: `Actualización a plan premium - ${premiumPlan.name}`,
          metadata: {
            upgrade_from: basicPlan.name,
            upgrade_to: premiumPlan.name
          },
          paid_at: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000)
        });
        additionalPayments.push(upgradePayment);
        paymentCounter++;
      }
    }
    
    console.log(`✅ Created ${additionalPayments.length} sample upgrade payments`);
    
    console.log('\n📊 Summary of Step 4 seeded data:');
    console.log('==========================================');
    console.log(`✅ Membership Plans: ${plans.length}`);
    console.log('   - Player Basic & Premium: 2');
    console.log('   - Coach Basic & Premium: 2'); 
    console.log('   - Club Basic & Premium: 2');
    console.log('   - Partner Premium: 1');
    console.log('   - State Premium: 1');
    console.log(`✅ User Memberships: ${memberships.length}`);
    console.log(`✅ Payments: ${payments.length + additionalPayments.length}`);
    console.log(`✅ Invoices: ${invoices.length}`);
    
    console.log('\n💰 Sample Plan Pricing (MXN):');
    console.log('==============================');
    plans.forEach(plan => {
      console.log(`${plan.name}: $${plan.annual_fee} anual / $${plan.monthly_fee} mensual`);
    });
    
    console.log('\n✨ Step 4 payment and membership data seeding completed successfully!');
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error seeding Step 4 data:', error);
    process.exit(1);
  }
}

seedStep4Data();