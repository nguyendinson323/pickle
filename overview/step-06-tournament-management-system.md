# Step 6: Tournament Management System

## Overview
This step implements a comprehensive tournament management system that allows federation admins, state committees, clubs, and partners to create and manage tournaments at various levels (National, State, Municipal, Local). The system handles tournament creation, player registration, bracket generation, match scheduling, score tracking, referee assignments, and result management.
Don't use any mockup data for frontend.
Do use only database data from backend.
Before rendering a page, all required data for the page should be prepared from backend through API endpoint to store on Redux.
For each page, you must accurately determine whether the functionalities of all dynamic elements, including buttons, are correctly integrated with the backend and accurately reflected in Redux to ensure real-time updates.
There are already data seeded to test in database .
You need to test with only this database seeded data from backend.
Don't use any mockup, simulation or random data for frontend.

## Objectives
- Create multi-level tournament system (National, State, Municipal, Local)
- Build tournament registration and category management
- Implement bracket generation and match scheduling
- Create score tracking and result management
- Add referee assignment and management
- Build payment processing for tournament fees
- Create prize pool and awards management
- Generate tournament reports and statistics

## Tournament Hierarchy and Permissions

### Federation Level (National)
- **Organizes**: National Tournaments, National Tour, National League, Mexican Open, National Championship
- **Permissions**: Can create any level tournament, manage all tournaments

### State Committee Level  
- **Organizes**: State Tournaments, Municipal Championships, State League, State Championship
- **Permissions**: Can create state and municipal level tournaments within their state

### Club/Partner Level
- **Organizes**: Local Tournaments, Club Championships, Partner Events
- **Permissions**: Can only create local tournaments

### Tournament Categories by Level
```
National Level:
├── National Championship (Annual)
├── National Tour (Series)
├── National League (Seasonal)
├── Mexican Open (International)
└── National Youth Championships

State Level:
├── State Championship (Annual)
├── State League (Seasonal)  
├── Municipal Championships
└── Regional Qualifiers

Local Level:
├── Club Tournaments
├── Partner Events
├── Training Competitions
└── Social Tournaments
```

## Backend Development Tasks

### 1. Tournament Management Controllers
**Files to Create:**
- `src/controllers/tournamentController.ts` - Tournament CRUD operations
- `src/controllers/categoryController.ts` - Tournament categories
- `src/controllers/registrationController.ts` - Player registration
- `src/services/tournamentService.ts` - Tournament business logic
- `src/services/bracketService.ts` - Bracket generation logic
- `src/services/matchService.ts` - Match management

**Tournament Methods:**
```typescript
// Tournament Management
createTournament(tournamentData: TournamentData): Promise<Tournament>
updateTournament(tournamentId: number, updates: Partial<TournamentData>): Promise<Tournament>
deleteTournament(tournamentId: number): Promise<void>
getTournament(tournamentId: number): Promise<Tournament>
getTournamentsByOrganizer(organizerId: number, organizerType: string): Promise<Tournament[]>
searchTournaments(filters: TournamentSearchFilters): Promise<Tournament[]>

// Tournament Categories
createCategory(tournamentId: number, categoryData: CategoryData): Promise<Category>
updateCategory(categoryId: number, updates: Partial<CategoryData>): Promise<Category>
deleteCategory(categoryId: number): Promise<void>
getCategoriesByTournament(tournamentId: number): Promise<Category[]>
```

### 2. Registration System
**Files to Create:**
- `src/services/registrationService.ts` - Registration business logic
- `src/services/eligibilityService.ts` - Player eligibility checking
- `src/utils/categoryMatching.ts` - Automatic category assignment

**Registration Methods:**
```typescript
// Player Registration
registerPlayer(tournamentId: number, categoryId: number, playerId: number): Promise<Registration>
registerPlayerPair(tournamentId: number, categoryId: number, player1Id: number, player2Id: number): Promise<Registration>
checkEligibility(playerId: number, categoryId: number): Promise<EligibilityResult>
cancelRegistration(registrationId: number): Promise<void>
processRegistrationPayment(registrationId: number): Promise<Payment>
```

