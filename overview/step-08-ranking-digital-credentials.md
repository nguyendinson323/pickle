# Step 8: Ranking System and Digital Credentials

## Overview
This step implements a comprehensive ranking system for players and coaches, automatic digital credential generation with QR codes, ranking history tracking, and point-based tournament ranking calculations. The system generates official federation ID cards that can be scanned for verification during tournaments and events.
Don't use any mockup data for frontend.
Do use only database data from backend.
Before rendering a page, all required data for the page should be prepared from backend through API endpoint to store on Redux.
For each page, you must accurately determine whether the functionalities of all dynamic elements, including buttons, are correctly integrated with the backend and accurately reflected in Redux to ensure real-time updates.
There are already data seeded to test in database .
You need to test with only this database seeded data from backend.
Don't use any mockup, simulation or random data for frontend.

## Objectives
- Build multi-category ranking system (National, State, Age Groups, Gender)
- Implement point-based ranking calculations from tournament results
- Create digital credential system with QR codes for players and coaches
- Build ranking history tracking and change notifications
- Generate downloadable credential PDFs and images
- Implement ranking verification system via QR code scanning
- Create ranking analytics and reports
- Build automated ranking updates after tournaments

## Ranking System Architecture

### Ranking Categories
1. **National Rankings**: Overall national standings
2. **State Rankings**: Rankings within each state
3. **Age Group Rankings**: Categories by age ranges
4. **Gender Rankings**: Separate men's and women's rankings
5. **Tournament Level Rankings**: Based on tournament tier participation

### Ranking Calculation Factors
- Tournament level points (National: 1000, State: 500, Local: 100)
- Placement points (Winner: 100%, Runner-up: 70%, Semifinalist: 50%)
- Opponent strength bonus (beating higher-ranked players)
- Activity bonus (regular tournament participation)
- Decay factor (points decrease over time without activity)

## Backend Development Tasks

### 1. Ranking System Controllers
**Files to Create:**
- `src/controllers/rankingController.ts` - Ranking CRUD operations
- `src/controllers/credentialController.ts` - Digital credential management
- `src/services/rankingService.ts` - Ranking calculations and logic
- `src/services/pointCalculationService.ts` - Tournament point calculations
- `src/services/credentialService.ts` - Credential generation

**Ranking Methods:**
```typescript
// Ranking Management
calculatePlayerRanking(playerId: number, category: RankingCategory): Promise<RankingData>
updateRankingsAfterTournament(tournamentId: number): Promise<void>
getRankings(category: RankingCategory, filters: RankingFilters): Promise<Ranking[]>
getPlayerRankingHistory(playerId: number): Promise<RankingHistory[]>
recalculateAllRankings(): Promise<void>

// Point Calculations
calculateTournamentPoints(tournament: Tournament, placement: number, totalPlayers: number): number
calculateOpponentBonus(playerRating: number, opponentRating: number, result: string): number
applyActivityBonus(playerId: number, rankingPoints: number): Promise<number>
applyDecayFactor(lastActivity: Date, currentPoints: number): number
```

### 2. Digital Credential System
**Files to Create:**
- `src/services/credentialService.ts` - Credential generation logic
- `src/utils/qrCodeGenerator.ts` - QR code generation
- `src/utils/pdfGenerator.ts` - PDF credential generation
- `src/services/verificationService.ts` - Credential verification

**Credential Methods:**
```typescript
// Credential Generation
generatePlayerCredential(playerId: number): Promise<Credential>
generateCoachCredential(coachId: number): Promise<Credential>
generateQRCode(credentialData: CredentialData): Promise<string>
generateCredentialPDF(credential: Credential): Promise<Buffer>
generateCredentialImage(credential: Credential): Promise<string>

// Verification
verifyCredential(qrData: string): Promise<CredentialVerification>
validateCredentialStatus(credentialId: string): Promise<boolean>
updateCredentialStatus(credentialId: string, status: CredentialStatus): Promise<void>
```

### 3. Ranking History and Analytics
**Files to Create:**
- `src/services/rankingHistoryService.ts` - History tracking
- `src/services/rankingAnalyticsService.ts` - Analytics and trends
- `src/jobs/rankingUpdateJob.ts` - Automated ranking updates

