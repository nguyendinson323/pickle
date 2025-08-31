# Step 7: Player Finder and Enhanced Messaging System

## Overview
This step implements the premium player finder feature with location-based matching, real-time notifications via SMS and email, privacy controls, and an enhanced messaging system. The player finder helps connect players in the same area or when traveling, addressing the need for more players in Mexico. It includes Google Maps integration, distance calculations, and sophisticated matching algorithms.
Don't use any mockup data for frontend.
Do use only database data from backend.
Before rendering a page, all required data for the page should be prepared from backend through API endpoint to store on Redux.
For each page, you must accurately determine whether the functionalities of all dynamic elements, including buttons, are correctly integrated with the backend and accurately reflected in Redux to ensure real-time updates.
There are already data seeded to test in database .
You need to test with only this database seeded data from backend.
Don't use any mockup, simulation or random data for frontend.

## Objectives
- Build location-based player finder with GPS/address search
- Implement matching algorithms based on skill level, availability, location
- Add privacy controls ("Can Be Found" / "Not Visible" toggle)
- Create real-time notifications (SMS + Email) for matches
- Build enhanced messaging system for player communication
- Add travel mode for finding players in visited locations
- Implement Google Maps integration (with cost considerations)
- Create alternative cost-free location solutions

## Player Finder System Architecture

### Core Features
1. **Location Services**: GPS-based and address-based location finding
2. **Matching Algorithm**: Smart player matching based on multiple criteria
3. **Privacy Controls**: User-controlled visibility settings
4. **Notification System**: SMS and email notifications for matches
5. **Travel Mode**: Find players when traveling to new locations
6. **Communication**: Direct messaging between matched players

### Premium Feature Access
- **Players**: Premium membership required ($1,200 MXN annually)
- **Coaches**: Premium membership required ($1,500 MXN annually)
- **Free Users**: Can be found by premium users but cannot search

## Backend Development Tasks

### 1. Location Services
**Files to Create:**
- `src/services/locationService.ts` - Location handling and geocoding
- `src/services/distanceService.ts` - Distance calculations
- `src/controllers/locationController.ts` - Location endpoints
- `src/utils/geocoding.ts` - Address to coordinates conversion

**Location Methods:**
```typescript
// Location Management
updateUserLocation(userId: number, location: LocationData): Promise<void>
getUserLocation(userId: number): Promise<LocationData>
geocodeAddress(address: string): Promise<Coordinates>
reverseGeocode(lat: number, lng: number): Promise<AddressData>

// Distance Calculations  
calculateDistance(point1: Coordinates, point2: Coordinates): number
findNearbyUsers(centerPoint: Coordinates, radius: number, userType: string): Promise<NearbyUser[]>
```

### 2. Player Finder System
**Files to Create:**
- `src/services/playerFinderService.ts` - Core finder logic
- `src/services/matchingService.ts` - Matching algorithms
- `src/controllers/playerFinderController.ts` - Finder endpoints
- `src/utils/matchingAlgorithms.ts` - Matching calculations

**Player Finder Methods:**
```typescript
// Player Search
searchNearbyPlayers(searchParams: PlayerSearchParams): Promise<PlayerMatch[]>
createFinderRequest(requestData: FinderRequestData): Promise<FinderRequest>
getMatches(userId: number): Promise<PlayerMatch[]>
updateMatchStatus(matchId: number, status: MatchStatus): Promise<void>

// Matching Logic
calculateCompatibilityScore(requester: Player, candidate: Player): number
filterByAvailability(players: Player[], timePreferences: TimeSlot[]): Player[]
rankByDistance(players: Player[], centerPoint: Coordinates): Player[]
```

### 3. Privacy and Settings
**Files to Create:**
- `src/services/privacyService.ts` - Privacy settings management
- `src/controllers/privacyController.ts` - Privacy endpoints

**Privacy Methods:**
```typescript
// Privacy Controls
updateVisibilitySettings(userId: number, settings: VisibilitySettings): Promise<void>
getPrivacySettings(userId: number): Promise<PrivacySettings>
checkUserVisibility(userId: number, requesterId: number): Promise<boolean>
hideUserFromSearch(userId: number, reason: string): Promise<void>
```

### 4. Enhanced Messaging System
**Files to Create:**
- `src/services/messagingService.ts` - Enhanced messaging
- `src/services/conversationService.ts` - Conversation management
- `src/controllers/conversationController.ts` - Conversation endpoints

