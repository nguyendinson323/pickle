import sequelize from '../config/database';
import User from './User';
import Player from './Player';
import Coach from './Coach';
import Club from './Club';
import Partner from './Partner';
import StateCommittee from './StateCommittee';
import State from './State';
import Message from './Message';
import Notification from './Notification';
import MembershipPlan from './MembershipPlan';
import Membership from './Membership';
import Payment from './Payment';
import Invoice from './Invoice';
import Court from './Court';
import Reservation from './Reservation';
import CourtSchedule from './CourtSchedule';
import CourtReview from './CourtReview';
import CourtFacility from './CourtFacility';
import CourtBooking from './CourtBooking';
import MaintenanceRecord from './MaintenanceRecord';
import Tournament from './Tournament';
import TournamentCategory from './TournamentCategory';
import TournamentRegistration from './TournamentRegistration';
import TournamentMatch from './TournamentMatch';
import TournamentBracket from './TournamentBracket';
import PlayerLocation from './PlayerLocation';
import PlayerFinderRequest from './PlayerFinderRequest';
import PlayerFinderMatch from './PlayerFinderMatch';
import PlayerPrivacySetting from './PlayerPrivacySetting';
import Conversation from './Conversation';
import ConversationMessage from './ConversationMessage';
import MessageReadStatus from './MessageReadStatus';
import MessageReaction from './MessageReaction';
import NotificationQueue from './NotificationQueue';
import Ranking from './Ranking';
import RankingHistory from './RankingHistory';
import Credential from './Credential';
import PointCalculation from './PointCalculation';
import Microsite from './Microsite';
import MicrositePage from './MicrositePage';
import ContentBlock from './ContentBlock';
import Theme from './Theme';
import MediaFile from './MediaFile';
import ModerationLog from './ModerationLog';

// Initialize models
const models = {
  User,
  Player,
  Coach,
  Club,
  Partner,
  StateCommittee,
  State,
  Message,
  Notification,
  MembershipPlan,
  Membership,
  Payment,
  Invoice,
  Court,
  Reservation,
  CourtSchedule,
  CourtReview,
  CourtFacility,
  CourtBooking,
  MaintenanceRecord,
  Tournament,
  TournamentCategory,
  TournamentRegistration,
  TournamentMatch,
  TournamentBracket,
  PlayerLocation,
  PlayerFinderRequest,
  PlayerFinderMatch,
  PlayerPrivacySetting,
  Conversation,
  ConversationMessage,
  MessageReadStatus,
  MessageReaction,
  NotificationQueue,
  Ranking,
  RankingHistory,
  Credential,
  PointCalculation,
  Microsite,
  MicrositePage,
  ContentBlock,
  Theme,
  MediaFile,
  ModerationLog
};

// Define associations
User.hasOne(Player, { foreignKey: 'user_id', as: 'playerProfile' });
Player.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(Coach, { foreignKey: 'user_id', as: 'coachProfile' });
Coach.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(Club, { foreignKey: 'user_id', as: 'clubProfile' });
Club.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(Partner, { foreignKey: 'user_id', as: 'partnerProfile' });
Partner.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(StateCommittee, { foreignKey: 'user_id', as: 'stateCommitteeProfile' });
StateCommittee.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// State associations
Player.belongsTo(State, { foreignKey: 'state_id', as: 'state' });
Coach.belongsTo(State, { foreignKey: 'state_id', as: 'state' });
Club.belongsTo(State, { foreignKey: 'state_id', as: 'state' });
StateCommittee.belongsTo(State, { foreignKey: 'state_id', as: 'state' });

State.hasMany(Player, { foreignKey: 'state_id', as: 'players' });
State.hasMany(Coach, { foreignKey: 'state_id', as: 'coaches' });
State.hasMany(Club, { foreignKey: 'state_id', as: 'clubs' });
State.hasMany(StateCommittee, { foreignKey: 'state_id', as: 'stateCommittees' });

// Message associations
User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiver_id', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

// Notification associations
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Membership associations
User.hasMany(Membership, { foreignKey: 'user_id', as: 'memberships' });
Membership.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

MembershipPlan.hasMany(Membership, { foreignKey: 'membership_plan_id', as: 'memberships' });
Membership.belongsTo(MembershipPlan, { foreignKey: 'membership_plan_id', as: 'plan' });