### 3. Bracket and Match Management
**Files to Create:**
- `src/services/bracketService.ts` - Tournament bracket generation
- `src/services/matchService.ts` - Match scheduling and management
- `src/utils/bracketGenerator.ts` - Bracket algorithm implementation
- `src/services/scoringService.ts` - Score tracking

**Bracket Methods:**
```typescript
// Bracket Management
generateBracket(categoryId: number, players: Player[]): Promise<Bracket>
seedPlayers(players: Player[], seedingMethod: string): Player[]
createMatches(bracketId: number): Promise<Match[]>
advancePlayer(matchId: number, winnerId: number): Promise<void>
updateMatchScore(matchId: number, score: MatchScore): Promise<Match>
```

### 4. Referee Management
**Files to Create:**
- `src/services/refereeService.ts` - Referee assignment and management
- `src/controllers/refereeController.ts` - Referee endpoints

**Referee Methods:**
```typescript
// Referee Management
assignReferee(matchId: number, refereeId: number): Promise<void>
getAvailableReferees(date: string, stateId?: number): Promise<Coach[]>
updateRefereeHistory(refereeId: number, matchId: number): Promise<void>
getRefereeStats(refereeId: number): Promise<RefereeStats>
```

### 5. API Endpoints
```
Tournament Management:
POST /api/tournaments - Create tournament
GET /api/tournaments/:id - Get tournament details
PUT /api/tournaments/:id - Update tournament  
DELETE /api/tournaments/:id - Delete tournament
GET /api/tournaments/organizer/:id - Get tournaments by organizer
GET /api/tournaments/search - Search tournaments

Tournament Categories:
POST /api/tournaments/:id/categories - Create category
GET /api/tournaments/:id/categories - Get categories
PUT /api/categories/:id - Update category
DELETE /api/categories/:id - Delete category

Registration:
POST /api/tournaments/:id/register - Register for tournament
GET /api/tournaments/:id/registrations - Get registrations
DELETE /api/registrations/:id - Cancel registration
POST /api/registrations/:id/payment - Process payment

Bracket and Matches:
POST /api/tournaments/:id/generate-bracket - Generate bracket
GET /api/tournaments/:id/bracket - Get bracket
GET /api/matches/:id - Get match details
PUT /api/matches/:id/score - Update match score
POST /api/matches/:id/referee - Assign referee

Results and Stats:
GET /api/tournaments/:id/results - Tournament results
GET /api/tournaments/:id/stats - Tournament statistics
GET /api/players/:id/tournament-history - Player tournament history
```

## Frontend Development Tasks

### 1. Tournament Creation Components
**Files to Create:**
- `src/components/tournaments/TournamentForm.tsx` - Tournament creation form
- `src/components/tournaments/CategoryForm.tsx` - Tournament categories
- `src/components/tournaments/TournamentSettings.tsx` - Advanced settings
- `src/components/tournaments/VenueSelection.tsx` - Venue and court assignment
- `src/components/tournaments/PrizePoolSetup.tsx` - Prize configuration

### 2. Tournament Display Components
**Files to Create:**
- `src/components/tournaments/TournamentCard.tsx` - Tournament preview card
- `src/components/tournaments/TournamentDetails.tsx` - Detailed tournament view
- `src/components/tournaments/TournamentList.tsx` - List of tournaments
- `src/components/tournaments/TournamentSearch.tsx` - Search interface
- `src/components/tournaments/TournamentFilters.tsx` - Filter controls

### 3. Registration Components
**Files to Create:**
- `src/components/registration/RegistrationForm.tsx` - Player registration
- `src/components/registration/CategorySelection.tsx` - Category chooser
- `src/components/registration/PartnerSelection.tsx` - Partner selection for doubles
- `src/components/registration/RegistrationSummary.tsx` - Registration summary
- `src/components/registration/PaymentForm.tsx` - Registration fee payment