**Messaging Methods:**
```typescript
// Direct Messaging
startConversation(user1Id: number, user2Id: number): Promise<Conversation>
sendMessage(conversationId: number, senderId: number, content: string): Promise<Message>
getConversations(userId: number): Promise<Conversation[]>
markAsRead(conversationId: number, userId: number): Promise<void>
```

### 5. Notification System
**Files to Create:**
- `src/services/notificationService.ts` - Multi-channel notifications
- `src/services/smsService.ts` - SMS integration (Twilio)
- `src/services/emailService.ts` - Email notifications (SendGrid)

**Notification Methods:**
```typescript
// Notification Management
sendMatchNotification(matchData: PlayerMatch): Promise<void>
sendSMS(phoneNumber: string, message: string): Promise<void>
sendEmail(email: string, subject: string, content: string): Promise<void>
createNotificationPreferences(userId: number, preferences: NotificationPrefs): Promise<void>
```

### 6. API Endpoints
```
Player Finder Endpoints:
POST /api/player-finder/search - Search nearby players
POST /api/player-finder/request - Create finder request  
GET /api/player-finder/matches - Get matches for user
PUT /api/player-finder/match/:id/status - Update match status
DELETE /api/player-finder/request/:id - Delete finder request

Location Endpoints:
POST /api/location/update - Update user location
GET /api/location/me - Get user location
POST /api/location/geocode - Convert address to coordinates
POST /api/location/reverse-geocode - Convert coordinates to address

Privacy Endpoints:
PUT /api/privacy/visibility - Update visibility settings
GET /api/privacy/settings - Get privacy settings
POST /api/privacy/block - Block another user

Messaging Endpoints:
POST /api/conversations - Start new conversation
GET /api/conversations - Get user conversations
GET /api/conversations/:id/messages - Get conversation messages
POST /api/conversations/:id/messages - Send message
PUT /api/conversations/:id/read - Mark as read

Notification Endpoints:
PUT /api/notifications/preferences - Update notification preferences
GET /api/notifications/preferences - Get notification preferences
POST /api/notifications/test - Send test notification
```

## Frontend Development Tasks

### 1. Player Finder Components
**Files to Create:**
- `src/components/playerFinder/FinderInterface.tsx` - Main finder interface
- `src/components/playerFinder/LocationPicker.tsx` - Location selection
- `src/components/playerFinder/PlayerCard.tsx` - Player match display
- `src/components/playerFinder/MatchesList.tsx` - List of matches
- `src/components/playerFinder/FilterPanel.tsx` - Search filters

### 2. Location Components
**Files to Create:**
- `src/components/location/LocationPicker.tsx` - Interactive location picker
- `src/components/location/MapView.tsx` - Map integration
- `src/components/location/AddressSearch.tsx` - Address search with autocomplete
- `src/components/location/CurrentLocationButton.tsx` - Get current location
- `src/components/location/LocationHistory.tsx` - Recent locations

### 3. Privacy Components
**Files to Create:**
- `src/components/privacy/VisibilityToggle.tsx` - Can be found toggle
- `src/components/privacy/PrivacySettings.tsx` - Privacy configuration
- `src/components/privacy/BlockedUsers.tsx` - Blocked users management
- `src/components/privacy/VisibilityExplanation.tsx` - Privacy explanation

### 4. Messaging Components
**Files to Create:**
- `src/components/messaging/ConversationList.tsx` - List of conversations
- `src/components/messaging/ChatInterface.tsx` - Chat UI
- `src/components/messaging/MessageBubble.tsx` - Individual message
- `src/components/messaging/MessageInput.tsx` - Message compose
- `src/components/messaging/ContactRequest.tsx` - Initial contact request

### 5. Map Integration Components
**Files to Create:**
- `src/components/maps/PlayerMap.tsx` - Map showing nearby players
- `src/components/maps/LocationMarker.tsx` - Custom map markers
- `src/components/maps/RadiusCircle.tsx` - Search radius visualization
- `src/components/maps/MapControls.tsx` - Map interaction controls

### 6. Pages
**Files to Create:**
- `src/pages/playerFinder/PlayerFinderPage.tsx` - Main finder page
- `src/pages/playerFinder/FinderSettingsPage.tsx` - Finder settings
- `src/pages/messaging/ConversationsPage.tsx` - Messaging interface
- `src/pages/messaging/ChatPage.tsx` - Individual conversation
- `src/pages/privacy/PrivacyPage.tsx` - Privacy settings

