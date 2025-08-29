import bcrypt from 'bcryptjs';
import User from '../models/User';
import Player from '../models/Player';
import Coach from '../models/Coach';
import Club from '../models/Club';
import Partner from '../models/Partner';
import StateCommittee from '../models/StateCommittee';

export const seedUsers = async (states: any[]): Promise<any[]> => {
  console.log('👥 Seeding users and profiles...');
  
  const hashedPassword = await bcrypt.hash('password123', 12);
  const users = [];

  // Admin/Federation user
  const adminUser = await User.create({
    username: 'admin',
    email: 'admin@federacionpickleball.mx',
    passwordHash: hashedPassword,
    role: 'federation',
    isActive: true,
    emailVerified: true,
    lastLogin: new Date()
  });
  users.push(adminUser);

  // Player users
  const playerUsers = await User.bulkCreate([
    {
      username: 'jugador1',
      email: 'jugador1@example.com',
      passwordHash: hashedPassword,
      role: 'player',
      isActive: true,
      emailVerified: true,
      lastLogin: new Date()
    },
    {
      username: 'jugador2',
      email: 'jugador2@example.com',
      passwordHash: hashedPassword,
      role: 'player',
      isActive: true,
      emailVerified: true,
      lastLogin: new Date()
    },
    {
      username: 'jugador3',
      email: 'jugador3@example.com',
      passwordHash: hashedPassword,
      role: 'player',
      isActive: true,
      emailVerified: true,
      lastLogin: new Date()
    },
    {
      username: 'maria_santos',
      email: 'maria.santos@email.com',
      passwordHash: hashedPassword,
      role: 'player',
      isActive: true,
      emailVerified: true,
      lastLogin: new Date()
    },
    {
      username: 'carlos_rivera',
      email: 'carlos.rivera@email.com',
      passwordHash: hashedPassword,
      role: 'player',
      isActive: true,
      emailVerified: false,
      lastLogin: null
    }
  ], { returning: true });
  users.push(...playerUsers);

  // Create player profiles
  await Player.bulkCreate([
    {
      userId: playerUsers[0].id,
      fullName: 'Carlos Rodríguez García',
      dateOfBirth: new Date('1985-03-15'),
      gender: 'M',
      stateId: states.find(s => s.code === 'CDMX')?.id || states[0].id,
      curp: 'ROGC850315HDFDRR09',
      nrtpLevel: '3.5',
      mobilePhone: '+525551234567',
      nationality: 'Mexicana',
      canBeFound: true,
      isPremium: false,
      rankingPosition: 25,
      federationIdNumber: 'FPM-2024-001'
    },
    {
      userId: playerUsers[1].id,
      fullName: 'María Elena Sánchez López',
      dateOfBirth: new Date('1990-07-22'),
      gender: 'F',
      stateId: states.find(s => s.code === 'JAL')?.id || states[1].id,
      curp: 'SALM900722MJCNPR07',
      nrtpLevel: '4.0',
      mobilePhone: '+523331234567',
      nationality: 'Mexicana',
      canBeFound: true,
      isPremium: true,
      rankingPosition: 12,
      federationIdNumber: 'FPM-2024-002'
    },
    {
      userId: playerUsers[2].id,
      fullName: 'Roberto Martínez Hernández',
      dateOfBirth: new Date('1988-12-03'),
      gender: 'M',
      stateId: states.find(s => s.code === 'NL')?.id || states[2].id,
      curp: 'MAHR881203HPLRRT01',
      nrtpLevel: '3.0',
      mobilePhone: '+528121234567',
      nationality: 'Mexicana',
      canBeFound: false,
      isPremium: false,
      rankingPosition: 45,
      federationIdNumber: 'FPM-2024-003'
    },
    {
      userId: playerUsers[3].id,
      fullName: 'María Fernanda Santos Gutiérrez',
      dateOfBirth: new Date('1992-01-08'),
      gender: 'F',
      stateId: states.find(s => s.code === 'GTO')?.id || states[3].id,
      curp: 'SAGM920108MGTNSRR02',
      nrtpLevel: '4.5',
      mobilePhone: '+524731234567',
      nationality: 'Mexicana',
      canBeFound: true,
      isPremium: true,
      rankingPosition: 8,
      federationIdNumber: 'FPM-2024-004'
    },
    {
      userId: playerUsers[4].id,
      fullName: 'Carlos Eduardo Rivera Morales',
      dateOfBirth: new Date('1987-09-14'),
      gender: 'M',
      stateId: states.find(s => s.code === 'PUE')?.id || states[4].id,
      curp: 'RIMC870914HPLVRR08',
      nrtpLevel: '2.5',
      mobilePhone: '+522221234567',
      nationality: 'Mexicana',
      canBeFound: true,
      isPremium: false,
      rankingPosition: 67,
      federationIdNumber: 'FPM-2024-005'
    }
  ]);

  // Coach users
  const coachUsers = await User.bulkCreate([
    {
      username: 'entrenador1',
      email: 'entrenador1@example.com',
      passwordHash: hashedPassword,
      role: 'coach',
      isActive: true,
      emailVerified: true,
      lastLogin: new Date()
    },
    {
      username: 'ana_gonzalez',
      email: 'ana.gonzalez@coaching.mx',
      passwordHash: hashedPassword,
      role: 'coach',
      isActive: true,
      emailVerified: true,
      lastLogin: new Date()
    },
    {
      username: 'luis_fernandez',
      email: 'luis.fernandez@coaching.mx',
      passwordHash: hashedPassword,
      role: 'coach',
      isActive: true,
      emailVerified: true,
      lastLogin: new Date()
    }
  ], { returning: true });
  users.push(...coachUsers);

  // Create coach profiles
  await Coach.bulkCreate([
    {
      userId: coachUsers[0].id,
      fullName: 'Ana Patricia González Ruiz',
      dateOfBirth: new Date('1975-09-10'),
      gender: 'F',
      stateId: states.find(s => s.code === 'CDMX')?.id || states[0].id,
      curp: 'GORA750910MDFNZN02',
      nrtpLevel: '5.0',
      mobilePhone: '+525559876543',
      nationality: 'Mexicana',
      licenseType: 'Nivel 2 - Instructor Avanzado',
      rankingPosition: 3,
      federationIdNumber: 'FPM-ENT-2024-001'
    },
    {
      userId: coachUsers[1].id,
      fullName: 'Ana Sofía González Martín',
      dateOfBirth: new Date('1982-06-25'),
      gender: 'F',
      stateId: states.find(s => s.code === 'CDMX')?.id || states[0].id,
      curp: 'GOMA820625MDFNTR04',
      nrtpLevel: '5.0+',
      mobilePhone: '+525559876544',
      nationality: 'Mexicana',
      licenseType: 'Nivel 3 - Instructor Profesional',
      rankingPosition: 1,
      federationIdNumber: 'FPM-ENT-2024-002'
    },
    {
      userId: coachUsers[2].id,
      fullName: 'José Luis Fernández Castro',
      dateOfBirth: new Date('1980-04-18'),
      gender: 'M',
      stateId: states.find(s => s.code === 'JAL')?.id || states[1].id,
      curp: 'FECJ800418HJCRSL05',
      nrtpLevel: '4.5',
      mobilePhone: '+523339876543',
      nationality: 'Mexicana',
      licenseType: 'Nivel 1 - Instructor Básico',
      rankingPosition: 8,
      federationIdNumber: 'FPM-ENT-2024-003'
    }
  ]);

  // Club users
  const clubUsers = await User.bulkCreate([
    {
      username: 'club_cdmx',
      email: 'contacto@clubpickleball.mx',
      passwordHash: hashedPassword,
      role: 'club',
      isActive: true,
      emailVerified: true,
      lastLogin: new Date()
    },
    {
      username: 'club_monterrey',
      email: 'info@deportesmonterrey.mx',
      passwordHash: hashedPassword,
      role: 'club',
      isActive: true,
      emailVerified: true,
      lastLogin: new Date()
    },
    {
      username: 'club_guadalajara',
      email: 'contacto@pickleballgdl.mx',
      passwordHash: hashedPassword,
      role: 'club',
      isActive: true,
      emailVerified: true,
      lastLogin: new Date()
    }
  ], { returning: true });
  users.push(...clubUsers);

  // Create club profiles
  await Club.bulkCreate([
    {
      userId: clubUsers[0].id,
      name: 'Club Pickleball Ciudad de México',
      rfc: 'CPC240101ABC',
      managerName: 'Sandra Patricia Morales Vega',
      managerRole: 'Directora General',
      contactEmail: 'contacto@clubpickleball.mx',
      phone: '+525551122334',
      stateId: states.find(s => s.code === 'CDMX')?.id || states[0].id,
      clubType: 'Privado',
      website: 'https://www.clubpickleball.mx',
      socialMedia: {
        facebook: 'clubpickleballcdmx',
        instagram: '@clubpickleballcdmx',
        twitter: '@clubpcmx'
      },
      hasCourts: true,
      planType: 'premium'
    },
    {
      userId: clubUsers[1].id,
      name: 'Centro Deportivo Monterrey',
      rfc: 'CDM240101XYZ',
      managerName: 'Ricardo Alejandro Gutiérrez Soto',
      managerRole: 'Coordinador Deportivo',
      contactEmail: 'info@deportesmonterrey.mx',
      phone: '+528112233445',
      stateId: states.find(s => s.code === 'NL')?.id || states[2].id,
      clubType: 'Público',
      website: 'https://www.deportesmonterrey.mx',
      socialMedia: {
        facebook: 'deportesmonterrey',
        instagram: '@deportesmty'
      },
      hasCourts: true,
      planType: 'basic'
    },
    {
      userId: clubUsers[2].id,
      name: 'Club Elite Pickleball Guadalajara',
      rfc: 'CEP240101GDL',
      managerName: 'Patricia Elena Ramírez Flores',
      managerRole: 'Gerente General',
      contactEmail: 'contacto@pickleballgdl.mx',
      phone: '+523312233445',
      stateId: states.find(s => s.code === 'JAL')?.id || states[1].id,
      clubType: 'Privado',
      website: 'https://www.pickleballgdl.mx',
      socialMedia: {
        facebook: 'pickleballgdl',
        instagram: '@pickleballgdl',
        twitter: '@elitepickleballgdl'
      },
      hasCourts: true,
      planType: 'premium'
    }
  ]);

  // Partner users
  const partnerUsers = await User.bulkCreate([
    {
      username: 'deportes_mexico',
      email: 'contacto@deportesmexico.mx',
      passwordHash: hashedPassword,
      role: 'partner',
      isActive: true,
      emailVerified: true,
      lastLogin: new Date()
    },
    {
      username: 'hotel_riviera',
      email: 'eventos@hotelriviera.mx',
      passwordHash: hashedPassword,
      role: 'partner',
      isActive: true,
      emailVerified: true,
      lastLogin: new Date()
    }
  ], { returning: true });
  users.push(...partnerUsers);

  // Create partner profiles
  await Partner.bulkCreate([
    {
      userId: partnerUsers[0].id,
      businessName: 'Deportes México S.A. de C.V.',
      rfc: 'DME240101DEF',
      contactPersonName: 'Alejandro Ramírez Mendoza',
      contactPersonTitle: 'Director de Patrocinios',
      email: 'contacto@deportesmexico.mx',
      phone: '+525553344556',
      partnerType: 'Patrocinador Principal',
      website: 'https://www.deportesmexico.mx',
      socialMedia: {
        facebook: 'deportesmexico',
        instagram: '@deportesmx',
        linkedin: 'deportes-mexico-sa'
      },
      planType: 'premium'
    },
    {
      userId: partnerUsers[1].id,
      businessName: 'Hotel Riviera Maya Resort & Spa',
      rfc: 'HRM240101RST',
      contactPersonName: 'Isabella Torres Velasco',
      contactPersonTitle: 'Coordinadora de Eventos Deportivos',
      email: 'eventos@hotelriviera.mx',
      phone: '+529984455667',
      partnerType: 'Hotel y Resort',
      website: 'https://www.hotelriviera.mx',
      socialMedia: {
        facebook: 'hotelrivieramaya',
        instagram: '@hotelrivieramx'
      },
      planType: 'premium'
    }
  ]);

  // State committee users
  const stateUsers = await User.bulkCreate([
    {
      username: 'comite_cdmx',
      email: 'presidente@pickleballcdmx.mx',
      passwordHash: hashedPassword,
      role: 'state',
      isActive: true,
      emailVerified: true,
      lastLogin: new Date()
    },
    {
      username: 'comite_jalisco',
      email: 'contacto@pickleballjalisco.mx',
      passwordHash: hashedPassword,
      role: 'state',
      isActive: true,
      emailVerified: true,
      lastLogin: new Date()
    }
  ], { returning: true });
  users.push(...stateUsers);

  // Create state committee profiles
  await StateCommittee.bulkCreate([
    {
      userId: stateUsers[0].id,
      name: 'Asociación de Pickleball de la Ciudad de México',
      rfc: 'APC240101GHI',
      presidentName: 'Licenciada Martha Elena Vázquez Torres',
      presidentTitle: 'Presidenta',
      institutionalEmail: 'presidente@pickleballcdmx.mx',
      phone: '+525554455667',
      stateId: states.find(s => s.code === 'CDMX')?.id || states[0].id,
      affiliateType: 'Asociación Civil',
      website: 'https://www.pickleballcdmx.mx',
      socialMedia: {
        facebook: 'pickleballcdmx',
        instagram: '@pickleballcdmx'
      }
    },
    {
      userId: stateUsers[1].id,
      name: 'Comité Estatal de Pickleball de Jalisco',
      rfc: 'CPJ240101JLM',
      presidentName: 'Ingeniero Fernando Aguilar Sánchez',
      presidentTitle: 'Presidente',
      institutionalEmail: 'contacto@pickleballjalisco.mx',
      phone: '+523335544667',
      stateId: states.find(s => s.code === 'JAL')?.id || states[1].id,
      affiliateType: 'Asociación Deportiva',
      website: 'https://www.pickleballjalisco.mx',
      socialMedia: {
        facebook: 'pickleballjalisco',
        instagram: '@pickleballjalisco',
        twitter: '@pickleballjalisco'
      }
    }
  ]);

  console.log(`✅ Seeded ${users.length} users with their profiles`);
  return users;
};

export default seedUsers;