### 4. Bracket and Match Components
**Files to Create:**
- `src/components/brackets/BracketDisplay.tsx` - Visual bracket display
- `src/components/brackets/BracketNode.tsx` - Individual bracket match
- `src/components/brackets/MatchCard.tsx` - Match details card
- `src/components/brackets/ScoreEntry.tsx` - Score input form
- `src/components/brackets/MatchSchedule.tsx` - Match scheduling

### 5. Tournament Management Components
**Files to Create:**
- `src/components/management/TournamentDashboard.tsx` - Organizer dashboard
- `src/components/management/RegistrationManagement.tsx` - Manage registrations
- `src/components/management/BracketGeneration.tsx` - Generate brackets
- `src/components/management/MatchScheduling.tsx` - Schedule matches
- `src/components/management/ResultsManagement.tsx` - Results entry

### 6. Pages
**Files to Create:**
- `src/pages/tournaments/TournamentsPage.tsx` - Browse tournaments
- `src/pages/tournaments/TournamentDetailsPage.tsx` - Tournament details
- `src/pages/tournaments/CreateTournamentPage.tsx` - Create tournament
- `src/pages/tournaments/ManageTournamentPage.tsx` - Manage tournament
- `src/pages/tournaments/BracketPage.tsx` - Tournament bracket
- `src/pages/tournaments/RegisterPage.tsx` - Tournament registration

### 7. Redux State Management
**Files to Create:**
- `src/store/tournamentsSlice.ts` - Tournament state
- `src/store/registrationSlice.ts` - Registration state
- `src/store/bracketSlice.ts` - Bracket state
- `src/store/matchSlice.ts` - Match state

## Type Definitions

### Backend Types
```typescript
// types/tournament.ts
export interface Tournament {
  id: number;
  name: string;
  description: string;
  organizerType: 'federation' | 'state' | 'club' | 'partner';
  organizerId: number;
  tournamentType: TournamentType;
  level: TournamentLevel;
  stateId?: number;
  venueName: string;
  venueAddress: string;
  startDate: string;
  endDate: string;
  registrationStart: string;
  registrationEnd: string;
  entryFee: number;
  maxParticipants: number;
  currentParticipants: number;
  status: TournamentStatus;
  prizePool: number;
  rulesDocument?: string;
  images: string[];
  categories: Category[];
}

export interface Category {
  id: number;
  tournamentId: number;
  name: string;
  description: string;
  minAge?: number;
  maxAge?: number;
  skillLevel?: SkillLevel;
  genderRequirement: GenderRequirement;
  playFormat: PlayFormat;
  entryFee: number;
  maxParticipants: number;
  currentParticipants: number;
}

export interface Match {
  id: number;
  tournamentId: number;
  categoryId: number;
  round: string;
  matchNumber: number;
  courtId?: number;
  scheduledDate?: string;
  scheduledTime?: string;
  player1Id?: number;
  player2Id?: number;
  player1PartnerId?: number;
  player2PartnerId?: number;
  score?: MatchScore;
  winnerId?: number;
  status: MatchStatus;
  refereeId?: number;
  notes?: string;
}

export interface MatchScore {
  sets: SetScore[];
  retired: boolean;
  walkover: boolean;
}

export interface SetScore {
  player1Score: number;
  player2Score: number;
  tiebreak?: TiebreakScore;
}
```

### Frontend Types
```typescript
// types/tournament.ts
export interface TournamentState {
  tournaments: Tournament[];
  selectedTournament: Tournament | null;
  userRegistrations: Registration[];
  searchFilters: TournamentSearchFilters;
  isLoading: boolean;
  error: string | null;
}

export interface RegistrationState {
  selectedCategory: Category | null;
  selectedPartner: Player | null;
  registrationStep: RegistrationStep;
  paymentStatus: PaymentStatus;
  isProcessing: boolean;
  error: string | null;
}

export interface BracketState {
  bracket: BracketNode[];
  matches: Match[];
  selectedMatch: Match | null;
  isGenerating: boolean;
  error: string | null;
}
```