### 7. Redux State Management
**Files to Create:**
- `src/store/playerFinderSlice.ts` - Player finder state
- `src/store/locationSlice.ts` - Location state
- `src/store/conversationSlice.ts` - Messaging state
- `src/store/privacySlice.ts` - Privacy settings state

## Type Definitions

### Backend Types
```typescript
// types/playerFinder.ts
export interface FinderRequest {
  id: number;
  requesterId: number;
  locationAddress: string;
  latitude: number;
  longitude: number;
  searchRadius: number;
  skillLevel?: string;
  preferredTimes: TimePreference[];
  message: string;
  isActive: boolean;
  expiresAt: string;
}

export interface PlayerMatch {
  id: number;
  requestId: number;
  matchedPlayerId: number;
  distance: number;
  compatibilityScore: number;
  status: MatchStatus;
  notificationSent: boolean;
  createdAt: string;
  player: PlayerProfile;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  lastUpdated: string;
}

export interface VisibilitySettings {
  canBeFound: boolean;
  showExactLocation: boolean;
  showSkillLevel: boolean;
  showContactInfo: boolean;
  allowDirectMessages: boolean;
}

export interface Conversation {
  id: number;
  participants: number[];
  lastMessage: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  messageType: MessageType;
  readBy: number[];
  sentAt: string;
}
```

### Frontend Types
```typescript
// types/playerFinder.ts
export interface PlayerFinderState {
  searchParams: PlayerSearchParams;
  matches: PlayerMatch[];
  activeRequest: FinderRequest | null;
  isSearching: boolean;
  userLocation: LocationData | null;
  error: string | null;
}

export interface LocationState {
  currentLocation: Coordinates | null;
  selectedLocation: LocationData | null;
  searchHistory: LocationData[];
  isGettingLocation: boolean;
  error: string | null;
}

export interface ConversationState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
```

## Location Services Implementation

### Google Maps Integration (Premium Option)
```typescript
// Cost-effective Google Maps usage
const geocodeAddress = async (address: string): Promise<Coordinates> => {
  try {
    // Use Google Geocoding API with caching to minimize costs
    const cachedResult = await getCachedGeocode(address);
    if (cachedResult) return cachedResult;
    
    const response = await googleMapsClient.geocode({
      params: { address, key: GOOGLE_MAPS_API_KEY }
    });
    
    const result = response.data.results[0];
    const coordinates = {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng
    };
    
    // Cache result to avoid repeated API calls
    await cacheGeocode(address, coordinates);
    return coordinates;
  } catch (error) {
    throw new Error('Geocoding failed');
  }
};
```

### Cost-Free Alternative Solutions
```typescript
// Alternative location services without API costs
export class FreeLocationService {
  // Use browser geolocation API
  getCurrentPosition(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }),
        error => reject(error),
        { enableHighAccuracy: true }
      );
    });
  }
  
  // Use free geocoding service (OpenStreetMap Nominatim)
  async geocodeWithNominatim(address: string): Promise<Coordinates> {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    const data = await response.json();
    
    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    }
    throw new Error('Address not found');
  }
  
  // Calculate distance using Haversine formula (no API cost)
  calculateDistance(point1: Coordinates, point2: Coordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2.latitude - point1.latitude);
    const dLng = this.toRadians(point2.longitude - point1.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(point1.latitude)) *
              Math.cos(this.toRadians(point2.latitude)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
```

## Matching Algorithm Implementation

### Player Compatibility Scoring
```typescript
const calculateCompatibilityScore = (requester: Player, candidate: Player): number => {
  let score = 0;
  let maxScore = 0;
  
  // Skill level compatibility (40% weight)
  const skillWeight = 40;
  const skillDifference = Math.abs(
    parseFloat(requester.nrtpLevel) - parseFloat(candidate.nrtpLevel)
  );
  const skillScore = Math.max(0, (2 - skillDifference) / 2) * skillWeight;
  score += skillScore;
  maxScore += skillWeight;
  
  // Age compatibility (20% weight)
  const ageWeight = 20;
  const requesterAge = calculateAge(requester.dateOfBirth);
  const candidateAge = calculateAge(candidate.dateOfBirth);
  const ageDifference = Math.abs(requesterAge - candidateAge);
  const ageScore = Math.max(0, (15 - ageDifference) / 15) * ageWeight;
  score += ageScore;
  maxScore += ageWeight;
  
  // Activity level (20% weight)
  const activityWeight = 20;
  const activityScore = calculateActivityCompatibility(requester, candidate) * activityWeight;
  score += activityScore;
  maxScore += activityWeight;
  
  // Availability overlap (20% weight)
  const availabilityWeight = 20;
  const availabilityScore = calculateAvailabilityOverlap(requester, candidate) * availabilityWeight;
  score += availabilityScore;
  maxScore += availabilityWeight;
  
  return Math.round((score / maxScore) * 100);
};
```

