const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
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

// Define models
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('player', 'coach', 'club', 'partner', 'state', 'federation'),
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  last_login: DataTypes.DATE,
  refresh_token: DataTypes.TEXT,
  password_reset_token: DataTypes.STRING,
  password_reset_expires: DataTypes.DATE,
  verification_token: DataTypes.STRING,
  verification_expires: DataTypes.DATE
});

const State = sequelize.define('State', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(10),
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  capital: DataTypes.STRING,
  region: DataTypes.STRING,
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

const Player = sequelize.define('Player', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date_of_birth: DataTypes.DATE,
  gender: DataTypes.ENUM('male', 'female', 'other'),
  curp: DataTypes.STRING(18),
  mobile_phone: DataTypes.STRING,
  state_id: {
    type: DataTypes.INTEGER,
    references: { model: 'states', key: 'id' }
  },
  city: DataTypes.STRING,
  address: DataTypes.TEXT,
  nrtp_level: DataTypes.DECIMAL(2, 1),
  ranking_position: DataTypes.INTEGER,
  profile_photo_url: DataTypes.STRING,
  id_document_url: DataTypes.STRING,
  membership_status: {
    type: DataTypes.ENUM('active', 'expired', 'pending'),
    defaultValue: 'pending'
  },
  membership_expires_at: DataTypes.DATE,
  is_visible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  privacy_policy_accepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  privacy_policy_accepted_at: DataTypes.DATE
});

const Coach = sequelize.define('Coach', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date_of_birth: DataTypes.DATE,
  gender: DataTypes.ENUM('male', 'female', 'other'),
  curp: DataTypes.STRING(18),
  mobile_phone: DataTypes.STRING,
  state_id: {
    type: DataTypes.INTEGER,
    references: { model: 'states', key: 'id' }
  },
  city: DataTypes.STRING,
  address: DataTypes.TEXT,
  coaching_level: DataTypes.STRING,
  certification_number: DataTypes.STRING,
  specialization: DataTypes.STRING,
  years_experience: DataTypes.INTEGER,
  profile_photo_url: DataTypes.STRING,
  id_document_url: DataTypes.STRING,
  membership_status: {
    type: DataTypes.ENUM('active', 'expired', 'pending'),
    defaultValue: 'pending'
  },
  membership_expires_at: DataTypes.DATE,
  privacy_policy_accepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  privacy_policy_accepted_at: DataTypes.DATE
});

const Club = sequelize.define('Club', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rfc: DataTypes.STRING,
  manager_name: DataTypes.STRING,
  manager_role: DataTypes.STRING,
  contact_email: DataTypes.STRING,
  phone: DataTypes.STRING,
  state_id: {
    type: DataTypes.INTEGER,
    references: { model: 'states', key: 'id' }
  },
  city: DataTypes.STRING,
  address: DataTypes.TEXT,
  club_type: DataTypes.ENUM('competitive', 'recreational', 'mixed'),
  website: DataTypes.STRING,
  social_media: DataTypes.JSON,
  logo_url: DataTypes.STRING,
  description: DataTypes.TEXT,
  founded_date: DataTypes.DATE,
  membership_status: {
    type: DataTypes.ENUM('active', 'expired', 'pending'),
    defaultValue: 'pending'
  },
  membership_expires_at: DataTypes.DATE,
  has_courts: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  premium_plan: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  privacy_policy_accepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  privacy_policy_accepted_at: DataTypes.DATE
});

const Partner = sequelize.define('Partner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  },
  business_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rfc: DataTypes.STRING,
  contact_person_name: DataTypes.STRING,
  contact_person_title: DataTypes.STRING,
  contact_email: DataTypes.STRING,
  phone: DataTypes.STRING,
  partner_type: DataTypes.ENUM('hotel', 'resort', 'camp', 'company', 'court_owner'),
  state_id: {
    type: DataTypes.INTEGER,
    references: { model: 'states', key: 'id' }
  },
  city: DataTypes.STRING,
  address: DataTypes.TEXT,
  website: DataTypes.STRING,
  social_media: DataTypes.JSON,
  logo_url: DataTypes.STRING,
  description: DataTypes.TEXT,
  has_courts: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  premium_plan: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  privacy_policy_accepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  privacy_policy_accepted_at: DataTypes.DATE
});