## Tournament Creation Form Specifications

### Basic Tournament Information
**Fields:**
- Tournament Name (text, required)
- Description (textarea, required)
- Tournament Type (select: Championship, League, Open, Friendly)
- Level (auto-set based on organizer permissions)
- Start Date (date picker, required)
- End Date (date picker, required)
- Registration Period (date range, required)

### Venue Information
**Fields:**
- Venue Name (text, required)
- Venue Address (text with autocomplete, required)
- Available Courts (multi-select from registered courts)
- Backup Venues (optional)

### Registration Settings
**Fields:**
- Maximum Participants (number)
- Entry Fee (currency input)
- Registration Requirements (checkboxes)
- Late Registration (allow/disallow)
- Waiting List (enable/disable)

### Tournament Categories
**Dynamic Form:**
- Category Name (text, e.g., "Men's Singles 18-35")
- Age Requirements (min/max age)
- Skill Level (Beginner, Intermediate, Advanced, Open)
- Gender (Men, Women, Mixed, Open)
- Play Format (Singles, Doubles, Mixed Doubles)
- Category Entry Fee (additional fee)
- Max Participants per Category

### Prize Pool and Awards
**Fields:**
- Total Prize Pool (currency)
- Prize Distribution (percentage per place)
- Trophy/Medal Options
- Sponsor Recognition
- Award Ceremony Details

## Tournament Registration Flow

### Registration Steps
1. **Tournament Selection**: Browse and select tournament
2. **Eligibility Check**: Verify player meets requirements
3. **Category Selection**: Choose appropriate categories
4. **Partner Selection**: For doubles events
5. **Payment Processing**: Pay registration fees
6. **Confirmation**: Registration confirmation and receipt

### Category Assignment Logic
```typescript
const findEligibleCategories = (player: Player, tournament: Tournament): Category[] => {
  return tournament.categories.filter(category => {
    // Age eligibility
    if (category.minAge && calculateAge(player.dateOfBirth) < category.minAge) return false;
    if (category.maxAge && calculateAge(player.dateOfBirth) > category.maxAge) return false;
    
    // Skill level eligibility
    if (category.skillLevel && !isSkillLevelEligible(player.nrtpLevel, category.skillLevel)) return false;
    
    // Gender eligibility
    if (category.genderRequirement !== 'open' && !isGenderEligible(player.gender, category.genderRequirement)) return false;
    
    // Capacity check
    if (category.currentParticipants >= category.maxParticipants) return false;
    
    return true;
  });
};
```

## Bracket Generation System

### Bracket Types Supported
1. **Single Elimination**: Traditional knockout format
2. **Double Elimination**: Winner and loser brackets
3. **Round Robin**: Everyone plays everyone
4. **Swiss System**: Pairing based on performance
5. **Pool Play + Elimination**: Group stage followed by knockout

### Seeding Methods
- **Ranking Based**: Use player rankings for seeding
- **Random**: Random seeding for recreational events
- **Manual**: Organizer manual seeding
- **Regional**: Separate players from same region

### Bracket Generation Algorithm
```typescript
const generateSingleEliminationBracket = (players: Player[]): BracketNode[] => {
  const seededPlayers = seedPlayers(players);
  const totalRounds = Math.ceil(Math.log2(players.length));
  const bracket: BracketNode[] = [];
  
  // Create first round matches
  for (let i = 0; i < seededPlayers.length; i += 2) {
    const match: BracketNode = {
      id: generateId(),
      round: 1,
      position: i / 2,
      player1: seededPlayers[i],
      player2: seededPlayers[i + 1] || null, // Bye if odd number
      nextMatch: null,
      status: 'pending'
    };
    bracket.push(match);
  }
  
  // Create subsequent rounds
  for (let round = 2; round <= totalRounds; round++) {
    // Create matches for this round
    // Link winners to next round
  }
  
  return bracket;
};
```

