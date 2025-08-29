export type TournamentType = 'Championship' | 'League' | 'Open' | 'Friendly' | 'Tour' | 'Youth';
export type TournamentLevel = 'National' | 'State' | 'Municipal' | 'Local';
export type TournamentStatus = 'draft' | 'published' | 'registration_open' | 'registration_closed' | 'in_progress' | 'completed' | 'cancelled';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'open';
export type GenderRequirement = 'men' | 'women' | 'mixed' | 'open';
export type PlayFormat = 'singles' | 'doubles' | 'mixed_doubles';
export type RegistrationStatus = 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'waitlisted' | 'rejected';
export type MatchStatus = 'scheduled' | 'in_progress' | 'completed' | 'walkover' | 'retired' | 'cancelled' | 'postponed';
export type MatchRound = 'qualification' | 'round_32' | 'round_16' | 'quarterfinal' | 'semifinal' | 'final' | 'bronze_match';
export type BracketType = 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss' | 'pool_play';

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
  images?: string[];
  lateRegistrationAllowed: boolean;
  waitingListEnabled: boolean;
  registrationRequirements?: string[];
  prizeDistribution?: {
    first: number;
    second: number;
    third: number;
    fourth: number;
  };
  sponsorInfo?: any;
  createdAt: string;
  updatedAt: string;
  categories?: TournamentCategory[];
  registrations?: TournamentRegistration[];
  organizer?: {
    id: number;
    username: string;
  };
  state?: {
    id: number;
    name: string;
  };
}

export interface TournamentCategory {
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
  isActive: boolean;
  registrationDeadline?: string;
  createdAt: string;
  updatedAt: string;
  registrationCount?: number;
  availableSpots?: number;
}

export interface TournamentRegistration {
  id: number;
  tournamentId: number;
  categoryId: number;
  playerId: number;
  partnerId?: number;
  status: RegistrationStatus;
  registrationDate: string;
  paymentId?: number;
  amountPaid: number;
  seedNumber?: number;
  notes?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship?: string;
  };
  medicalInformation?: string;
  tshirtSize?: string;
  dietaryRestrictions?: string;
  transportationNeeds?: string;
  accommodationNeeds?: string;
  waiverSigned: boolean;
  waiverSignedDate?: string;
  checkInTime?: string;
  isCheckedIn: boolean;
  withdrawalReason?: string;
  withdrawalDate?: string;
  refundAmount?: number;
  refundProcessedDate?: string;
  createdAt: string;
  updatedAt: string;
  player?: {
    id: number;
    username: string;
    email: string;
  };
  partner?: {
    id: number;
    username: string;
    email: string;
  };
  category?: TournamentCategory;
  tournament?: Tournament;
}

export interface SetScore {
  player1Score: number;
  player2Score: number;
  tiebreak?: {
    player1Score: number;
    player2Score: number;
  };
}

export interface MatchScore {
  sets: SetScore[];
  retired: boolean;
  walkover: boolean;
  winner?: 1 | 2 | null;
}

export interface TournamentMatch {
  id: number;
  tournamentId: number;
  categoryId: number;
  bracketId?: number;
  round: MatchRound;
  matchNumber: number;
  courtId?: number;
  scheduledDate?: string;
  scheduledTime?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  player1Id?: number;
  player2Id?: number;
  player1PartnerId?: number;
  player2PartnerId?: number;
  score?: MatchScore;
  winnerId?: number;
  loserId?: number;
  status: MatchStatus;
  refereeId?: number;
  notes?: string;
  videoUrl?: string;
  liveStreamUrl?: string;
  isThirdPlaceMatch: boolean;
  createdAt: string;
  updatedAt: string;
  player1?: {
    id: number;
    username: string;
  };
  player2?: {
    id: number;
    username: string;
  };
  player1Partner?: {
    id: number;
    username: string;
  };
  player2Partner?: {
    id: number;
    username: string;
  };
  referee?: {
    id: number;
    username: string;
  };
  court?: {
    id: number;
    name: string;
  };
  category?: TournamentCategory;
  tournament?: Tournament;
}

export interface BracketNode {
  id: string;
  round: number;
  position: number;
  matchId?: number;
  player1: any;
  player2: any;
  winner: any;
  nextMatch?: string;
  prevMatch1?: string;
  prevMatch2?: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface TournamentBracket {
  id: number;
  tournamentId: number;
  categoryId: number;
  name: string;
  bracketType: BracketType;
  seedingMethod: string;
  totalRounds: number;
  currentRound: number;
  isComplete: boolean;
  winnerPlayerId?: number;
  runnerUpPlayerId?: number;
  thirdPlacePlayerId?: number;
  fourthPlacePlayerId?: number;
  bracketData: {
    type: string;
    totalRounds: number;
    brackets: BracketNode[];
    players: any[];
  };
  seedingData?: any[];
  settings: any;
  generatedDate: string;
  finalizedDate?: string;
  createdAt: string;
  updatedAt: string;
  category?: TournamentCategory;
  matches?: TournamentMatch[];
  winner?: {
    id: number;
    username: string;
  };
  runnerUp?: {
    id: number;
    username: string;
  };
}

// Search and filter interfaces
export interface TournamentSearchFilters {
  search?: string;
  level?: TournamentLevel;
  status?: TournamentStatus;
  stateId?: number;
  startDate?: string;
  endDate?: string;
  tournamentType?: TournamentType;
  page?: number;
  limit?: number;
}

export interface TournamentSearchResponse {
  tournaments: Tournament[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// Redux state interfaces
export interface TournamentState {
  tournaments: Tournament[];
  selectedTournament: Tournament | null;
  userRegistrations: TournamentRegistration[];
  searchFilters: TournamentSearchFilters;
  isLoading: boolean;
  error: string | null;
}

export interface RegistrationState {
  selectedCategory: TournamentCategory | null;
  selectedPartner: any | null;
  registrationStep: 'category' | 'partner' | 'details' | 'payment' | 'confirmation';
  paymentStatus: 'idle' | 'processing' | 'succeeded' | 'failed';
  isProcessing: boolean;
  error: string | null;
}

export interface BracketState {
  brackets: TournamentBracket[];
  selectedBracket: TournamentBracket | null;
  matches: TournamentMatch[];
  selectedMatch: TournamentMatch | null;
  isGenerating: boolean;
  error: string | null;
}

// Form interfaces
export interface TournamentFormData {
  name: string;
  description: string;
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
  prizePool: number;
  rulesDocument?: string;
  images?: File[];
  lateRegistrationAllowed: boolean;
  waitingListEnabled: boolean;
  registrationRequirements?: string[];
  contactEmail: string;
  contactPhone?: string;
  specialInstructions?: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  minAge?: number;
  maxAge?: number;
  skillLevel?: SkillLevel;
  genderRequirement: GenderRequirement;
  playFormat: PlayFormat;
  entryFee: number;
  maxParticipants: number;
  registrationDeadline?: string;
  specialRules?: string;
}

export interface RegistrationFormData {
  categoryId: number;
  partnerId?: number;
  emergencyContact: {
    name: string;
    phone: string;
    relationship?: string;
  };
  medicalInformation?: string;
  tshirtSize?: string;
  dietaryRestrictions?: string;
  transportationNeeds?: string;
  accommodationNeeds?: string;
}

// API response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}