**History Methods:**
```typescript
// History Tracking
recordRankingChange(playerId: number, oldRanking: Ranking, newRanking: Ranking): Promise<void>
getRankingTrends(playerId: number, period: string): Promise<TrendData>
getTopPerformers(category: string, period: string): Promise<Player[]>
getRankingMovement(category: string, timeframe: string): Promise<RankingMovement[]>
```

### 4. API Endpoints
```
Ranking Endpoints:
GET /api/rankings/:category - Get rankings by category
GET /api/rankings/player/:id - Get player rankings
GET /api/rankings/player/:id/history - Get ranking history
POST /api/rankings/recalculate - Recalculate all rankings (admin)
PUT /api/rankings/update-after-tournament/:id - Update after tournament

Credential Endpoints:
GET /api/credentials/player/:id - Get player credential
GET /api/credentials/coach/:id - Get coach credential
GET /api/credentials/:id/pdf - Download credential PDF
GET /api/credentials/:id/image - Get credential image
POST /api/credentials/verify - Verify credential via QR code
PUT /api/credentials/:id/status - Update credential status

Analytics Endpoints:
GET /api/analytics/rankings/trends - Ranking trends
GET /api/analytics/rankings/top-movers - Biggest ranking changes
GET /api/analytics/rankings/state-stats - State ranking statistics
GET /api/analytics/rankings/activity - Activity-based analytics
```

## Frontend Development Tasks

### 1. Ranking Display Components
**Files to Create:**
- `src/components/rankings/RankingTable.tsx` - Ranking table display
- `src/components/rankings/RankingCard.tsx` - Individual ranking card
- `src/components/rankings/RankingFilters.tsx` - Category and filter controls
- `src/components/rankings/RankingTrends.tsx` - Ranking trend visualization
- `src/components/rankings/PlayerRankingProfile.tsx` - Player ranking details

### 2. Digital Credential Components
**Files to Create:**
- `src/components/credentials/DigitalCredential.tsx` - Digital ID display
- `src/components/credentials/QRCodeDisplay.tsx` - QR code component
- `src/components/credentials/CredentialDownload.tsx` - Download options
- `src/components/credentials/CredentialVerification.tsx` - QR scanner/verifier
- `src/components/credentials/CredentialPreview.tsx` - Preview before download

### 3. Ranking History Components
**Files to Create:**
- `src/components/history/RankingHistory.tsx` - Historical ranking display
- `src/components/history/RankingChart.tsx` - Ranking progression chart
- `src/components/history/AchievementBadges.tsx` - Achievement milestones
- `src/components/history/ComparisonTool.tsx` - Compare multiple players

### 4. QR Code Components
**Files to Create:**
- `src/components/qr/QRCodeScanner.tsx` - QR code scanner
- `src/components/qr/QRVerificationResult.tsx` - Verification result display
- `src/components/qr/QRGenerator.tsx` - QR code generator
- `src/components/qr/CredentialViewer.tsx` - View scanned credential

### 5. Pages
**Files to Create:**
- `src/pages/rankings/RankingsPage.tsx` - Main rankings page
- `src/pages/rankings/PlayerRankingPage.tsx` - Individual player rankings
- `src/pages/credentials/CredentialPage.tsx` - User credential page
- `src/pages/credentials/VerifyPage.tsx` - Credential verification page
- `src/pages/rankings/HistoryPage.tsx` - Ranking history page

### 6. Redux State Management
**Files to Create:**
- `src/store/rankingsSlice.ts` - Rankings state
- `src/store/credentialsSlice.ts` - Credentials state
- `src/store/historySlice.ts` - History state

## Type Definitions

