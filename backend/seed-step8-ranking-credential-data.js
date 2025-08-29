const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const path = require('path');
const crypto = require('crypto');

// Use SQLite for seeding
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'data/development.sqlite'),
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  }
});

// Import all models (we'll define them inline since we're having import issues)
const models = {};

// Define models inline for seeding
function defineModels() {
  // User Model
  models.User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    tableName: 'users'
  });

  // Player Model
  models.Player = sequelize.define('Player', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: DataTypes.INTEGER,
    stateId: DataTypes.INTEGER,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    birthDate: DataTypes.DATE,
    gender: DataTypes.STRING,
    nrtpLevel: DataTypes.STRING,
    currentRating: DataTypes.DECIMAL,
    profilePicture: DataTypes.STRING
  }, {
    tableName: 'players'
  });

  // Tournament Model
  models.Tournament = sequelize.define('Tournament', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    level: DataTypes.STRING,
    startDate: DataTypes.DATE,
    stateId: DataTypes.INTEGER
  }, {
    tableName: 'tournaments'
  });

  // State Model
  models.State = sequelize.define('State', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    abbreviation: DataTypes.STRING
  }, {
    tableName: 'states'
  });

  // Ranking Model
  models.Ranking = sequelize.define('Ranking', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    playerId: DataTypes.INTEGER,
    rankingType: DataTypes.STRING,
    category: DataTypes.STRING,
    position: DataTypes.INTEGER,
    points: DataTypes.DECIMAL,
    previousPosition: DataTypes.INTEGER,
    previousPoints: DataTypes.DECIMAL,
    stateId: DataTypes.INTEGER,
    ageGroup: DataTypes.STRING,
    gender: DataTypes.STRING,
    tournamentsPlayed: DataTypes.INTEGER,
    lastTournamentDate: DataTypes.DATE,
    activityBonus: DataTypes.DECIMAL,
    decayFactor: DataTypes.DECIMAL,
    lastCalculated: DataTypes.DATE,
    isActive: DataTypes.BOOLEAN
  }, {
    tableName: 'rankings'
  });

  // RankingHistory Model
  models.RankingHistory = sequelize.define('RankingHistory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    playerId: DataTypes.INTEGER,
    rankingType: DataTypes.STRING,
    category: DataTypes.STRING,
    oldPosition: DataTypes.INTEGER,
    newPosition: DataTypes.INTEGER,
    oldPoints: DataTypes.DECIMAL,
    newPoints: DataTypes.DECIMAL,
    pointsChange: DataTypes.DECIMAL,
    positionChange: DataTypes.INTEGER,
    changeReason: DataTypes.STRING,
    tournamentId: DataTypes.INTEGER,
    changeDate: DataTypes.DATE,
    stateId: DataTypes.INTEGER,
    ageGroup: DataTypes.STRING,
    gender: DataTypes.STRING
  }, {
    tableName: 'ranking_history'
  });

  // PointCalculation Model
  models.PointCalculation = sequelize.define('PointCalculation', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tournamentId: DataTypes.INTEGER,
    playerId: DataTypes.INTEGER,
    matchId: DataTypes.INTEGER,
    basePoints: DataTypes.DECIMAL,
    placementMultiplier: DataTypes.DECIMAL,
    levelMultiplier: DataTypes.DECIMAL,
    opponentBonus: DataTypes.DECIMAL,
    activityBonus: DataTypes.DECIMAL,
    participationBonus: DataTypes.DECIMAL,
    totalPoints: DataTypes.DECIMAL,
    finalPlacement: DataTypes.INTEGER,
    totalPlayers: DataTypes.INTEGER,
    matchesWon: DataTypes.INTEGER,
    matchesLost: DataTypes.INTEGER,
    averageOpponentRating: DataTypes.DECIMAL,
    calculationDetails: DataTypes.JSON,
    calculatedAt: DataTypes.DATE
  }, {
    tableName: 'point_calculations'
  });

  // Credential Model
  models.Credential = sequelize.define('Credential', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    userId: DataTypes.INTEGER,
    userType: DataTypes.STRING,
    federationName: DataTypes.STRING,
    federationLogo: DataTypes.STRING,
    stateName: DataTypes.STRING,
    stateId: DataTypes.INTEGER,
    fullName: DataTypes.STRING,
    nrtpLevel: DataTypes.STRING,
    affiliationStatus: DataTypes.STRING,
    rankingPosition: DataTypes.INTEGER,
    clubName: DataTypes.STRING,
    licenseType: DataTypes.STRING,
    qrCode: DataTypes.TEXT,
    federationIdNumber: DataTypes.STRING,
    nationality: DataTypes.STRING,
    photo: DataTypes.STRING,
    issuedDate: DataTypes.DATE,
    expirationDate: DataTypes.DATE,
    status: DataTypes.STRING,
    verificationUrl: DataTypes.STRING,
    checksum: DataTypes.STRING,
    lastVerified: DataTypes.DATE,
    verificationCount: DataTypes.INTEGER,
    metadata: DataTypes.JSON
  }, {
    tableName: 'credentials'
  });
}