### Smart Ranking Algorithm
```typescript
const rankPlayerMatches = (
  requester: Player,
  candidates: Player[],
  requesterLocation: Coordinates
): PlayerMatch[] => {
  return candidates
    .map(candidate => {
      const distance = calculateDistance(requesterLocation, {
        latitude: candidate.latitude,
        longitude: candidate.longitude
      });
      
      const compatibilityScore = calculateCompatibilityScore(requester, candidate);
      
      // Combined score: 60% compatibility, 40% proximity
      const finalScore = (compatibilityScore * 0.6) + 
                        (Math.max(0, (50 - distance) / 50) * 100 * 0.4);
      
      return {
        player: candidate,
        distance,
        compatibilityScore,
        finalScore
      };
    })
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, 20); // Limit to top 20 matches
};
```

## Privacy Controls Implementation

### Visibility Settings Interface
```typescript
interface VisibilitySettings {
  canBeFound: boolean;           // Master toggle for findability
  showExactLocation: boolean;    // Show precise location vs general area
  showFullProfile: boolean;      // Show full profile vs summary
  showContactInfo: boolean;      // Show phone/email
  allowDirectMessages: boolean;  // Allow direct messaging
  showActivityLevel: boolean;    // Show how often they play
  maxDistance: number;           // Maximum search distance others can use
}

// Privacy explanation component
const PrivacyExplanation = () => (
  <div className="bg-blue-50 p-4 rounded-lg">
    <h3 className="font-semibold text-blue-800">¿Cómo funciona "Puedo ser encontrado"?</h3>
    <ul className="text-sm text-blue-700 mt-2 space-y-1">
      <li>✓ Activado: Otros jugadores premium pueden encontrarte en búsquedas</li>
      <li>✗ Desactivado: No aparecerás en resultados de búsqueda</li>
      <li>📍 Solo se muestra tu área general, no ubicación exacta</li>
      <li>🔒 Tu información personal siempre está protegida</li>
      <li>🚫 Puedes bloquear usuarios específicos en cualquier momento</li>
    </ul>
  </div>
);
```

## Notification System

### Multi-Channel Notifications
```typescript
// Notification service with SMS and Email
export class NotificationService {
  async sendMatchNotification(match: PlayerMatch): Promise<void> {
    const requester = await getUserById(match.requesterId);
    const matchedPlayer = await getUserById(match.matchedPlayerId);
    
    // Get notification preferences
    const requesterPrefs = await getNotificationPreferences(match.requesterId);
    const matchedPrefs = await getNotificationPreferences(match.matchedPlayerId);
    
    // Notify requester
    if (requesterPrefs.playerFinderNotifications) {
      await this.sendToUser(requester, {
        type: 'match_found',
        title: '¡Jugador encontrado!',
        message: `Encontramos un jugador compatible cerca de ti: ${matchedPlayer.fullName}`,
        data: { matchId: match.id }
      });
    }
    
    // Notify matched player
    if (matchedPrefs.playerFinderNotifications) {
      await this.sendToUser(matchedPlayer, {
        type: 'match_request',
        title: 'Solicitud de juego',
        message: `${requester.fullName} está buscando jugadores en tu área`,
        data: { matchId: match.id }
      });
    }
  }
  
  private async sendToUser(user: User, notification: NotificationData): Promise<void> {
    const promises = [];
    
    // Send email if enabled
    if (user.emailNotifications) {
      promises.push(this.sendEmailNotification(user.email, notification));
    }
    
    // Send SMS if enabled and phone provided
    if (user.smsNotifications && user.mobilePhone) {
      promises.push(this.sendSMSNotification(user.mobilePhone, notification));
    }
    
    // Send push notification if enabled
    if (user.pushNotifications) {
      promises.push(this.sendPushNotification(user.id, notification));
    }
    
    await Promise.allSettled(promises);
  }
}
```

### SMS Integration (Twilio)
```typescript
const sendSMS = async (phoneNumber: string, message: string): Promise<void> => {
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
  } catch (error) {
    console.error('SMS sending failed:', error);
    throw error;
  }
};
```

## Travel Mode Feature

### Travel Location Management
```typescript
// Travel mode for finding players in visited locations
export class TravelModeService {
  async createTravelRequest(
    userId: number,
    destination: LocationData,
    travelDates: { start: string; end: string }
  ): Promise<TravelRequest> {
    const request = await TravelRequest.create({
      userId,
      destination,
      startDate: travelDates.start,
      endDate: travelDates.end,
      isActive: true
    });
    
    // Find players in destination area
    const nearbyPlayers = await this.findPlayersInArea(
      destination.coordinates,
      25 // 25km radius for travel
    );
    
    // Send notifications to local players
    await this.notifyLocalPlayers(nearbyPlayers, request);
    
    return request;
  }
  
  async findPlayersInArea(center: Coordinates, radius: number): Promise<Player[]> {
    // Use geospatial query to find players within radius
    return await Player.findAll({
      where: {
        canBeFound: true,
        [Op.and]: [
          sequelize.where(
            sequelize.fn(
              'ST_DWithin',
              sequelize.col('location'),
              sequelize.fn('ST_Point', center.longitude, center.latitude),
              radius * 1000 // Convert to meters
            ),
            true
          )
        ]
      }
    });
  }
}
```

## Testing Requirements

### Backend Testing
```bash
# Test player finder search
curl -X POST http://localhost:5000/api/player-finder/search \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"latitude":19.4326,"longitude":-99.1332,"radius":10,"skillLevel":"3.0"}'

# Test location update
curl -X POST http://localhost:5000/api/location/update \
  -H "Authorization: Bearer <token>" \
  -d '{"latitude":19.4326,"longitude":-99.1332,"address":"Mexico City"}'

# Test messaging
curl -X POST http://localhost:5000/api/conversations \
  -H "Authorization: Bearer <token>" \
  -d '{"participantId":2}'
```

### Frontend Testing
- Test location permission requests
- Verify player search and filtering
- Test privacy toggle functionality
- Verify messaging interface
- Test notification preferences
- Test map integration
- Verify mobile responsiveness

### Integration Testing
- Complete player finder flow from search to contact
- SMS and email notification delivery
- Location accuracy and privacy controls
- Messaging between matched players
- Premium feature access controls

## Cost Optimization Strategies

### Minimizing Google Maps API Costs
1. **Caching**: Cache geocoding results to avoid repeated API calls
2. **Batch Requests**: Group multiple requests when possible
3. **Free Alternatives**: Use OpenStreetMap for basic geocoding
4. **Smart Defaults**: Use approximate locations instead of exact coordinates
5. **User Input**: Let users manually input/verify locations

### Alternative Solutions
1. **OpenStreetMap**: Free geocoding and mapping
2. **Browser Geolocation**: Free current location detection
4. **Cached Mexican Locations**: Pre-cache common Mexican addresses

## Success Criteria
✅ Location-based player search works accurately
✅ Privacy controls function correctly ("Can Be Found" toggle)
✅ SMS and email notifications are delivered
✅ Matching algorithm produces relevant results
✅ Messaging system enables player communication
✅ Travel mode finds players in visited locations
✅ Premium access controls work properly
✅ Mobile interface is fully functional
✅ Distance calculations are accurate
✅ Map integration works (if implemented)
✅ Cost-free alternatives function as backup
✅ Notification preferences are respected

## Commands to Test
```bash
# Test player finder system
npm run test:player-finder

# Test location services
npm run test:location-services

# Test notification system
npm run test:notifications

# Test messaging system
npm run test:messaging

# Start with sample data
docker-compose up -d
npm run seed:player-finder
```

## Next Steps
After completing this step, you should have:
- Complete player finder system with location matching
- Enhanced messaging capabilities
- Privacy controls and user safety features
- Multi-channel notification system
- Travel mode for location-based networking
- Cost-effective location services

The next step will focus on ranking systems and digital credential generation with QR codes.