### Backend Types
```typescript
// types/ranking.ts
export interface Ranking {
  id: number;
  playerId: number;
  rankingType: RankingType;
  category: RankingCategory;
  position: number;
  points: number;
  previousPosition: number;
  stateId?: number;
  ageGroup?: string;
  gender?: string;
  lastUpdated: string;
  player: PlayerProfile;
}

export interface RankingHistory {
  id: number;
  playerId: number;
  rankingType: RankingType;
  category: RankingCategory;
  oldPosition: number;
  newPosition: number;
  oldPoints: number;
  newPoints: number;
  changeReason: string;
  changeDate: string;
}

export interface Credential {
  id: string;
  userId: number;
  userType: UserRole;
  federationName: string;
  federationLogo: string;
  stateName: string;
  fullName: string;
  nrtpLevel: string;
  affiliationStatus: AffiliationStatus;
  rankingPosition: number;
  clubName?: string;
  licenseType?: string;
  qrCode: string;
  federationIdNumber: string;
  nationality: string;
  photo: string;
  issuedDate: string;
  expirationDate: string;
  status: CredentialStatus;
}

export interface PointCalculation {
  tournamentId: number;
  playerId: number;
  basePoints: number;
  placementMultiplier: number;
  levelMultiplier: number;
  opponentBonus: number;
  activityBonus: number;
  totalPoints: number;
  calculatedAt: string;
}
```

### Frontend Types
```typescript
// types/ranking.ts
export interface RankingState {
  rankings: Ranking[];
  playerRankings: PlayerRanking[];
  selectedCategory: RankingCategory;
  filters: RankingFilters;
  isLoading: boolean;
  error: string | null;
}

export interface CredentialState {
  userCredential: Credential | null;
  verificationResult: VerificationResult | null;
  isGenerating: boolean;
  isVerifying: boolean;
  error: string | null;
}

export interface RankingFilters {
  category: RankingCategory;
  state?: string;
  ageGroup?: string;
  gender?: string;
  limit: number;
  offset: number;
}
```

## Point Calculation System

### Tournament Point Values
```typescript
const TOURNAMENT_POINT_VALUES = {
  // Tournament Level Multipliers
  national: 1000,
  state: 500,
  municipal: 250,
  local: 100,
  
  // Placement Multipliers (percentage of base points)
  1: 1.00,    // Winner: 100%
  2: 0.70,    // Runner-up: 70%
  3: 0.50,    // Semifinalist: 50%
  4: 0.50,    // Semifinalist: 50%
  5: 0.30,    // Quarterfinalist: 30%
  6: 0.30,    // Quarterfinalist: 30%
  7: 0.30,    // Quarterfinalist: 30%
  8: 0.30,    // Quarterfinalist: 30%
  // Additional placements get decreasing percentages
};

const calculateTournamentPoints = (
  tournament: Tournament,
  placement: number,
  totalPlayers: number
): number => {
  // Base points from tournament level
  const basePoints = TOURNAMENT_POINT_VALUES[tournament.level] || 100;
  
  // Placement multiplier
  const placementMultiplier = TOURNAMENT_POINT_VALUES[placement] || 
    Math.max(0.1, 0.5 - (placement - 8) * 0.05);
  
  // Participation bonus based on field size
  const participationBonus = Math.min(1.2, 1 + (totalPlayers - 8) * 0.02);
  
  return Math.round(basePoints * placementMultiplier * participationBonus);
};
```

### Opponent Strength Bonus
```typescript
const calculateOpponentBonus = (
  playerRating: number,
  opponentRating: number,
  matchResult: 'win' | 'loss'
): number => {
  const ratingDifference = opponentRating - playerRating;
  
  if (matchResult === 'win') {
    // Bonus for beating higher-ranked players
    return Math.max(0, Math.min(50, ratingDifference * 0.1));
  } else {
    // Smaller penalty for losing to lower-ranked players
    return Math.min(0, Math.max(-25, ratingDifference * 0.05));
  }
};
```

## Digital Credential Design

### Player Credential Layout
```
┌─────────────────────────────────────────────────┐
│ FEDERACIÓN MEXICANA DE PICKLEBALL               │
│ [Federation Logo]              [Player Photo]   │
│                                                 │
│ Estado: Jalisco                                 │
│ Nombre: Juan Carlos Pérez                       │
│ Nivel NRTP: 4.5                                │
│ Estado de Afiliación: ACTIVO                    │
│ Posición Nacional: #147                         │
│ Club: Independiente                             │
│                                                 │
│ [QR Code]    ID: JUG-000147                    │
│              Nacionalidad: 🇲🇽 México           │
└─────────────────────────────────────────────────┘
```