defineModels();

async function seedRankingCredentialData() {
  try {
    console.log('Starting Step 8 ranking and credential data seeding...');

    // Sync models to create tables if they don't exist
    await sequelize.sync({ force: false });

    // Clear existing data (with try-catch for tables that might not exist)
    try {
      await models.RankingHistory.destroy({ where: {} });
      await models.PointCalculation.destroy({ where: {} });
      await models.Ranking.destroy({ where: {} });
      await models.Credential.destroy({ where: {} });
      console.log('Cleared existing ranking and credential data');
    } catch (error) {
      console.log('Some tables may not exist yet, continuing with seeding...');
    }

    // Get existing data for seeding
    const players = await models.Player.findAll();
    const tournaments = await models.Tournament.findAll();
    const states = await models.State.findAll();
    const users = await models.User.findAll();

    if (players.length === 0 || tournaments.length === 0 || states.length === 0) {
      console.log('Warning: No players, tournaments, or states found. Running basic data seed...');
      return;
    }

    console.log(`Found ${players.length} players, ${tournaments.length} tournaments, ${states.length} states`);

    // 1. Create Point Calculations
    const pointCalculations = [];
    const rankingData = new Map(); // Map to track player rankings

    for (let i = 0; i < Math.min(tournaments.length, 10); i++) {
      const tournament = tournaments[i];
      const participantCount = Math.min(players.length, Math.floor(Math.random() * 32) + 8);
      const tournamentPlayers = players.slice(0, participantCount).sort(() => 0.5 - Math.random());

      console.log(`Processing tournament: ${tournament.name} with ${participantCount} players`);

      // Base points based on tournament level
      const basePointsMap = {
        'National': 1000,
        'State': 500,
        'Municipal': 250,
        'Local': 100
      };
      const basePoints = basePointsMap[tournament.level] || 100;

      for (let j = 0; j < tournamentPlayers.length; j++) {
        const player = tournamentPlayers[j];
        const finalPlacement = j + 1;
        
        // Calculate placement multiplier
        let placementMultiplier = 0.3; // default for other placements
        if (finalPlacement === 1) placementMultiplier = 1.0;
        else if (finalPlacement === 2) placementMultiplier = 0.7;
        else if (finalPlacement <= 4) placementMultiplier = 0.5;
        else if (finalPlacement <= Math.ceil(tournamentPlayers.length * 0.2)) placementMultiplier = 0.4;

        // Level multiplier based on NRTP level
        let levelMultiplier = 1.0;
        if (player.nrtpLevel) {
          const level = parseFloat(player.nrtpLevel);
          if (level >= 5.0) levelMultiplier = 1.5;
          else if (level >= 4.0) levelMultiplier = 1.2;
          else if (level >= 3.0) levelMultiplier = 1.0;
          else levelMultiplier = 0.8;
        }

        // Random opponent bonus and activity bonus
        const opponentBonus = Math.floor(Math.random() * 50);
        const activityBonus = Math.floor(Math.random() * 30);
        const participationBonus = 1.0 + (Math.random() * 0.2); // 1.0 to 1.2

        // Random matches won/lost
        const matchesWon = Math.floor(Math.random() * 5) + 1;
        const matchesLost = Math.floor(Math.random() * 3);
        
        const totalPoints = Math.round(
          (basePoints * placementMultiplier * levelMultiplier * participationBonus) + 
          opponentBonus + activityBonus
        );

        const pointCalc = {
          tournamentId: tournament.id,
          playerId: player.id,
          basePoints,
          placementMultiplier,
          levelMultiplier,
          opponentBonus,
          activityBonus,
          participationBonus,
          totalPoints,
          finalPlacement,
          totalPlayers: tournamentPlayers.length,
          matchesWon,
          matchesLost,
          averageOpponentRating: 1400 + Math.floor(Math.random() * 400),
          calculationDetails: {
            tournamentLevel: tournament.level,
            playerLevel: player.nrtpLevel,
            calculation: {
              basePoints,
              placementMultiplier,
              levelMultiplier,
              participationBonus,
              opponentBonus,
              activityBonus,
              totalPoints
            }
          },
          calculatedAt: new Date(tournament.startDate)
        };

        pointCalculations.push(pointCalc);

        // Track ranking data
        const key = player.id;
        if (!rankingData.has(key)) {
          rankingData.set(key, {
            playerId: player.id,
            totalPoints: 0,
            tournamentsPlayed: 0,
            lastTournamentDate: null
          });
        }
        
        const playerRanking = rankingData.get(key);
        playerRanking.totalPoints += totalPoints;
        playerRanking.tournamentsPlayed += 1;
        playerRanking.lastTournamentDate = tournament.startDate;
      }
    }

    // Batch insert point calculations
    await models.PointCalculation.bulkCreate(pointCalculations);
    console.log(`Created ${pointCalculations.length} point calculations`);

    // 2. Create Rankings for different categories
    const rankings = [];
    const rankingHistory = [];
    const rankingTypes = ['overall', 'singles', 'doubles', 'mixed_doubles'];
    const categories = ['national', 'state', 'age_group', 'gender'];

    // Sort players by total points for position calculation
    const sortedPlayers = Array.from(rankingData.entries()).sort((a, b) => b[1].totalPoints - a[1].totalPoints);

    for (const category of categories) {
      for (const rankingType of rankingTypes) {
        console.log(`Creating rankings for ${category} ${rankingType}`);

        if (category === 'national') {
          // National rankings - all players
          for (let i = 0; i < sortedPlayers.length; i++) {
            const [playerId, data] = sortedPlayers[i];
            const player = players.find(p => p.id === playerId);
            
            const ranking = {
              playerId,
              rankingType,
              category,
              position: i + 1,
              points: data.totalPoints,
              previousPosition: 0,
              previousPoints: 0,
              tournamentsPlayed: data.tournamentsPlayed,
              lastTournamentDate: data.lastTournamentDate,
              activityBonus: 0,
              decayFactor: 1.0,
              lastCalculated: new Date(),
              isActive: true
            };

            rankings.push(ranking);

            // Create history record
            rankingHistory.push({
              playerId,
              rankingType,
              category,
              oldPosition: 0,
              newPosition: i + 1,
              oldPoints: 0,
              newPoints: data.totalPoints,
              pointsChange: data.totalPoints,
              positionChange: i + 1,
              changeReason: 'Initial ranking calculation',
              changeDate: new Date()
            });
          }
        } else if (category === 'state') {
          // State rankings - group by state
          for (const state of states.slice(0, 5)) { // Limit to 5 states for performance
            const statePlayers = sortedPlayers.filter(([playerId]) => {
              const player = players.find(p => p.id === playerId);
              return player?.stateId === state.id;
            });

            for (let i = 0; i < statePlayers.length; i++) {
              const [playerId, data] = statePlayers[i];
              
              const ranking = {
                playerId,
                rankingType,
                category,
                position: i + 1,
                points: data.totalPoints,
                previousPosition: 0,
                previousPoints: 0,
                stateId: state.id,
                tournamentsPlayed: data.tournamentsPlayed,
                lastTournamentDate: data.lastTournamentDate,
                activityBonus: 0,
                decayFactor: 1.0,
                lastCalculated: new Date(),
                isActive: true
              };

              rankings.push(ranking);

              rankingHistory.push({
                playerId,
                rankingType,
                category,
                oldPosition: 0,
                newPosition: i + 1,
                oldPoints: 0,
                newPoints: data.totalPoints,
                pointsChange: data.totalPoints,
                positionChange: i + 1,
                changeReason: 'Initial state ranking calculation',
                changeDate: new Date(),
                stateId: state.id
              });
            }
          }
        } else if (category === 'age_group') {
          // Age group rankings
          const ageGroups = ['Under 19', '19-34', '35-49', '50-64', '65+'];
          
          for (const ageGroup of ageGroups) {
            const ageGroupPlayers = sortedPlayers.filter(([playerId]) => {
              const player = players.find(p => p.id === playerId);
              if (!player?.birthDate) return ageGroup === '35-49'; // Default age group
              
              const age = new Date().getFullYear() - new Date(player.birthDate).getFullYear();
              if (ageGroup === 'Under 19') return age < 19;
              if (ageGroup === '19-34') return age >= 19 && age < 35;
              if (ageGroup === '35-49') return age >= 35 && age < 50;
              if (ageGroup === '50-64') return age >= 50 && age < 65;
              if (ageGroup === '65+') return age >= 65;
              return false;
            });

            for (let i = 0; i < ageGroupPlayers.length; i++) {
              const [playerId, data] = ageGroupPlayers[i];
              
              const ranking = {
                playerId,
                rankingType,
                category,
                position: i + 1,
                points: data.totalPoints,
                previousPosition: 0,
                previousPoints: 0,
                ageGroup,
                tournamentsPlayed: data.tournamentsPlayed,
                lastTournamentDate: data.lastTournamentDate,
                activityBonus: 0,
                decayFactor: 1.0,
                lastCalculated: new Date(),
                isActive: true
              };

              rankings.push(ranking);
            }
          }
        } else if (category === 'gender') {
          // Gender rankings
          const genders = ['male', 'female'];
          
          for (const gender of genders) {
            const genderPlayers = sortedPlayers.filter(([playerId]) => {
              const player = players.find(p => p.id === playerId);
              return player?.gender === gender;
            });

            for (let i = 0; i < genderPlayers.length; i++) {
              const [playerId, data] = genderPlayers[i];
              
              const ranking = {
                playerId,
                rankingType,
                category,
                position: i + 1,
                points: data.totalPoints,
                previousPosition: 0,
                previousPoints: 0,
                gender,
                tournamentsPlayed: data.tournamentsPlayed,
                lastTournamentDate: data.lastTournamentDate,
                activityBonus: 0,
                decayFactor: 1.0,
                lastCalculated: new Date(),
                isActive: true
              };

              rankings.push(ranking);
            }
          }
        }
      }
    }

    // Batch insert rankings
    await models.Ranking.bulkCreate(rankings);
    console.log(`Created ${rankings.length} rankings`);

    // Batch insert ranking history
    await models.RankingHistory.bulkCreate(rankingHistory);
    console.log(`Created ${rankingHistory.length} ranking history records`);

    // 3. Create Credentials for top players and some coaches/admins
    const credentials = [];
    
    // Create credentials for top 20 players from national rankings
    const topPlayers = rankings
      .filter(r => r.category === 'national' && r.rankingType === 'overall')
      .slice(0, 20)
      .map(r => players.find(p => p.id === r.playerId))
      .filter(Boolean);

    for (const player of topPlayers) {
      const user = users.find(u => u.id === player.userId);
      const state = states.find(s => s.id === player.stateId);
      
      if (user && state) {
        const ranking = rankings.find(r => r.playerId === player.id && r.category === 'national' && r.rankingType === 'overall');
        
        // Generate federation ID
        const year = new Date().getFullYear().toString().slice(-2);
        const stateCode = state.id.toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        const federationIdNumber = `JUG-${year}${stateCode}-${random}`;

        // Generate verification URL and checksum
        const credentialId = crypto.randomUUID();
        const verificationUrl = `https://fmp.mx/verify/${credentialId}`;
        const checksumData = `${credentialId}${user.id}${federationIdNumber}${user.firstName} ${user.lastName}${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()}`;
        const checksum = crypto.createHash('sha256').update(checksumData).digest('hex');

        // Simple QR code data (in real implementation, this would be a proper QR code image)
        const qrCode = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==`;

        const credential = {
          id: credentialId,
          userId: user.id,
          userType: 'player',
          federationName: 'FEDERACIÓN MEXICANA DE PICKLEBALL',
          stateName: state.name,
          stateId: state.id,
          fullName: `${user.firstName} ${user.lastName}`,
          nrtpLevel: player.nrtpLevel,
          affiliationStatus: 'ACTIVO',
          rankingPosition: ranking ? ranking.position : null,
          clubName: Math.random() > 0.5 ? `Club ${state.name}` : null,
          qrCode,
          federationIdNumber,
          nationality: '🇲🇽 México',
          photo: player.profilePicture,
          issuedDate: new Date(),
          expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          status: 'active',
          verificationUrl,
          checksum,
          verificationCount: Math.floor(Math.random() * 10),
          lastVerified: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
          metadata: {
            createdBy: 'system',
            initialRanking: ranking ? ranking.position : null,
            initialPoints: ranking ? ranking.points : 0
          }
        };

        credentials.push(credential);
      }
    }

    // Create some credentials for coaches and admins
    const coachUsers = users.filter(u => u.role === 'coach').slice(0, 5);
    const adminUsers = users.filter(u => u.role === 'admin' || u.role === 'state').slice(0, 3);

    for (const user of [...coachUsers, ...adminUsers]) {
      const state = states[Math.floor(Math.random() * states.length)];
      const userType = user.role === 'coach' ? 'coach' : 'club_admin';
      
      // Generate federation ID
      const typePrefix = userType === 'coach' ? 'ENT' : 'ADM';
      const year = new Date().getFullYear().toString().slice(-2);
      const stateCode = state.id.toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
      const federationIdNumber = `${typePrefix}-${year}${stateCode}-${random}`;

      // Generate verification data
      const credentialId = crypto.randomUUID();
      const verificationUrl = `https://fmp.mx/verify/${credentialId}`;
      const checksumData = `${credentialId}${user.id}${federationIdNumber}${user.firstName} ${user.lastName}${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()}`;
      const checksum = crypto.createHash('sha256').update(checksumData).digest('hex');
      const qrCode = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==`;

      const credential = {
        id: credentialId,
        userId: user.id,
        userType,
        federationName: 'FEDERACIÓN MEXICANA DE PICKLEBALL',
        stateName: state.name,
        stateId: state.id,
        fullName: `${user.firstName} ${user.lastName}`,
        affiliationStatus: 'ACTIVO',
        licenseType: userType === 'coach' ? 'Entrenador Certificado' : 'Administrador de Club',
        qrCode,
        federationIdNumber,
        nationality: '🇲🇽 México',
        issuedDate: new Date(),
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: 'active',
        verificationUrl,
        checksum,
        verificationCount: Math.floor(Math.random() * 5),
        lastVerified: Math.random() > 0.7 ? new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000) : null,
        metadata: {
          createdBy: 'system',
          role: user.role
        }
      };

      credentials.push(credential);
    }

    // Batch insert credentials
    await models.Credential.bulkCreate(credentials);
    console.log(`Created ${credentials.length} credentials`);

    console.log('✅ Step 8 ranking and credential data seeding completed successfully!');
    console.log(`Summary:
    - Point Calculations: ${pointCalculations.length}
    - Rankings: ${rankings.length}
    - Ranking History: ${rankingHistory.length}
    - Credentials: ${credentials.length}
    `);

  } catch (error) {
    console.error('❌ Error seeding Step 8 data:', error);
    throw error;
  }
}

// Run the seeder
if (require.main === module) {
  seedRankingCredentialData()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedRankingCredentialData;