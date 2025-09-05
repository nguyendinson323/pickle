# 05. Tournament Management System - Complete Implementation Guide

## Problem Analysis
The current project lacks a comprehensive tournament management system that is essential for a Mexican Pickleball Federation platform. This system must handle tournament creation, registration, bracket generation, match scheduling, scoring, and certificate issuance.

## Core Requirements
1. **Tournament Creation & Management**: Federation/state committees can create and manage tournaments
2. **Player Registration**: Automated registration with eligibility verification
3. **Bracket Generation**: Automatic bracket creation based on categories and skill levels
4. **Match Scheduling**: Intelligent scheduling considering court availability
5. **Live Scoring**: Real-time match scoring and bracket updates
6. **Certificate Generation**: Digital certificates for winners and participants
7. **Payment Integration**: Entry fee collection through Stripe
8. **Notification System**: Automated updates to participants

## Step-by-Step Implementation Plan

### Phase 1: Database Schema Design

#### 1.1 Create Tournament Models (`backend/src/models/Tournament.ts`)
```typescript
interface Tournament extends Model {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  location: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  maxParticipants: number;
  entryFee: number;
  currency: 'USD' | 'MXN';
  status: 'draft' | 'open' | 'registration_closed' | 'in_progress' | 'completed' | 'cancelled';
  tournamentType: 'singles' | 'doubles' | 'mixed_doubles' | 'team';
  skillLevels: string[]; // ['beginner', 'intermediate', 'advanced', 'professional']
  ageCategories: string[]; // ['open', 'junior', 'senior', 'super_senior']
  prizes: TournamentPrize[];
  rules: string;
  requirements: string;
  contactEmail: string;
  contactPhone: string;
  organizedBy: string; // User ID of organizer
  organizationType: 'admin' | 'state' | 'club';
  isPublic: boolean;
  featuredImage: string;
  gallery: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Associations
Tournament.hasMany(TournamentCategory);
Tournament.hasMany(Registration);
Tournament.hasMany(Match);
Tournament.belongsTo(User, { as: 'organizer' });
```

#### 1.2 Create Tournament Category Model (`backend/src/models/TournamentCategory.ts`)
```typescript
interface TournamentCategory extends Model {
  id: string;
  tournamentId: string;
  name: string; // "Men's Singles - Advanced"
  type: 'singles' | 'doubles' | 'mixed_doubles';
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  ageCategory: 'open' | 'junior' | 'senior' | 'super_senior';
  gender: 'male' | 'female' | 'mixed';
  maxParticipants: number;
  currentParticipants: number;
  entryFee: number;
  bracketType: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
  bracketGenerated: boolean;
  status: 'open' | 'full' | 'closed' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

TournamentCategory.belongsTo(Tournament);
TournamentCategory.hasMany(Registration);
TournamentCategory.hasMany(Match);
```

#### 1.3 Create Registration Model (`backend/src/models/Registration.ts`)
```typescript
interface Registration extends Model {
  id: string;
  tournamentId: string;
  categoryId: string;
  playerId: string;
  partnerId?: string; // For doubles/mixed doubles
  registrationDate: Date;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'waitlisted';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentIntentId?: string; // Stripe payment intent
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalConditions?: string;
  dietaryRestrictions?: string;
  tshirtSize?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  waiverSigned: boolean;
  waiverSignedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

Registration.belongsTo(Tournament);
Registration.belongsTo(TournamentCategory);
Registration.belongsTo(User, { as: 'player' });
Registration.belongsTo(User, { as: 'partner' });
```

#### 1.4 Create Match Model (`backend/src/models/Match.ts`)
```typescript
interface Match extends Model {
  id: string;
  tournamentId: string;
  categoryId: string;
  round: number;
  roundName: string; // "Quarterfinals", "Semifinals", "Finals"
  matchNumber: number;
  player1Id: string;
  player2Id?: string; // Partner for doubles
  opponent1Id: string;
  opponent2Id?: string; // Partner for doubles
  scheduledDateTime?: Date;
  courtId?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  score: MatchScore;
  winner?: 'team1' | 'team2';
  winnerId?: string;
  duration?: number; // in minutes
  referee?: string; // User ID
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MatchScore {
  team1: {
    sets: number[];
    totalSets: number;
  };
  team2: {
    sets: number[];
    totalSets: number;
  };
  isComplete: boolean;
}

Match.belongsTo(Tournament);
Match.belongsTo(TournamentCategory);
Match.belongsTo(User, { as: 'player1' });
Match.belongsTo(User, { as: 'player2' });
Match.belongsTo(User, { as: 'opponent1' });
Match.belongsTo(User, { as: 'opponent2' });
Match.belongsTo(Court);
```