const StateCommittee = sequelize.define('StateCommittee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rfc: DataTypes.STRING,
  president_name: DataTypes.STRING,
  president_role: DataTypes.STRING,
  institutional_email: DataTypes.STRING,
  phone: DataTypes.STRING,
  state_id: {
    type: DataTypes.INTEGER,
    references: { model: 'states', key: 'id' }
  },
  affiliate_type: DataTypes.STRING,
  website: DataTypes.STRING,
  social_media: DataTypes.JSON,
  logo_url: DataTypes.STRING,
  description: DataTypes.TEXT,
  established_date: DataTypes.DATE,
  membership_status: {
    type: DataTypes.ENUM('active', 'expired', 'pending'),
    defaultValue: 'pending'
  },
  membership_expires_at: DataTypes.DATE,
  privacy_policy_accepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  privacy_policy_accepted_at: DataTypes.DATE
});

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  subject: DataTypes.STRING,
  content: DataTypes.TEXT,
  sender_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  },
  recipient_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_urgent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  message_type: {
    type: DataTypes.ENUM('personal', 'announcement', 'system'),
    defaultValue: 'personal'
  },
  read_at: DataTypes.DATE
});

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  },
  title: DataTypes.STRING,
  message: DataTypes.TEXT,
  type: {
    type: DataTypes.ENUM('info', 'success', 'warning', 'error'),
    defaultValue: 'info'
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  action_url: DataTypes.STRING,
  read_at: DataTypes.DATE
});

// Mexican states data
const mexicanStates = [
  { code: 'AGS', name: 'Aguascalientes', capital: 'Aguascalientes', region: 'Centro' },
  { code: 'BC', name: 'Baja California', capital: 'Mexicali', region: 'Norte' },
  { code: 'BCS', name: 'Baja California Sur', capital: 'La Paz', region: 'Norte' },
  { code: 'CAM', name: 'Campeche', capital: 'Campeche', region: 'Sureste' },
  { code: 'CHIS', name: 'Chiapas', capital: 'Tuxtla Gutiérrez', region: 'Sureste' },
  { code: 'CHIH', name: 'Chihuahua', capital: 'Chihuahua', region: 'Norte' },
  { code: 'COAH', name: 'Coahuila', capital: 'Saltillo', region: 'Norte' },
  { code: 'COL', name: 'Colima', capital: 'Colima', region: 'Oeste' },
  { code: 'CDMX', name: 'Ciudad de México', capital: 'Ciudad de México', region: 'Centro' },
  { code: 'DGO', name: 'Durango', capital: 'Durango', region: 'Norte' },
  { code: 'GTO', name: 'Guanajuato', capital: 'Guanajuato', region: 'Centro' },
  { code: 'GRO', name: 'Guerrero', capital: 'Chilpancingo', region: 'Sur' },
  { code: 'HGO', name: 'Hidalgo', capital: 'Pachuca', region: 'Centro' },
  { code: 'JAL', name: 'Jalisco', capital: 'Guadalajara', region: 'Oeste' },
  { code: 'MEX', name: 'Estado de México', capital: 'Toluca', region: 'Centro' },
  { code: 'MICH', name: 'Michoacán', capital: 'Morelia', region: 'Oeste' },
  { code: 'MOR', name: 'Morelos', capital: 'Cuernavaca', region: 'Centro' },
  { code: 'NAY', name: 'Nayarit', capital: 'Tepic', region: 'Oeste' },
  { code: 'NL', name: 'Nuevo León', capital: 'Monterrey', region: 'Norte' },
  { code: 'OAX', name: 'Oaxaca', capital: 'Oaxaca', region: 'Sur' },
  { code: 'PUE', name: 'Puebla', capital: 'Puebla', region: 'Centro' },
  { code: 'QRO', name: 'Querétaro', capital: 'Querétaro', region: 'Centro' },
  { code: 'QROO', name: 'Quintana Roo', capital: 'Chetumal', region: 'Sureste' },
  { code: 'SLP', name: 'San Luis Potosí', capital: 'San Luis Potosí', region: 'Centro' },
  { code: 'SIN', name: 'Sinaloa', capital: 'Culiacán', region: 'Norte' },
  { code: 'SON', name: 'Sonora', capital: 'Hermosillo', region: 'Norte' },
  { code: 'TAB', name: 'Tabasco', capital: 'Villahermosa', region: 'Sureste' },
  { code: 'TAMPS', name: 'Tamaulipas', capital: 'Ciudad Victoria', region: 'Norte' },
  { code: 'TLAX', name: 'Tlaxcala', capital: 'Tlaxcala', region: 'Centro' },
  { code: 'VER', name: 'Veracruz', capital: 'Xalapa', region: 'Este' },
  { code: 'YUC', name: 'Yucatán', capital: 'Mérida', region: 'Sureste' },
  { code: 'ZAC', name: 'Zacatecas', capital: 'Zacatecas', region: 'Norte' }
];