### Coach Credential Layout
```
┌─────────────────────────────────────────────────┐
│ FEDERACIÓN MEXICANA DE PICKLEBALL               │
│ [Federation Logo]              [Coach Photo]    │
│                                                 │
│ Estado: Ciudad de México                        │
│ Entrenador: María González                      │
│ Nivel NRTP: 5.0                                │
│ Estado de Afiliación: ACTIVO                    │
│ Posición Nacional: #23                          │
│ Tipo de Licencia: Instructor Certificado       │
│                                                 │
│ [QR Code]    ID: ENT-000023                    │
│              Nacionalidad: 🇲🇽 México           │
└─────────────────────────────────────────────────┘
```

### QR Code Data Structure
```typescript
interface QRCodeData {
  credentialId: string;
  userId: number;
  userType: 'player' | 'coach';
  fullName: string;
  federationIdNumber: string;
  nrtpLevel: string;
  affiliationStatus: string;
  rankingPosition: number;
  stateId: number;
  issuedDate: string;
  expirationDate: string;
  verificationUrl: string;
  checksum: string; // For integrity verification
}

// QR code contains: https://pickleballfed.mx/verify?id=JUG-000147&checksum=abc123
```

## Credential Generation Process

### PDF Generation
```typescript
import PDFDocument from 'pdfkit';

const generateCredentialPDF = async (credential: Credential): Promise<Buffer> => {
  const doc = new PDFDocument({
    size: [350, 240], // Credit card size
    margins: { top: 15, bottom: 15, left: 15, right: 15 }
  });
  
  const buffers: Buffer[] = [];
  doc.on('data', buffers.push.bind(buffers));
  
  // Header with federation name and logo
  doc.fontSize(12)
     .font('Helvetica-Bold')
     .text('FEDERACIÓN MEXICANA DE PICKLEBALL', 15, 15);
  
  // Add federation logo
  if (credential.federationLogo) {
    doc.image(credential.federationLogo, 15, 35, { width: 40 });
  }
  
  // Add player photo
  if (credential.photo) {
    doc.image(credential.photo, 280, 35, { width: 50, height: 50 });
  }
  
  // Add credential information
  doc.fontSize(8)
     .font('Helvetica')
     .text(`Estado: ${credential.stateName}`, 15, 95)
     .text(`Nombre: ${credential.fullName}`, 15, 110)
     .text(`Nivel NRTP: ${credential.nrtpLevel}`, 15, 125)
     .text(`Estado de Afiliación: ${credential.affiliationStatus.toUpperCase()}`, 15, 140)
     .text(`Posición Nacional: #${credential.rankingPosition}`, 15, 155);
  
  if (credential.clubName) {
    doc.text(`Club: ${credential.clubName}`, 15, 170);
  }
  
  // Add QR code
  const qrCodeImage = await generateQRCodeImage(credential.qrCode);
  doc.image(qrCodeImage, 15, 185, { width: 40 });
  
  // Add ID and nationality
  doc.text(`ID: ${credential.federationIdNumber}`, 70, 190)
     .text(`Nacionalidad: ${credential.nationality}`, 70, 205);
  
  doc.end();
  
  return new Promise((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });
  });
};
```

### QR Code Verification System
```typescript
const verifyCredential = async (qrData: string): Promise<VerificationResult> => {
  try {
    // Parse QR code URL
    const url = new URL(qrData);
    const credentialId = url.searchParams.get('id');
    const checksum = url.searchParams.get('checksum');
    
    if (!credentialId || !checksum) {
      return { valid: false, error: 'Invalid QR code format' };
    }
    
    // Find credential in database
    const credential = await Credential.findOne({
      where: { federationIdNumber: credentialId }
    });
    
    if (!credential) {
      return { valid: false, error: 'Credential not found' };
    }
    
    // Verify checksum
    const expectedChecksum = generateChecksum(credential);
    if (checksum !== expectedChecksum) {
      return { valid: false, error: 'Invalid credential checksum' };
    }
    
    // Check expiration
    if (new Date(credential.expirationDate) < new Date()) {
      return { 
        valid: false, 
        error: 'Credential expired',
        credential: credential 
      };
    }
    
    // Check status
    if (credential.status !== 'active') {
      return { 
        valid: false, 
        error: 'Credential inactive',
        credential: credential 
      };
    }
    
    return {
      valid: true,
      credential: credential,
      verifiedAt: new Date().toISOString()
    };
    
  } catch (error) {
    return { valid: false, error: 'Verification failed' };
  }
};
```

## Ranking Update Automation

### Automated Ranking Updates After Tournaments
```typescript
export class RankingUpdateJob {
  async updateRankingsAfterTournament(tournamentId: number): Promise<void> {
    const tournament = await Tournament.findByPk(tournamentId, {
      include: [{ model: Match, include: [Player] }]
    });
    
    if (!tournament || tournament.status !== 'completed') {
      throw new Error('Tournament not completed');
    }
    
    // Calculate points for all participants
    const pointUpdates = await this.calculateAllTournamentPoints(tournament);
    
    // Update player rankings
    for (const update of pointUpdates) {
      await this.updatePlayerRanking(update.playerId, update.points, tournament);
    }
    
    // Recalculate rankings for affected categories
    await this.recalculateRankingPositions(tournament);
    
    // Send ranking change notifications
    await this.notifyRankingChanges(pointUpdates);
  }
  