### Phase 2: Tournament Services Layer

#### 2.1 Tournament Service (`backend/src/services/tournamentService.ts`)
```typescript
class TournamentService {
  async createTournament(organizerId: string, tournamentData: CreateTournamentRequest) {
    // Validate organizer permissions
    const organizer = await User.findByPk(organizerId);
    if (!['admin', 'state', 'club'].includes(organizer.role)) {
      throw new Error('Insufficient permissions to create tournaments');
    }

    // Create tournament
    const tournament = await Tournament.create({
      ...tournamentData,
      organizedBy: organizerId,
      status: 'draft'
    });

    // Create tournament categories
    for (const category of tournamentData.categories) {
      await TournamentCategory.create({
        ...category,
        tournamentId: tournament.id,
        currentParticipants: 0,
        bracketGenerated: false,
        status: 'open'
      });
    }

    return tournament;
  }

  async registerForTournament(playerId: string, registrationData: TournamentRegistration) {
    const { tournamentId, categoryId, partnerId } = registrationData;
    
    // Validate tournament and category
    const tournament = await Tournament.findByPk(tournamentId);
    const category = await TournamentCategory.findByPk(categoryId);
    
    if (tournament.status !== 'open') {
      throw new Error('Tournament registration is closed');
    }
    
    if (new Date() > tournament.registrationDeadline) {
      throw new Error('Registration deadline has passed');
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      where: { tournamentId, playerId, status: ['pending', 'confirmed', 'paid'] }
    });
    
    if (existingRegistration) {
      throw new Error('Already registered for this tournament');
    }

    // Create registration
    const registration = await Registration.create({
      ...registrationData,
      playerId,
      registrationDate: new Date(),
      status: 'pending',
      paymentStatus: tournament.entryFee > 0 ? 'pending' : 'paid'
    });

    // Update participant count
    await category.increment('currentParticipants');

    // Create payment intent if entry fee exists
    if (tournament.entryFee > 0) {
      const paymentIntent = await this.createPaymentIntent(
        tournament.entryFee,
        tournament.currency,
        registration.id
      );
      
      await registration.update({
        paymentIntentId: paymentIntent.id
      });
    }

    return registration;
  }

  async generateBrackets(tournamentId: string, categoryId: string) {
    const category = await TournamentCategory.findByPk(categoryId, {
      include: [{
        model: Registration,
        where: { status: 'paid' },
        include: [
          { model: User, as: 'player' },
          { model: User, as: 'partner' }
        ]
      }]
    });

    if (category.bracketGenerated) {
      throw new Error('Bracket already generated for this category');
    }

    const participants = category.registrations;
    const bracketMatches = this.createBracketMatches(
      participants,
      category.bracketType
    );

    // Create match records
    for (const match of bracketMatches) {
      await Match.create({
        ...match,
        tournamentId,
        categoryId,
        status: 'scheduled'
      });
    }

    await category.update({
      bracketGenerated: true,
      status: 'closed'
    });

    return bracketMatches;
  }

  private createBracketMatches(participants: Registration[], bracketType: string) {
    switch (bracketType) {
      case 'single_elimination':
        return this.createSingleEliminationBracket(participants);
      case 'double_elimination':
        return this.createDoubleEliminationBracket(participants);
      case 'round_robin':
        return this.createRoundRobinBracket(participants);
      default:
        throw new Error('Unsupported bracket type');
    }
  }

  private createSingleEliminationBracket(participants: Registration[]) {
    const matches = [];
    let round = 1;
    let currentParticipants = [...participants];

    // Add byes if needed to make power of 2
    const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(participants.length)));
    const byes = nextPowerOf2 - participants.length;

    while (currentParticipants.length > 1) {
      const roundMatches = [];
      
      for (let i = 0; i < currentParticipants.length; i += 2) {
        const match = {
          round,
          roundName: this.getRoundName(round, nextPowerOf2),
          matchNumber: matches.length + 1,
          player1Id: currentParticipants[i].playerId,
          player2Id: currentParticipants[i].partnerId,
          opponent1Id: currentParticipants[i + 1]?.playerId,
          opponent2Id: currentParticipants[i + 1]?.partnerId,
          score: { team1: { sets: [], totalSets: 0 }, team2: { sets: [], totalSets: 0 }, isComplete: false }
        };
        
        matches.push(match);
        roundMatches.push(match);
      }

      // Prepare next round participants (placeholder logic)
      currentParticipants = roundMatches.map((_, index) => ({
        playerId: `winner_of_match_${matches.length - roundMatches.length + index + 1}`,
        partnerId: null
      }));

      round++;
    }

    return matches;
  }

  private getRoundName(round: number, totalParticipants: number): string {
    const totalRounds = Math.log2(totalParticipants);
    
    if (round === totalRounds) return 'Finals';
    if (round === totalRounds - 1) return 'Semifinals';
    if (round === totalRounds - 2) return 'Quarterfinals';
    if (round === 1) return 'First Round';
    
    return `Round ${round}`;
  }

  async updateMatchScore(matchId: string, scoreUpdate: MatchScoreUpdate, updatedBy: string) {
    const match = await Match.findByPk(matchId);
    
    if (!match) {
      throw new Error('Match not found');
    }

    if (match.status === 'completed') {
      throw new Error('Match already completed');
    }

    // Update score
    const updatedScore = this.calculateMatchScore(match.score, scoreUpdate);
    
    await match.update({
      score: updatedScore,
      status: updatedScore.isComplete ? 'completed' : 'in_progress',
      winner: updatedScore.isComplete ? this.determineWinner(updatedScore) : null,
      duration: updatedScore.isComplete ? this.calculateMatchDuration(match.scheduledDateTime) : null
    });

    // If match is complete, advance winner to next round
    if (updatedScore.isComplete) {
      await this.advanceWinner(match);
      await this.checkTournamentCompletion(match.tournamentId);
    }

    return match;
  }

  async generateCertificates(tournamentId: string) {
    const tournament = await Tournament.findByPk(tournamentId, {
      include: [TournamentCategory]
    });

    const certificates = [];

    for (const category of tournament.categories) {
      const winners = await this.getCategoryWinners(category.id);
      
      for (const winner of winners) {
        const certificate = await this.createDigitalCertificate({
          tournamentName: tournament.name,
          categoryName: category.name,
          playerName: winner.player.username,
          position: winner.position,
          date: tournament.endDate,
          location: `${tournament.city}, ${tournament.state}`
        });

        certificates.push(certificate);
      }
    }

    return certificates;
  }

  private async createDigitalCertificate(certificateData: CertificateData) {
    // Generate PDF certificate using a template
    const certificatePDF = await this.generateCertificatePDF(certificateData);
    
    // Upload to cloud storage
    const certificateUrl = await this.uploadCertificate(certificatePDF);
    
    // Create QR code for verification
    const qrCode = await this.generateQRCode(certificateUrl);
    
    return {
      url: certificateUrl,
      qrCode,
      ...certificateData
    };
  }
}
```