## Score Tracking System

### Score Entry Interface
```typescript
interface ScoreEntryProps {
  match: Match;
  onScoreUpdate: (score: MatchScore) => void;
  canEdit: boolean;
}

const ScoreEntry: React.FC<ScoreEntryProps> = ({ match, onScoreUpdate, canEdit }) => {
  // Score input interface with sets, games, tiebreaks
  // Real-time validation and updates
  // Support for different scoring systems
};
```

### Scoring Formats
- **Standard**: Best of 3 sets to 6 games
- **Pro Set**: First to 8 games, tiebreak at 7-7
- **Short Set**: First to 4 games, tiebreak at 3-3
- **Timed**: Matches with time limits
- **Custom**: Tournament-specific rules

## Tournament Analytics and Reporting

### Statistics Tracked
- **Participation**: Registration numbers, demographics
- **Performance**: Win/loss ratios, scores, upsets
- **Revenue**: Registration fees, prize pool, expenses
- **Engagement**: Court utilization, match duration
- **Regional**: State participation, travel patterns

### Report Generation
```typescript
interface TournamentReport {
  tournamentId: number;
  summary: TournamentSummary;
  participation: ParticipationStats;
  financial: FinancialSummary;
  performance: PerformanceStats;
  feedback: FeedbackSummary;
}

const generateTournamentReport = async (tournamentId: number): Promise<TournamentReport> => {
  // Compile comprehensive tournament report
  // Include charts, graphs, and detailed analytics
  // Export as PDF or web view
};
```

## Testing Requirements

### Backend Testing
```bash
# Test tournament creation
curl -X POST http://localhost:5000/api/tournaments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Tournament","organizerType":"club",...}'

# Test registration
curl -X POST http://localhost:5000/api/tournaments/1/register \
  -H "Authorization: Bearer <token>" \
  -d '{"categoryId":1,"partnerId":2}'

# Test bracket generation
curl -X POST http://localhost:5000/api/tournaments/1/generate-bracket \
  -H "Authorization: Bearer <token>"
```

### Frontend Testing
- Test tournament creation form
- Verify registration flow
- Test bracket display and navigation
- Verify score entry and updates
- Test payment processing
- Verify mobile responsiveness

### Integration Testing
- Complete tournament creation to results flow
- Registration payment processing
- Bracket generation accuracy
- Score tracking and advancement
- Email notifications to participants
- Prize distribution calculations

## Mobile Optimization

### Mobile Tournament Features
- **Tournament Discovery**: Easy browsing and search
- **Quick Registration**: Streamlined registration process
- **Live Brackets**: Real-time bracket updates
- **Score Updates**: Quick score entry for referees
- **Notifications**: Push notifications for matches
- **Results**: Instant access to results and standings

## Success Criteria
✅ Multi-level tournament creation works correctly
✅ Player registration handles all scenarios
✅ Bracket generation produces valid tournaments
✅ Score tracking updates brackets correctly
✅ Payment processing works for tournament fees
✅ Referee assignment system functions
✅ Mobile interface is fully functional
✅ Tournament analytics provide accurate data
✅ Email notifications are sent to participants
✅ Prize pool distribution works correctly
✅ Tournament search and filtering work
✅ Export and reporting features function

## Commands to Test
```bash
# Test tournament system
npm run test:tournaments

# Generate test tournament
npm run create-test-tournament

# Test bracket generation
npm run test:bracket-generation

# Run tournament flow test
npm run test:tournament-flow

# Start development with sample data
docker-compose up -d
npm run seed:tournaments
```

## Next Steps
After completing this step, you should have:
- Complete tournament management system
- Registration and payment processing
- Bracket generation and match scheduling
- Score tracking and results management
- Tournament analytics and reporting
- Mobile-optimized tournament interface

The next step will focus on the player finder system and enhanced messaging features for community engagement.