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
  NotificationQueue
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

Reservation.hasOne(CourtReview, { foreignKey: 'reservation_id', as: 'courtReview' });
CourtReview.belongsTo(Reservation, { foreignKey: 'reservation_id', as: 'reservation' });

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
PlayerFinderMatch.belongsTo(Player, { foreignKey: 'player_id', as: 'player' });

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
  NotificationQueue
};
export default models;