  private async calculateAllTournamentPoints(tournament: Tournament): Promise<PointUpdate[]> {
    const updates: PointUpdate[] = [];
    
    // Get all matches and results
    const matches = await Match.findAll({
      where: { tournamentId: tournament.id },
      include: [Player]
    });
    
    // Calculate points for each player
    const playerResults = this.aggregatePlayerResults(matches);
    
    for (const [playerId, result] of playerResults.entries()) {
      const points = this.calculateTournamentPoints(tournament, result);
      updates.push({
        playerId: parseInt(playerId),
        points: points,
        placement: result.finalPlacement,
        matchesWon: result.matchesWon,
        matchesLost: result.matchesLost
      });
    }
    
    return updates;
  }
}
```

## Testing Requirements

### Backend Testing
```bash
# Test ranking calculations
curl -X GET http://localhost:5000/api/rankings/national \
  -H "Authorization: Bearer <token>"

# Test credential generation
curl -X GET http://localhost:5000/api/credentials/player/1 \
  -H "Authorization: Bearer <token>"

# Test credential verification
curl -X POST http://localhost:5000/api/credentials/verify \
  -H "Content-Type: application/json" \
  -d '{"qrData":"https://pickleballfed.mx/verify?id=JUG-000147&checksum=abc123"}'

# Test ranking update after tournament
curl -X PUT http://localhost:5000/api/rankings/update-after-tournament/1 \
  -H "Authorization: Bearer <token>"
```

### Frontend Testing
- Test ranking table display and filtering
- Verify credential display and download functionality
- Test QR code generation and scanning
- Verify ranking history visualization
- Test mobile credential interface
- Verify PDF download functionality

### Integration Testing
- Complete tournament to ranking update flow
- Credential generation and verification process
- QR code scanning accuracy
- Ranking calculation verification
- PDF generation quality and accuracy

## Success Criteria
✅ Multi-category ranking system functions correctly
✅ Point calculations are accurate and fair
✅ Digital credentials generate with all required information
✅ QR codes contain proper verification data
✅ Credential verification works via QR scanning
✅ PDF downloads are high quality and printable
✅ Ranking updates occur automatically after tournaments
✅ Ranking history tracks changes accurately
✅ Mobile interface displays credentials properly
✅ Search and filtering work for all ranking categories
✅ Credential status updates reflect membership changes
✅ Analytics provide meaningful insights

## Commands to Test
```bash
# Test ranking system
npm run test:rankings

# Test credential generation
npm run test:credentials

# Generate sample credentials
npm run generate-sample-credentials

# Test QR verification
npm run test:qr-verification

# Update rankings after tournament
npm run update-rankings:tournament:1

# Start with ranking data
docker-compose up -d
npm run seed:rankings
```

## Next Steps
After completing this step, you should have:
- Complete multi-category ranking system
- Digital credential generation with QR codes
- Automated ranking updates from tournament results
- Credential verification system
- Ranking history and analytics
- Mobile-optimized credential interface

The next step will focus on microsite management for clubs, partners, and state committees.