async function seedData() {
  try {
    console.log('🔄 Starting comprehensive data seeding...');
    
    // Sync database
    await sequelize.sync({ force: true });
    console.log('✅ Database synced');

    // Seed states
    const states = await State.bulkCreate(mexicanStates);
    console.log(`✅ Seeded ${states.length} Mexican states`);

    // Common password for all test users
    const hashedPassword = await bcrypt.hash('Test123!', 10);

    // Create Federation Admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@pickleball.mx',
      password_hash: hashedPassword,
      role: 'federation',
      is_active: true,
      is_verified: true
    });
    console.log('✅ Created federation admin user');

    // Create test players
    const playerUsers = [];
    const players = [];
    for (let i = 1; i <= 5; i++) {
      const user = await User.create({
        username: `player${i}`,
        email: `player${i}@example.com`,
        password_hash: hashedPassword,
        role: 'player',
        is_active: true,
        is_verified: true
      });
      playerUsers.push(user);

      const player = await Player.create({
        user_id: user.id,
        full_name: `Test Player ${i}`,
        date_of_birth: new Date(1990 + i, i, i),
        gender: i % 2 === 0 ? 'female' : 'male',
        curp: `AAAA${String(900000 + i).padStart(6, '0')}HDFAAA0${i}`,
        mobile_phone: `+52555000${1000 + i}`,
        state_id: states[i % states.length].id,
        city: `Ciudad ${i}`,
        address: `Calle Test ${i}, Col. Demo`,
        nrtp_level: 2.5 + (i * 0.5),
        ranking_position: i,
        membership_status: 'active',
        membership_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        is_visible: true,
        privacy_policy_accepted: true,
        privacy_policy_accepted_at: new Date()
      });
      players.push(player);
    }
    console.log(`✅ Created ${players.length} test players`);

    // Create test coaches
    const coachUsers = [];
    const coaches = [];
    for (let i = 1; i <= 3; i++) {
      const user = await User.create({
        username: `coach${i}`,
        email: `coach${i}@example.com`,
        password_hash: hashedPassword,
        role: 'coach',
        is_active: true,
        is_verified: true
      });
      coachUsers.push(user);

      const coach = await Coach.create({
        user_id: user.id,
        full_name: `Test Coach ${i}`,
        date_of_birth: new Date(1985 + i, i, i),
        gender: i % 2 === 0 ? 'female' : 'male',
        curp: `BBBB${String(850000 + i).padStart(6, '0')}HDFBBB0${i}`,
        mobile_phone: `+52555001${1000 + i}`,
        state_id: states[i % states.length].id,
        city: `Ciudad Coach ${i}`,
        address: `Av. Entrenador ${i}, Col. Deportiva`,
        coaching_level: `Level ${i}`,
        certification_number: `CERT-2024-${String(i).padStart(4, '0')}`,
        specialization: ['Beginners', 'Intermediate', 'Advanced'][i - 1],
        years_experience: i * 2,
        membership_status: 'active',
        membership_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        privacy_policy_accepted: true,
        privacy_policy_accepted_at: new Date()
      });
      coaches.push(coach);
    }
    console.log(`✅ Created ${coaches.length} test coaches`);

    // Create test clubs
    const clubUsers = [];
    const clubs = [];
    for (let i = 1; i <= 3; i++) {
      const user = await User.create({
        username: `club${i}`,
        email: `club${i}@example.com`,
        password_hash: hashedPassword,
        role: 'club',
        is_active: true,
        is_verified: true
      });
      clubUsers.push(user);

      const club = await Club.create({
        user_id: user.id,
        name: `Club Pickleball ${['Norte', 'Centro', 'Sur'][i - 1]}`,
        rfc: `CPN${String(2024000 + i).padStart(7, '0')}AA${i}`,
        manager_name: `Manager ${i}`,
        manager_role: 'Director General',
        contact_email: `contact@club${i}.com`,
        phone: `+52555002${1000 + i}`,
        state_id: states[i * 3 % states.length].id,
        city: `Ciudad Club ${i}`,
        address: `Plaza Deportiva ${i}, Col. Recreativa`,
        club_type: ['competitive', 'recreational', 'mixed'][i - 1],
        website: `https://club${i}.com`,
        social_media: {
          facebook: `@club${i}`,
          instagram: `@club${i}_pickleball`
        },
        description: `Premier pickleball club in the ${['northern', 'central', 'southern'][i - 1]} region`,
        founded_date: new Date(2020 + i, 0, 1),
        membership_status: 'active',
        membership_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        has_courts: true,
        premium_plan: i === 1,
        privacy_policy_accepted: true,
        privacy_policy_accepted_at: new Date()
      });
      clubs.push(club);
    }
    console.log(`✅ Created ${clubs.length} test clubs`);

    // Create test partners
    const partnerUsers = [];
    const partners = [];
    for (let i = 1; i <= 2; i++) {
      const user = await User.create({
        username: `partner${i}`,
        email: `partner${i}@example.com`,
        password_hash: hashedPassword,
        role: 'partner',
        is_active: true,
        is_verified: true
      });
      partnerUsers.push(user);

      const partner = await Partner.create({
        user_id: user.id,
        business_name: `${['Resort Paradise', 'Sports Complex'][i - 1]}`,
        rfc: `RPX${String(2024000 + i).padStart(7, '0')}BB${i}`,
        contact_person_name: `Contact Person ${i}`,
        contact_person_title: 'Business Development Manager',
        contact_email: `business@partner${i}.com`,
        phone: `+52555003${1000 + i}`,
        partner_type: ['resort', 'court_owner'][i - 1],
        state_id: states[i * 5 % states.length].id,
        city: `Ciudad Partner ${i}`,
        address: `Boulevard Comercial ${i}, Col. Empresarial`,
        website: `https://partner${i}.com`,
        social_media: {
          facebook: `@partner${i}`,
          linkedin: `partner${i}-business`
        },
        description: `Leading ${['hospitality', 'sports'][i - 1]} partner for pickleball`,
        has_courts: true,
        premium_plan: true,
        privacy_policy_accepted: true,
        privacy_policy_accepted_at: new Date()
      });
      partners.push(partner);
    }
    console.log(`✅ Created ${partners.length} test partners`);

    // Create test state committees
    const stateUsers = [];
    const stateCommittees = [];
    for (let i = 1; i <= 2; i++) {
      const user = await User.create({
        username: `state${i}`,
        email: `state${i}@pickleball.mx`,
        password_hash: hashedPassword,
        role: 'state',
        is_active: true,
        is_verified: true
      });
      stateUsers.push(user);

      const stateCommittee = await StateCommittee.create({
        user_id: user.id,
        name: `Comité Estatal de ${states[i].name}`,
        rfc: `CES${String(2024000 + i).padStart(7, '0')}CC${i}`,
        president_name: `Presidente ${i}`,
        president_role: 'Presidente del Comité',
        institutional_email: `comite@${states[i].code.toLowerCase()}.pickleball.mx`,
        phone: `+52555004${1000 + i}`,
        state_id: states[i].id,
        affiliate_type: 'Comité Estatal Oficial',
        website: `https://${states[i].code.toLowerCase()}.pickleball.mx`,
        social_media: {
          facebook: `@pickleball${states[i].code}`,
          twitter: `@pb_${states[i].code.toLowerCase()}`
        },
        description: `Official state committee for pickleball in ${states[i].name}`,
        established_date: new Date(2022, i, 1),
        membership_status: 'active',
        membership_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        privacy_policy_accepted: true,
        privacy_policy_accepted_at: new Date()
      });
      stateCommittees.push(stateCommittee);
    }
    console.log(`✅ Created ${stateCommittees.length} test state committees`);

    // Create sample messages
    const messages = [];
    
    // Admin to all players
    for (const playerUser of playerUsers) {
      const message = await Message.create({
        subject: 'Bienvenido a la Federación Mexicana de Pickleball',
        content: `Estimado jugador, le damos la bienvenida a nuestra plataforma. Su cuenta ha sido activada exitosamente.`,
        sender_id: adminUser.id,
        recipient_id: playerUser.id,
        is_read: false,
        is_urgent: false,
        message_type: 'announcement'
      });
      messages.push(message);
    }

    // Club to its members (simulation)
    if (clubUsers.length > 0 && playerUsers.length > 0) {
      const message = await Message.create({
        subject: 'Torneo Local - Inscripciones Abiertas',
        content: 'Las inscripciones para el torneo local de primavera están abiertas. ¡No te lo pierdas!',
        sender_id: clubUsers[0].id,
        recipient_id: playerUsers[0].id,
        is_read: false,
        is_urgent: true,
        message_type: 'announcement'
      });
      messages.push(message);
    }

    console.log(`✅ Created ${messages.length} test messages`);

    // Create sample notifications
    const notifications = [];
    
    for (const playerUser of playerUsers) {
      const notification = await Notification.create({
        user_id: playerUser.id,
        title: 'Perfil Actualizado',
        message: 'Tu perfil ha sido actualizado exitosamente',
        type: 'success',
        is_read: false
      });
      notifications.push(notification);
    }

    for (const clubUser of clubUsers) {
      const notification = await Notification.create({
        user_id: clubUser.id,
        title: 'Nueva Funcionalidad',
        message: 'Ahora puedes gestionar torneos desde tu panel',
        type: 'info',
        is_read: false,
        action_url: '/dashboard/management'
      });
      notifications.push(notification);
    }

    console.log(`✅ Created ${notifications.length} test notifications`);

    console.log('\n📊 Summary of seeded data:');
    console.log('================================');
    console.log(`✅ States: ${states.length}`);
    console.log(`✅ Admin Users: 1`);
    console.log(`✅ Players: ${players.length}`);
    console.log(`✅ Coaches: ${coaches.length}`);
    console.log(`✅ Clubs: ${clubs.length}`);
    console.log(`✅ Partners: ${partners.length}`);
    console.log(`✅ State Committees: ${stateCommittees.length}`);
    console.log(`✅ Messages: ${messages.length}`);
    console.log(`✅ Notifications: ${notifications.length}`);
    
    console.log('\n🔑 Test Credentials:');
    console.log('================================');
    console.log('Admin: admin@pickleball.mx / Test123!');
    console.log('Player: player1@example.com / Test123!');
    console.log('Coach: coach1@example.com / Test123!');
    console.log('Club: club1@example.com / Test123!');
    console.log('Partner: partner1@example.com / Test123!');
    console.log('State: state1@pickleball.mx / Test123!');
    
    console.log('\n✨ Comprehensive data seeding completed successfully!');
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();