### Phase 3: Tournament Controllers

#### 3.1 Tournament Controller (`backend/src/controllers/tournamentController.ts`)
```typescript
export class TournamentController {
  async createTournament(req: Request, res: Response) {
    try {
      const tournament = await tournamentService.createTournament(
        req.user.id,
        req.body
      );

      res.status(201).json({
        success: true,
        data: tournament,
        message: 'Tournament created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getTournaments(req: Request, res: Response) {
    try {
      const { 
        status, 
        location, 
        skillLevel, 
        tournamentType, 
        startDate, 
        endDate,
        page = 1, 
        limit = 10 
      } = req.query;

      const whereClause: any = { isPublic: true };

      if (status) whereClause.status = status;
      if (location) whereClause.city = { [Op.iLike]: `%${location}%` };
      if (startDate || endDate) {
        whereClause.startDate = {};
        if (startDate) whereClause.startDate[Op.gte] = new Date(startDate as string);
        if (endDate) whereClause.startDate[Op.lte] = new Date(endDate as string);
      }

      const tournaments = await Tournament.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: TournamentCategory,
            where: skillLevel || tournamentType ? {
              ...(skillLevel && { skillLevel }),
              ...(tournamentType && { type: tournamentType })
            } : undefined,
            required: false
          },
          {
            model: User,
            as: 'organizer',
            attributes: ['id', 'username', 'email']
          }
        ],
        limit: Number(limit),
        offset: (Number(page) - 1) * Number(limit),
        order: [['startDate', 'ASC']]
      });

      res.json({
        success: true,
        data: tournaments.rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: tournaments.count,
          totalPages: Math.ceil(tournaments.count / Number(limit))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async registerForTournament(req: Request, res: Response) {
    try {
      const registration = await tournamentService.registerForTournament(
        req.user.id,
        { ...req.body, tournamentId: req.params.tournamentId }
      );

      res.status(201).json({
        success: true,
        data: registration,
        message: 'Registration successful'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async generateBrackets(req: Request, res: Response) {
    try {
      const { tournamentId, categoryId } = req.params;
      
      const brackets = await tournamentService.generateBrackets(
        tournamentId,
        categoryId
      );

      res.json({
        success: true,
        data: brackets,
        message: 'Brackets generated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateMatchScore(req: Request, res: Response) {
    try {
      const match = await tournamentService.updateMatchScore(
        req.params.matchId,
        req.body,
        req.user.id
      );

      res.json({
        success: true,
        data: match,
        message: 'Score updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getTournamentBracket(req: Request, res: Response) {
    try {
      const { tournamentId, categoryId } = req.params;
      
      const matches = await Match.findAll({
        where: { tournamentId, categoryId },
        include: [
          { model: User, as: 'player1', attributes: ['id', 'username'] },
          { model: User, as: 'player2', attributes: ['id', 'username'] },
          { model: User, as: 'opponent1', attributes: ['id', 'username'] },
          { model: User, as: 'opponent2', attributes: ['id', 'username'] }
        ],
        order: [['round', 'ASC'], ['matchNumber', 'ASC']]
      });

      res.json({
        success: true,
        data: matches
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}
```