// Payment associations
User.hasMany(Payment, { foreignKey: 'user_id', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

MembershipPlan.hasMany(Payment, { foreignKey: 'membership_plan_id', as: 'payments' });
Payment.belongsTo(MembershipPlan, { foreignKey: 'membership_plan_id', as: 'plan' });

Membership.hasMany(Payment, { foreignKey: 'reference_id', as: 'payments', scope: { reference_type: 'membership' } });
Payment.belongsTo(Membership, { foreignKey: 'reference_id', as: 'membership', constraints: false });

// Invoice associations
User.hasMany(Invoice, { foreignKey: 'user_id', as: 'invoices' });
Invoice.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Payment.hasOne(Invoice, { foreignKey: 'payment_id', as: 'invoice' });
Invoice.belongsTo(Payment, { foreignKey: 'payment_id', as: 'payment' });

MembershipPlan.hasMany(Invoice, { foreignKey: 'membership_plan_id', as: 'invoices' });
Invoice.belongsTo(MembershipPlan, { foreignKey: 'membership_plan_id', as: 'plan' });

// Court associations
Club.hasMany(Court, { foreignKey: 'owner_id', as: 'courts', scope: { owner_type: 'club' } });
Partner.hasMany(Court, { foreignKey: 'owner_id', as: 'courts', scope: { owner_type: 'partner' } });
Court.belongsTo(Club, { foreignKey: 'owner_id', as: 'clubOwner', constraints: false });
Court.belongsTo(Partner, { foreignKey: 'owner_id', as: 'partnerOwner', constraints: false });

State.hasMany(Court, { foreignKey: 'state_id', as: 'courts' });
Court.belongsTo(State, { foreignKey: 'state_id', as: 'state' });

// Reservation associations
User.hasMany(Reservation, { foreignKey: 'user_id', as: 'reservations' });
Reservation.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Court.hasMany(Reservation, { foreignKey: 'court_id', as: 'reservations' });
Reservation.belongsTo(Court, { foreignKey: 'court_id', as: 'court' });

Payment.hasOne(Reservation, { foreignKey: 'payment_id', as: 'reservation' });
Reservation.belongsTo(Payment, { foreignKey: 'payment_id', as: 'payment' });

// CourtSchedule associations
Court.hasMany(CourtSchedule, { foreignKey: 'court_id', as: 'schedule' });
CourtSchedule.belongsTo(Court, { foreignKey: 'court_id', as: 'court' });

// CourtReview associations
User.hasMany(CourtReview, { foreignKey: 'user_id', as: 'courtReviews' });
CourtReview.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Court.hasMany(CourtReview, { foreignKey: 'court_id', as: 'reviews' });
CourtReview.belongsTo(Court, { foreignKey: 'court_id', as: 'court' });

CourtFacility.hasMany(CourtReview, { foreignKey: 'facility_id', as: 'reviews' });
CourtReview.belongsTo(CourtFacility, { foreignKey: 'facility_id', as: 'facility' });

CourtBooking.hasOne(CourtReview, { foreignKey: 'booking_id', as: 'review' });
CourtReview.belongsTo(CourtBooking, { foreignKey: 'booking_id', as: 'booking' });

// Court Management System associations
// CourtFacility associations
User.hasMany(CourtFacility, { foreignKey: 'owner_id', as: 'ownedFacilities' });
CourtFacility.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

CourtFacility.hasMany(Court, { foreignKey: 'facility_id', as: 'courts' });
Court.belongsTo(CourtFacility, { foreignKey: 'facility_id', as: 'facility' });

// CourtBooking associations
Court.hasMany(CourtBooking, { foreignKey: 'court_id', as: 'bookings' });
CourtBooking.belongsTo(Court, { foreignKey: 'court_id', as: 'court' });

User.hasMany(CourtBooking, { foreignKey: 'user_id', as: 'courtBookings' });
CourtBooking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// MaintenanceRecord associations
Court.hasMany(MaintenanceRecord, { foreignKey: 'court_id', as: 'maintenanceRecords' });
MaintenanceRecord.belongsTo(Court, { foreignKey: 'court_id', as: 'court' });

CourtFacility.hasMany(MaintenanceRecord, { foreignKey: 'facility_id', as: 'maintenanceRecords' });
MaintenanceRecord.belongsTo(CourtFacility, { foreignKey: 'facility_id', as: 'facility' });

// Tournament associations
// Tournament to User (organizer)
User.hasMany(Tournament, { foreignKey: 'organizer_id', as: 'organizedTournaments' });
Tournament.belongsTo(User, { foreignKey: 'organizer_id', as: 'organizer' });

// Tournament to State
State.hasMany(Tournament, { foreignKey: 'state_id', as: 'tournaments' });
Tournament.belongsTo(State, { foreignKey: 'state_id', as: 'state' });

// Tournament to Category
Tournament.hasMany(TournamentCategory, { foreignKey: 'tournament_id', as: 'categories' });
TournamentCategory.belongsTo(Tournament, { foreignKey: 'tournament_id', as: 'tournament' });

// Tournament to Registration
Tournament.hasMany(TournamentRegistration, { foreignKey: 'tournament_id', as: 'registrations' });
TournamentRegistration.belongsTo(Tournament, { foreignKey: 'tournament_id', as: 'tournament' });

TournamentCategory.hasMany(TournamentRegistration, { foreignKey: 'category_id', as: 'registrations' });
TournamentRegistration.belongsTo(TournamentCategory, { foreignKey: 'category_id', as: 'category' });

// Registration to Players
User.hasMany(TournamentRegistration, { foreignKey: 'player_id', as: 'tournamentRegistrations' });
TournamentRegistration.belongsTo(User, { foreignKey: 'player_id', as: 'player' });

User.hasMany(TournamentRegistration, { foreignKey: 'partner_id', as: 'partnerRegistrations' });
TournamentRegistration.belongsTo(User, { foreignKey: 'partner_id', as: 'partner' });

// Registration to Payment
Payment.hasMany(TournamentRegistration, { foreignKey: 'payment_id', as: 'tournamentRegistrations' });
TournamentRegistration.belongsTo(Payment, { foreignKey: 'payment_id', as: 'payment' });

// Tournament to Bracket
Tournament.hasMany(TournamentBracket, { foreignKey: 'tournament_id', as: 'brackets' });
TournamentBracket.belongsTo(Tournament, { foreignKey: 'tournament_id', as: 'tournament' });

TournamentCategory.hasMany(TournamentBracket, { foreignKey: 'category_id', as: 'brackets' });
TournamentBracket.belongsTo(TournamentCategory, { foreignKey: 'category_id', as: 'category' });

// Tournament to Match
Tournament.hasMany(TournamentMatch, { foreignKey: 'tournament_id', as: 'matches' });
TournamentMatch.belongsTo(Tournament, { foreignKey: 'tournament_id', as: 'tournament' });

TournamentCategory.hasMany(TournamentMatch, { foreignKey: 'category_id', as: 'matches' });
TournamentMatch.belongsTo(TournamentCategory, { foreignKey: 'category_id', as: 'category' });

TournamentBracket.hasMany(TournamentMatch, { foreignKey: 'bracket_id', as: 'matches' });
TournamentMatch.belongsTo(TournamentBracket, { foreignKey: 'bracket_id', as: 'bracket' });

// Match to Players
User.hasMany(TournamentMatch, { foreignKey: 'player1_id', as: 'player1Matches' });
TournamentMatch.belongsTo(User, { foreignKey: 'player1_id', as: 'player1' });

User.hasMany(TournamentMatch, { foreignKey: 'player2_id', as: 'player2Matches' });
TournamentMatch.belongsTo(User, { foreignKey: 'player2_id', as: 'player2' });

User.hasMany(TournamentMatch, { foreignKey: 'player1_partner_id', as: 'player1PartnerMatches' });
TournamentMatch.belongsTo(User, { foreignKey: 'player1_partner_id', as: 'player1Partner' });

User.hasMany(TournamentMatch, { foreignKey: 'player2_partner_id', as: 'player2PartnerMatches' });
TournamentMatch.belongsTo(User, { foreignKey: 'player2_partner_id', as: 'player2Partner' });

// Match to Winner/Loser
User.hasMany(TournamentMatch, { foreignKey: 'winner_id', as: 'wonMatches' });
TournamentMatch.belongsTo(User, { foreignKey: 'winner_id', as: 'winner' });

User.hasMany(TournamentMatch, { foreignKey: 'loser_id', as: 'lostMatches' });
TournamentMatch.belongsTo(User, { foreignKey: 'loser_id', as: 'loser' });

// Match to Referee
User.hasMany(TournamentMatch, { foreignKey: 'referee_id', as: 'refereesMatches' });
TournamentMatch.belongsTo(User, { foreignKey: 'referee_id', as: 'referee' });

// Match to Court
Court.hasMany(TournamentMatch, { foreignKey: 'court_id', as: 'tournamentMatches' });
TournamentMatch.belongsTo(Court, { foreignKey: 'court_id', as: 'court' });

// Bracket winners
User.hasMany(TournamentBracket, { foreignKey: 'winner_player_id', as: 'wonBrackets' });
TournamentBracket.belongsTo(User, { foreignKey: 'winner_player_id', as: 'winner' });

User.hasMany(TournamentBracket, { foreignKey: 'runner_up_player_id', as: 'runnerUpBrackets' });
TournamentBracket.belongsTo(User, { foreignKey: 'runner_up_player_id', as: 'runnerUp' });

// Player Location associations
Player.hasMany(PlayerLocation, { foreignKey: 'player_id', as: 'locations' });
PlayerLocation.belongsTo(Player, { foreignKey: 'player_id', as: 'player' });

// Player Privacy Settings associations
Player.hasOne(PlayerPrivacySetting, { foreignKey: 'player_id', as: 'privacySettings' });
PlayerPrivacySetting.belongsTo(Player, { foreignKey: 'player_id', as: 'player' });

// Player Finder Request associations
Player.hasMany(PlayerFinderRequest, { foreignKey: 'requester_id', as: 'finderRequests' });
PlayerFinderRequest.belongsTo(Player, { foreignKey: 'requester_id', as: 'requester' });

PlayerLocation.hasMany(PlayerFinderRequest, { foreignKey: 'location_id', as: 'finderRequests' });
PlayerFinderRequest.belongsTo(PlayerLocation, { foreignKey: 'location_id', as: 'location' });

// Player Finder Match associations
PlayerFinderRequest.hasMany(PlayerFinderMatch, { foreignKey: 'request_id', as: 'matches' });
PlayerFinderMatch.belongsTo(PlayerFinderRequest, { foreignKey: 'request_id', as: 'request' });

Player.hasMany(PlayerFinderMatch, { foreignKey: 'player_id', as: 'finderMatches' });
PlayerFinderMatch.belongsTo(Player, { foreignKey: 'player_id', as: 'matchedPlayer' });

// Conversation associations
User.hasMany(Conversation, { foreignKey: 'creator_id', as: 'createdConversations' });
Conversation.belongsTo(User, { foreignKey: 'creator_id', as: 'creator' });

// Conversation Message associations
Conversation.hasMany(ConversationMessage, { foreignKey: 'conversation_id', as: 'messages' });
ConversationMessage.belongsTo(Conversation, { foreignKey: 'conversation_id', as: 'conversation' });

User.hasMany(ConversationMessage, { foreignKey: 'sender_id', as: 'conversationMessages' });
ConversationMessage.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

ConversationMessage.hasMany(ConversationMessage, { foreignKey: 'reply_to_id', as: 'replies' });
ConversationMessage.belongsTo(ConversationMessage, { foreignKey: 'reply_to_id', as: 'replyTo' });

// Message Read Status associations
ConversationMessage.hasMany(MessageReadStatus, { foreignKey: 'message_id', as: 'readStatus' });
MessageReadStatus.belongsTo(ConversationMessage, { foreignKey: 'message_id', as: 'message' });

User.hasMany(MessageReadStatus, { foreignKey: 'user_id', as: 'messageReadStatus' });
MessageReadStatus.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Message Reaction associations
ConversationMessage.hasMany(MessageReaction, { foreignKey: 'message_id', as: 'reactions' });
MessageReaction.belongsTo(ConversationMessage, { foreignKey: 'message_id', as: 'message' });

User.hasMany(MessageReaction, { foreignKey: 'user_id', as: 'messageReactions' });
MessageReaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Notification Queue associations
User.hasMany(NotificationQueue, { foreignKey: 'user_id', as: 'notificationQueue' });
NotificationQueue.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Ranking associations
Player.hasMany(Ranking, { foreignKey: 'player_id', as: 'rankings' });
Ranking.belongsTo(Player, { foreignKey: 'player_id', as: 'player' });

State.hasMany(Ranking, { foreignKey: 'state_id', as: 'rankings' });
Ranking.belongsTo(State, { foreignKey: 'state_id', as: 'state' });

// Ranking History associations
Player.hasMany(RankingHistory, { foreignKey: 'player_id', as: 'rankingHistory' });
RankingHistory.belongsTo(Player, { foreignKey: 'player_id', as: 'player' });

Tournament.hasMany(RankingHistory, { foreignKey: 'tournament_id', as: 'rankingChanges' });
RankingHistory.belongsTo(Tournament, { foreignKey: 'tournament_id', as: 'tournament' });

State.hasMany(RankingHistory, { foreignKey: 'state_id', as: 'rankingHistory' });
RankingHistory.belongsTo(State, { foreignKey: 'state_id', as: 'state' });

// Credential associations
User.hasMany(Credential, { foreignKey: 'user_id', as: 'credentials' });
Credential.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

State.hasMany(Credential, { foreignKey: 'state_id', as: 'credentials' });
Credential.belongsTo(State, { foreignKey: 'state_id', as: 'state' });

// Point Calculation associations
Tournament.hasMany(PointCalculation, { foreignKey: 'tournament_id', as: 'pointCalculations' });
PointCalculation.belongsTo(Tournament, { foreignKey: 'tournament_id', as: 'tournament' });

Player.hasMany(PointCalculation, { foreignKey: 'player_id', as: 'pointCalculations' });
PointCalculation.belongsTo(Player, { foreignKey: 'player_id', as: 'player' });

TournamentMatch.hasMany(PointCalculation, { foreignKey: 'match_id', as: 'pointCalculations' });
PointCalculation.belongsTo(TournamentMatch, { foreignKey: 'match_id', as: 'match' });

// Microsite associations
User.hasMany(Microsite, { foreignKey: 'user_id', as: 'microsites' });
Microsite.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Club.hasMany(Microsite, { foreignKey: 'owner_id', as: 'microsites', scope: { owner_type: 'club' } });
Partner.hasMany(Microsite, { foreignKey: 'owner_id', as: 'microsites', scope: { owner_type: 'partner' } });
StateCommittee.hasMany(Microsite, { foreignKey: 'owner_id', as: 'microsites', scope: { owner_type: 'state' } });

Microsite.belongsTo(Club, { foreignKey: 'owner_id', as: 'clubOwner', constraints: false });
Microsite.belongsTo(Partner, { foreignKey: 'owner_id', as: 'partnerOwner', constraints: false });
Microsite.belongsTo(StateCommittee, { foreignKey: 'owner_id', as: 'stateOwner', constraints: false });

Theme.hasMany(Microsite, { foreignKey: 'theme_id', as: 'microsites' });
Microsite.belongsTo(Theme, { foreignKey: 'theme_id', as: 'theme' });

// Microsite Page associations
Microsite.hasMany(MicrositePage, { foreignKey: 'microsite_id', as: 'pages' });
MicrositePage.belongsTo(Microsite, { foreignKey: 'microsite_id', as: 'microsite' });

MicrositePage.hasMany(MicrositePage, { foreignKey: 'parent_page_id', as: 'childPages' });
MicrositePage.belongsTo(MicrositePage, { foreignKey: 'parent_page_id', as: 'parentPage' });

// Content Block associations
MicrositePage.hasMany(ContentBlock, { foreignKey: 'page_id', as: 'contentBlocks' });
ContentBlock.belongsTo(MicrositePage, { foreignKey: 'page_id', as: 'page' });

// Media File associations
Microsite.hasMany(MediaFile, { foreignKey: 'microsite_id', as: 'mediaFiles' });
MediaFile.belongsTo(Microsite, { foreignKey: 'microsite_id', as: 'microsite' });

User.hasMany(MediaFile, { foreignKey: 'user_id', as: 'uploadedFiles' });
MediaFile.belongsTo(User, { foreignKey: 'user_id', as: 'uploader' });

// Moderation Log associations
Microsite.hasMany(ModerationLog, { foreignKey: 'microsite_id', as: 'moderationLogs' });
ModerationLog.belongsTo(Microsite, { foreignKey: 'microsite_id', as: 'microsite' });

User.hasMany(ModerationLog, { foreignKey: 'moderator_id', as: 'moderationActions' });
ModerationLog.belongsTo(User, { foreignKey: 'moderator_id', as: 'moderator' });

export { sequelize };
export { 
  User, 
  Player, 
  Coach, 
  Club, 
  Partner, 
  StateCommittee, 
  State, 
  Message, 
  Notification,
  MembershipPlan,
  Membership,
  Payment,
  Invoice,
  Court,
  Reservation,
  CourtSchedule,
  CourtReview,
  CourtFacility,
  CourtBooking,
  MaintenanceRecord,
  Tournament,
  TournamentCategory,
  TournamentRegistration,
  TournamentMatch,
  TournamentBracket,
  PlayerLocation,
  PlayerFinderRequest,
  PlayerFinderMatch,
  PlayerPrivacySetting,
  Conversation,
  ConversationMessage,
  MessageReadStatus,
  MessageReaction,
  NotificationQueue,
  Ranking,
  RankingHistory,
  Credential,
  PointCalculation,
  Microsite,
  MicrositePage,
  ContentBlock,
  Theme,
  MediaFile,
  ModerationLog
};
export default models;