### Phase 4: Frontend Tournament Components

#### 4.1 Tournament Creation Form (`frontend/src/components/tournaments/CreateTournamentForm.tsx`)
```typescript
interface CreateTournamentForm {
  // Basic Info
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  
  // Location
  location: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  
  // Tournament Settings
  maxParticipants: number;
  entryFee: number;
  tournamentType: 'singles' | 'doubles' | 'mixed_doubles' | 'team';
  
  // Categories
  categories: TournamentCategory[];
  
  // Additional Info
  rules: string;
  requirements: string;
  contactEmail: string;
  contactPhone: string;
  isPublic: boolean;
}

const CreateTournamentForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateTournamentForm>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    location: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    maxParticipants: 64,
    entryFee: 0,
    tournamentType: 'singles',
    categories: [],
    rules: '',
    requirements: '',
    contactEmail: '',
    contactPhone: '',
    isPublic: true
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleAddCategory = () => {
    const newCategory = {
      id: Date.now().toString(),
      name: '',
      type: formData.tournamentType,
      skillLevel: 'intermediate',
      ageCategory: 'open',
      gender: 'mixed',
      maxParticipants: 32,
      entryFee: formData.entryFee,
      bracketType: 'single_elimination'
    };

    setFormData(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <input
              type="text"
              placeholder="Tournament Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 border rounded-lg"
            />
            
            <textarea
              placeholder="Tournament Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 border rounded-lg h-32"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Registration Deadline</label>
              <input
                type="datetime-local"
                value={formData.registrationDeadline}
                onChange={(e) => setFormData(prev => ({ ...prev, registrationDeadline: e.target.value }))}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Location & Settings</h3>
            
            <input
              type="text"
              placeholder="Venue Name"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full p-3 border rounded-lg"
            />
            
            <input
              type="text"
              placeholder="Street Address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full p-3 border rounded-lg"
            />
            
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full p-3 border rounded-lg"
              />
              
              <select
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Select State</option>
                <option value="CDMX">Ciudad de México</option>
                <option value="JAL">Jalisco</option>
                <option value="NL">Nuevo León</option>
                {/* Add all Mexican states */}
              </select>
              
              <input
                type="text"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Max Participants</label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Entry Fee ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.entryFee}
                  onChange={(e) => setFormData(prev => ({ ...prev, entryFee: parseFloat(e.target.value) }))}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Tournament Categories</h3>
              <button
                type="button"
                onClick={handleAddCategory}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Category
              </button>
            </div>
            
            {formData.categories.map((category, index) => (
              <CategoryEditor
                key={category.id}
                category={category}
                onChange={(updatedCategory) => {
                  setFormData(prev => ({
                    ...prev,
                    categories: prev.categories.map((c, i) => 
                      i === index ? updatedCategory : c
                    )
                  }));
                }}
                onRemove={() => {
                  setFormData(prev => ({
                    ...prev,
                    categories: prev.categories.filter((_, i) => i !== index)
                  }));
                }}
              />
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            
            <textarea
              placeholder="Tournament Rules"
              value={formData.rules}
              onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
              className="w-full p-3 border rounded-lg h-32"
            />
            
            <textarea
              placeholder="Requirements & Equipment"
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              className="w-full p-3 border rounded-lg h-32"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Contact Email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="w-full p-3 border rounded-lg"
              />
              
              <input
                type="tel"
                placeholder="Contact Phone"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="rounded"
              />
              <span>Make tournament public</span>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await api.post('/tournaments', formData);
      // Success handling
    } catch (error) {
      console.error('Error creating tournament:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
      {/* Step indicator */}
      <div className="flex justify-between mb-8">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`w-1/4 h-2 rounded-full ${
              step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {renderStepContent()}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Create Tournament
          </button>
        )}
      </div>
    </form>
  );
};
```

#### 4.2 Tournament Bracket Display (`frontend/src/components/tournaments/TournamentBracket.tsx`)
```typescript
const TournamentBracket: React.FC<{ tournamentId: string; categoryId: string }> = ({
  tournamentId,
  categoryId
}) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  useEffect(() => {
    loadBracket();
  }, [tournamentId, categoryId]);

  const loadBracket = async () => {
    try {
      const response = await api.get(`/tournaments/${tournamentId}/categories/${categoryId}/bracket`);
      setMatches(response.data.data);
    } catch (error) {
      console.error('Error loading bracket:', error);
    }
  };

  const groupMatchesByRound = () => {
    const rounds: { [key: number]: Match[] } = {};
    matches.forEach(match => {
      if (!rounds[match.round]) {
        rounds[match.round] = [];
      }
      rounds[match.round].push(match);
    });
    return rounds;
  };

  const rounds = groupMatchesByRound();

  return (
    <div className="tournament-bracket bg-white rounded-lg shadow-lg p-6">
      <div className="flex overflow-x-auto space-x-8 min-h-96">
        {Object.entries(rounds).map(([roundNum, roundMatches]) => (
          <div key={roundNum} className="flex-shrink-0">
            <h3 className="text-center font-medium mb-4">
              {roundMatches[0]?.roundName || `Round ${roundNum}`}
            </h3>
            
            <div className="space-y-4">
              {roundMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onClick={() => setSelectedMatch(match)}
                  className="w-64 cursor-pointer hover:shadow-md transition-shadow"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Match Details Modal */}
      {selectedMatch && (
        <MatchDetailsModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onScoreUpdate={loadBracket}
        />
      )}
    </div>
  );
};

const MatchCard: React.FC<{ match: Match; onClick: () => void; className?: string }> = ({
  match,
  onClick,
  className
}) => {
  const getTeamName = (player1: User, player2?: User) => {
    if (player2) {
      return `${player1?.username || 'TBD'} / ${player2?.username || 'TBD'}`;
    }
    return player1?.username || 'TBD';
  };

  const getScoreDisplay = (score: MatchScore) => {
    if (!score.isComplete) {
      return score.team1.sets.length > 0 ? 
        `${score.team1.sets.join('-')} vs ${score.team2.sets.join('-')}` : 
        'Not Started';
    }
    
    return `${score.team1.totalSets}-${score.team2.totalSets}`;
  };

  return (
    <div
      className={`border rounded-lg p-4 ${className} ${
        match.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="text-xs text-gray-500 mb-2">Match #{match.matchNumber}</div>
      
      <div className="space-y-2">
        <div className={`flex justify-between items-center ${
          match.winner === 'team1' ? 'font-semibold text-green-600' : ''
        }`}>
          <span className="truncate">{getTeamName(match.player1, match.player2)}</span>
          <span className="ml-2">{match.score?.team1?.totalSets || 0}</span>
        </div>
        
        <div className={`flex justify-between items-center ${
          match.winner === 'team2' ? 'font-semibold text-green-600' : ''
        }`}>
          <span className="truncate">{getTeamName(match.opponent1, match.opponent2)}</span>
          <span className="ml-2">{match.score?.team2?.totalSets || 0}</span>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mt-2 text-center">
        {getScoreDisplay(match.score)}
      </div>
      
      {match.scheduledDateTime && (
        <div className="text-xs text-gray-500 mt-1 text-center">
          {new Date(match.scheduledDateTime).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          })}
        </div>
      )}
    </div>
  );
};
```

### Phase 5: Live Scoring System

#### 5.1 Live Score Update Component (`frontend/src/components/tournaments/LiveScoring.tsx`)
```typescript
const LiveScoring: React.FC<{ match: Match }> = ({ match }) => {
  const [currentSet, setCurrentSet] = useState(1);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [sets, setSets] = useState<{ team1: number[]; team2: number[] }>({
    team1: match.score?.team1?.sets || [],
    team2: match.score?.team2?.sets || []
  });

  const handleScoreUpdate = (team: 'team1' | 'team2', increment: boolean) => {
    if (team === 'team1') {
      setTeam1Score(prev => Math.max(0, prev + (increment ? 1 : -1)));
    } else {
      setTeam2Score(prev => Math.max(0, prev + (increment ? 1 : -1)));
    }
  };

  const completeSet = async () => {
    const minScore = 11;
    const winMargin = 2;
    
    // Validate set completion
    if (Math.max(team1Score, team2Score) < minScore) {
      alert(`Minimum score to win a set is ${minScore}`);
      return;
    }
    
    if (Math.abs(team1Score - team2Score) < winMargin) {
      alert(`Must win by at least ${winMargin} points`);
      return;
    }

    // Update sets
    const newSets = {
      team1: [...sets.team1, team1Score],
      team2: [...sets.team2, team2Score]
    };
    setSets(newSets);

    // Check if match is complete (best of 3 sets)
    const team1SetsWon = newSets.team1.filter((score, i) => score > newSets.team2[i]).length;
    const team2SetsWon = newSets.team2.filter((score, i) => score > newSets.team1[i]).length;
    
    const matchComplete = team1SetsWon >= 2 || team2SetsWon >= 2;

    // Send score update to backend
    const scoreUpdate = {
      team1: {
        sets: newSets.team1,
        totalSets: team1SetsWon
      },
      team2: {
        sets: newSets.team2,
        totalSets: team2SetsWon
      },
      isComplete: matchComplete
    };

    try {
      await api.put(`/matches/${match.id}/score`, { score: scoreUpdate });
      
      if (matchComplete) {
        alert(`Match completed! Winner: ${team1SetsWon > team2SetsWon ? 'Team 1' : 'Team 2'}`);
      } else {
        // Reset scores for next set
        setTeam1Score(0);
        setTeam2Score(0);
        setCurrentSet(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error updating score:', error);
      alert('Failed to update score. Please try again.');
    }
  };

  return (
    <div className="live-scoring bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Live Scoring</h2>
      
      {/* Match Info */}
      <div className="text-center mb-6">
        <div className="text-lg font-medium">{match.tournament?.name}</div>
        <div className="text-gray-600">{match.category?.name}</div>
        <div className="text-sm text-gray-500">Set {currentSet}</div>
      </div>

      {/* Current Set Score */}
      <div className="grid grid-cols-3 gap-4 items-center mb-6">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">
            {match.player1?.username || 'Player 1'}
            {match.player2 && ` / ${match.player2.username}`}
          </div>
          <div className="text-4xl font-bold text-blue-600">{team1Score}</div>
          <div className="flex justify-center space-x-2 mt-2">
            <button
              onClick={() => handleScoreUpdate('team1', false)}
              className="bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600"
            >
              -
            </button>
            <button
              onClick={() => handleScoreUpdate('team1', true)}
              className="bg-green-500 text-white w-8 h-8 rounded-full hover:bg-green-600"
            >
              +
            </button>
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-gray-400">VS</div>
        </div>

        <div className="text-center">
          <div className="text-lg font-medium mb-2">
            {match.opponent1?.username || 'Player 2'}
            {match.opponent2 && ` / ${match.opponent2.username}`}
          </div>
          <div className="text-4xl font-bold text-red-600">{team2Score}</div>
          <div className="flex justify-center space-x-2 mt-2">
            <button
              onClick={() => handleScoreUpdate('team2', false)}
              className="bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600"
            >
              -
            </button>
            <button
              onClick={() => handleScoreUpdate('team2', true)}
              className="bg-green-500 text-white w-8 h-8 rounded-full hover:bg-green-600"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Set History */}
      {sets.team1.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Set History</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-medium">Team 1</div>
              <div className="text-sm space-x-2">
                {sets.team1.map((score, index) => (
                  <span
                    key={index}
                    className={`inline-block px-2 py-1 rounded ${
                      score > sets.team2[index] ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {score}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="font-medium">Team 2</div>
              <div className="text-sm space-x-2">
                {sets.team2.map((score, index) => (
                  <span
                    key={index}
                    className={`inline-block px-2 py-1 rounded ${
                      score > sets.team1[index] ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {score}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Set Button */}
      <button
        onClick={completeSet}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
      >
        Complete Set
      </button>
    </div>
  );
};
```

### Phase 6: Tournament Registration & Payment

#### 6.1 Tournament Registration Component (`frontend/src/components/tournaments/TournamentRegistration.tsx`)
```typescript
const TournamentRegistration: React.FC<{ tournament: Tournament }> = ({ tournament }) => {
  const [selectedCategory, setSelectedCategory] = useState<TournamentCategory | null>(null);
  const [partnerSearch, setPartnerSearch] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<User | null>(null);
  const [registrationData, setRegistrationData] = useState({
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    medicalConditions: '',
    dietaryRestrictions: '',
    tshirtSize: 'M',
    waiverSigned: false
  });

  const handleRegistration = async () => {
    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }

    if (!registrationData.waiverSigned) {
      alert('Please sign the waiver to continue');
      return;
    }

    const registrationPayload = {
      categoryId: selectedCategory.id,
      partnerId: selectedPartner?.id,
      ...registrationData
    };

    try {
      const response = await api.post(`/tournaments/${tournament.id}/register`, registrationPayload);
      
      if (tournament.entryFee > 0) {
        // Redirect to payment
        window.location.href = response.data.paymentUrl;
      } else {
        alert('Registration successful!');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="tournament-registration bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Tournament Registration</h2>
      
      {/* Tournament Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-xl font-semibold">{tournament.name}</h3>
        <p className="text-gray-600 mb-2">{tournament.description}</p>
        <div className="text-sm text-gray-500">
          <div>📅 {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}</div>
          <div>📍 {tournament.location}, {tournament.city}, {tournament.state}</div>
          <div>💰 Entry Fee: ${tournament.entryFee}</div>
          <div>📝 Registration Deadline: {new Date(tournament.registrationDeadline).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Select Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tournament.categories?.map((category) => (
            <div
              key={category.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedCategory?.id === category.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              <div className="font-medium">{category.name}</div>
              <div className="text-sm text-gray-600">
                {category.type} • {category.skillLevel} • {category.ageCategory}
              </div>
              <div className="text-sm text-gray-500">
                {category.currentParticipants}/{category.maxParticipants} registered
              </div>
              {category.entryFee > 0 && (
                <div className="text-sm font-medium text-green-600">
                  ${category.entryFee}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Partner Selection for Doubles */}
      {selectedCategory && ['doubles', 'mixed_doubles'].includes(selectedCategory.type) && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Select Partner</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search for partner by username or email"
              value={partnerSearch}
              onChange={(e) => setPartnerSearch(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
            
            {selectedPartner && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{selectedPartner.username}</div>
                    <div className="text-sm text-gray-600">{selectedPartner.email}</div>
                  </div>
                  <button
                    onClick={() => setSelectedPartner(null)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Registration Form */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-medium">Additional Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Emergency Contact Name"
            value={registrationData.emergencyContact.name}
            onChange={(e) => setRegistrationData(prev => ({
              ...prev,
              emergencyContact: { ...prev.emergencyContact, name: e.target.value }
            }))}
            className="p-3 border rounded-lg"
          />
          
          <input
            type="tel"
            placeholder="Emergency Contact Phone"
            value={registrationData.emergencyContact.phone}
            onChange={(e) => setRegistrationData(prev => ({
              ...prev,
              emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
            }))}
            className="p-3 border rounded-lg"
          />
          
          <input
            type="text"
            placeholder="Relationship"
            value={registrationData.emergencyContact.relationship}
            onChange={(e) => setRegistrationData(prev => ({
              ...prev,
              emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
            }))}
            className="p-3 border rounded-lg"
          />
        </div>
        
        <textarea
          placeholder="Medical Conditions (Optional)"
          value={registrationData.medicalConditions}
          onChange={(e) => setRegistrationData(prev => ({ ...prev, medicalConditions: e.target.value }))}
          className="w-full p-3 border rounded-lg h-24"
        />
        
        <textarea
          placeholder="Dietary Restrictions (Optional)"
          value={registrationData.dietaryRestrictions}
          onChange={(e) => setRegistrationData(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
          className="w-full p-3 border rounded-lg h-24"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <select
            value={registrationData.tshirtSize}
            onChange={(e) => setRegistrationData(prev => ({ ...prev, tshirtSize: e.target.value }))}
            className="p-3 border rounded-lg"
          >
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>
      </div>

      {/* Waiver */}
      <div className="mb-6">
        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={registrationData.waiverSigned}
            onChange={(e) => setRegistrationData(prev => ({ ...prev, waiverSigned: e.target.checked }))}
            className="mt-1 rounded"
          />
          <span className="text-sm">
            I acknowledge that I have read and agree to the tournament waiver and liability release. 
            I understand the risks involved in participating in this pickleball tournament.
          </span>
        </label>
      </div>

      {/* Registration Button */}
      <button
        onClick={handleRegistration}
        disabled={!selectedCategory || !registrationData.waiverSigned}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {tournament.entryFee > 0 ? `Register & Pay $${tournament.entryFee}` : 'Register for Tournament'}
      </button>
    </div>
  );
};
```

### Phase 7: Testing & Quality Assurance

#### 7.1 Tournament System Tests
```typescript
// backend/tests/tournament.test.ts
describe('Tournament Management System', () => {
  describe('Tournament Creation', () => {
    it('should create tournament with categories', async () => {
      const tournamentData = {
        name: 'Test Tournament',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-03'),
        categories: [
          {
            name: "Men's Singles - Advanced",
            type: 'singles',
            skillLevel: 'advanced',
            maxParticipants: 32
          }
        ]
      };

      const response = await request(app)
        .post('/api/tournaments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(tournamentData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Tournament');
    });
  });

  describe('Tournament Registration', () => {
    it('should register player for tournament', async () => {
      const registrationData = {
        categoryId: 'category-id',
        emergencyContact: {
          name: 'John Doe',
          phone: '555-0123',
          relationship: 'Spouse'
        },
        waiverSigned: true
      };

      const response = await request(app)
        .post(`/api/tournaments/${tournamentId}/register`)
        .set('Authorization', `Bearer ${playerToken}`)
        .send(registrationData)
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should prevent duplicate registration', async () => {
      // First registration
      await request(app)
        .post(`/api/tournaments/${tournamentId}/register`)
        .set('Authorization', `Bearer ${playerToken}`)
        .send(registrationData);

      // Second registration should fail
      await request(app)
        .post(`/api/tournaments/${tournamentId}/register`)
        .set('Authorization', `Bearer ${playerToken}`)
        .send(registrationData)
        .expect(400);
    });
  });

  describe('Bracket Generation', () => {
    it('should generate single elimination bracket', async () => {
      // Register enough players
      for (let i = 0; i < 8; i++) {
        await createPlayerAndRegister(tournamentId, categoryId);
      }

      const response = await request(app)
        .post(`/api/tournaments/${tournamentId}/categories/${categoryId}/generate-bracket`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(7); // 8 players = 7 matches total
    });
  });

  describe('Live Scoring', () => {
    it('should update match score', async () => {
      const scoreUpdate = {
        score: {
          team1: { sets: [11], totalSets: 1 },
          team2: { sets: [9], totalSets: 0 },
          isComplete: false
        }
      };

      const response = await request(app)
        .put(`/api/matches/${matchId}/score`)
        .set('Authorization', `Bearer ${refereeToken}`)
        .send(scoreUpdate)
        .expect(200);

      expect(response.body.data.score.team1.totalSets).toBe(1);
    });
  });
});
```

## Implementation Priority
1. **CRITICAL**: Database schema and models (Phase 1)
2. **CRITICAL**: Tournament service layer (Phase 2)
3. **HIGH**: Tournament controllers and API endpoints (Phase 3)
4. **HIGH**: Tournament creation and management UI (Phase 4.1)
5. **HIGH**: Tournament registration system (Phase 6.1)
6. **MEDIUM**: Bracket generation and display (Phase 4.2)
7. **MEDIUM**: Live scoring system (Phase 5.1)
8. **LOW**: Comprehensive testing (Phase 7)

## Expected Results
After implementation:
- Complete tournament lifecycle management from creation to completion
- Automated bracket generation with multiple tournament formats
- Real-time scoring and bracket updates
- Payment integration for entry fees
- Digital certificate generation for winners
- Comprehensive notification system for participants
- Mobile-responsive tournament management interface

## Files to Create/Modify
- `backend/src/models/Tournament.ts`
- `backend/src/models/TournamentCategory.ts`
- `backend/src/models/Registration.ts`
- `backend/src/models/Match.ts`
- `backend/src/services/tournamentService.ts`
- `backend/src/controllers/tournamentController.ts`
- `backend/src/routes/tournamentRoutes.ts`
- `frontend/src/components/tournaments/CreateTournamentForm.tsx`
- `frontend/src/components/tournaments/TournamentBracket.tsx`
- `frontend/src/components/tournaments/LiveScoring.tsx`
- `frontend/src/components/tournaments/TournamentRegistration.tsx`
- `frontend/src/pages/TournamentManagementPage.tsx`
- `frontend/src/store/tournamentSlice.ts`