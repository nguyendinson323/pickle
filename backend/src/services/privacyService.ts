import { PlayerPrivacySetting, Player } from '../models';

interface PrivacyUpdateData {
  showLocation?: boolean;
  showRealName?: boolean;
  showAge?: boolean;
  showPhone?: boolean;
  showEmail?: boolean;
  showSkillLevel?: boolean;
  showRanking?: boolean;
  allowFinderRequests?: boolean;
  allowDirectMessages?: boolean;
  allowTournamentInvites?: boolean;
  allowClubInvites?: boolean;
  maxDistance?: number;
  onlineStatus?: 'online' | 'away' | 'busy' | 'offline';
  profileVisibility?: 'public' | 'friends_only' | 'private';
  locationPrecision?: 'exact' | 'approximate' | 'city_only';
  autoDeclineFinderRequests?: boolean;
  preferredContactMethod?: 'app' | 'email' | 'sms';
  notificationPreferences?: Record<string, boolean>;
}

interface BlockedPlayer {
  id: number;
  name: string;
  blockedAt: Date;
}

class PrivacyService {
  async getOrCreatePrivacySettings(playerId: number): Promise<PlayerPrivacySetting> {
    let settings = await PlayerPrivacySetting.findOne({
      where: { playerId }
    });

    if (!settings) {
      settings = await PlayerPrivacySetting.create({
        playerId,
        showLocation: true,
        showRealName: true,
        showAge: true,
        showPhone: false,
        showEmail: false,
        showSkillLevel: true,
        showRanking: true,
        allowFinderRequests: true,
        allowDirectMessages: true,
        allowTournamentInvites: true,
        allowClubInvites: true,
        maxDistance: 25,
        onlineStatus: 'online',
        profileVisibility: 'public',
        locationPrecision: 'approximate',
        autoDeclineFinderRequests: false,
        blockList: [],
        preferredContactMethod: 'app',
        notificationPreferences: {
          newFinderRequest: true,
          finderRequestAccepted: true,
          finderRequestDeclined: true,
          newMessage: true,
          tournamentReminder: true,
          clubUpdate: true
        }
      });
    }

    return settings;
  }

  async updatePrivacySettings(
    playerId: number, 
    updates: PrivacyUpdateData
  ): Promise<PlayerPrivacySetting> {
    const settings = await this.getOrCreatePrivacySettings(playerId);

    // Validate data
    if (updates.maxDistance !== undefined) {
      if (updates.maxDistance < 1 || updates.maxDistance > 200) {
        throw new Error('Max distance must be between 1 and 200 km');
      }
    }

    if (updates.onlineStatus && !['online', 'away', 'busy', 'offline'].includes(updates.onlineStatus)) {
      throw new Error('Invalid online status');
    }

    if (updates.profileVisibility && !['public', 'friends_only', 'private'].includes(updates.profileVisibility)) {
      throw new Error('Invalid profile visibility');
    }

    if (updates.locationPrecision && !['exact', 'approximate', 'city_only'].includes(updates.locationPrecision)) {
      throw new Error('Invalid location precision');
    }

    if (updates.preferredContactMethod && !['app', 'email', 'sms'].includes(updates.preferredContactMethod)) {
      throw new Error('Invalid contact method');
    }

    // Update settings
    Object.assign(settings, updates);
    await settings.save();

    return settings;
  }

  async blockPlayer(playerId: number, targetPlayerId: number): Promise<void> {
    if (playerId === targetPlayerId) {
      throw new Error('Cannot block yourself');
    }

    const settings = await this.getOrCreatePrivacySettings(playerId);
    
    // Check if already blocked
    if (settings.blockList.includes(targetPlayerId)) {
      throw new Error('Player is already blocked');
    }

    // Add to block list
    settings.blockList = [...settings.blockList, targetPlayerId];
    await settings.save();
  }

  async unblockPlayer(playerId: number, targetPlayerId: number): Promise<void> {
    const settings = await this.getOrCreatePrivacySettings(playerId);
    
    // Remove from block list
    settings.blockList = settings.blockList.filter(id => id !== targetPlayerId);
    await settings.save();
  }

  async getBlockedPlayers(playerId: number): Promise<BlockedPlayer[]> {
    const settings = await this.getOrCreatePrivacySettings(playerId);
    
    if (settings.blockList.length === 0) {
      return [];
    }

    const players = await Player.findAll({
      where: {
        id: settings.blockList
      },
      include: [
        {
          model: require('../models').User,
          as: 'user',
          attributes: ['firstName', 'lastName']
        }
      ]
    });

    return players.map(player => {
      const user = (player as any).user;
      return {
        id: player.id,
        name: `${user?.firstName || 'Unknown'} ${user?.lastName || 'User'}`,
        blockedAt: new Date() // You might want to track this separately
      };
    });
  }

  async isPlayerBlocked(playerId: number, targetPlayerId: number): Promise<boolean> {
    const settings = await PlayerPrivacySetting.findOne({
      where: { playerId }
    });

    if (!settings) {
      return false;
    }

    return settings.blockList.includes(targetPlayerId);
  }

  async canPlayerContactUser(
    fromPlayerId: number,
    toPlayerId: number
  ): Promise<{ canContact: boolean; reason?: string }> {
    // Check if blocked
    const isBlocked = await this.isPlayerBlocked(toPlayerId, fromPlayerId);
    if (isBlocked) {
      return { canContact: false, reason: 'blocked' };
    }

    // Check privacy settings
    const settings = await PlayerPrivacySetting.findOne({
      where: { playerId: toPlayerId }
    });

    if (!settings) {
      return { canContact: true }; // Default allow if no settings
    }

    if (!settings.allowDirectMessages) {
      return { canContact: false, reason: 'messages_disabled' };
    }

    if (settings.profileVisibility === 'private') {
      return { canContact: false, reason: 'private_profile' };
    }

    return { canContact: true };
  }

  async canShowPlayerInFinder(
    playerId: number,
    requesterPlayerId: number,
    distance: number
  ): Promise<{ canShow: boolean; reason?: string }> {
    // Check if blocked
    const isBlocked = await this.isPlayerBlocked(playerId, requesterPlayerId);
    if (isBlocked) {
      return { canShow: false, reason: 'blocked' };
    }

    // Check player's finder availability
    const player = await Player.findByPk(playerId);
    if (!player || !player.canBeFound) {
      return { canShow: false, reason: 'finder_disabled' };
    }

    // Check privacy settings
    const settings = await PlayerPrivacySetting.findOne({
      where: { playerId }
    });

    if (!settings) {
      return { canShow: true }; // Default allow if no settings
    }

    if (!settings.allowFinderRequests) {
      return { canShow: false, reason: 'finder_requests_disabled' };
    }

    if (settings.profileVisibility === 'private') {
      return { canShow: false, reason: 'private_profile' };
    }

    if (distance > settings.maxDistance) {
      return { canShow: false, reason: 'distance_exceeded' };
    }

    return { canShow: true };
  }

  async filterPlayerDataByPrivacy(
    playerData: any,
    requestingPlayerId?: number
  ): Promise<any> {
    const playerId = playerData.id;
    
    // If it's the same user, show everything
    if (requestingPlayerId === playerId) {
      return playerData;
    }

    const settings = await PlayerPrivacySetting.findOne({
      where: { playerId }
    });

    if (!settings) {
      return playerData; // Default show all if no settings
    }

    // Check if requesting player is blocked
    if (requestingPlayerId && settings.blockList.includes(requestingPlayerId)) {
      return null; // Don't show any data to blocked users
    }

    const filtered = { ...playerData };

    // Apply privacy filters
    if (!settings.showRealName) {
      filtered.fullName = `${playerData.user?.firstName || 'Usuario'} ${playerData.user?.lastName?.charAt(0) || 'A'}.`;
    }

    if (!settings.showAge) {
      delete filtered.dateOfBirth;
    }

    if (!settings.showPhone) {
      delete filtered.mobilePhone;
    }

    if (!settings.showSkillLevel) {
      delete filtered.nrtpLevel;
    }

    if (!settings.showRanking) {
      delete filtered.rankingPosition;
    }

    // Handle email separately (usually from user object)
    if (filtered.user && !settings.showEmail) {
      delete filtered.user.email;
    }

    return filtered;
  }

  async updateNotificationPreferences(
    playerId: number,
    preferences: Record<string, boolean>
  ): Promise<PlayerPrivacySetting> {
    const settings = await this.getOrCreatePrivacySettings(playerId);
    
    settings.notificationPreferences = {
      ...settings.notificationPreferences,
      ...preferences
    };
    
    await settings.save();
    return settings;
  }

  async getNotificationPreference(
    playerId: number,
    notificationType: string
  ): Promise<boolean> {
    const settings = await PlayerPrivacySetting.findOne({
      where: { playerId }
    });

    if (!settings) {
      return true; // Default allow notifications
    }

    return settings.notificationPreferences[notificationType] !== false;
  }

  async setOnlineStatus(
    playerId: number,
    status: 'online' | 'away' | 'busy' | 'offline'
  ): Promise<void> {
    const settings = await this.getOrCreatePrivacySettings(playerId);
    settings.onlineStatus = status;
    await settings.save();
  }

  async getOnlineStatus(playerId: number): Promise<string> {
    const settings = await PlayerPrivacySetting.findOne({
      where: { playerId }
    });

    return settings?.onlineStatus || 'online';
  }

  async getPrivacySummary(playerId: number): Promise<{
    profileVisibility: string;
    finderEnabled: boolean;
    messagesEnabled: boolean;
    blockedPlayersCount: number;
  }> {
    const settings = await this.getOrCreatePrivacySettings(playerId);
    
    return {
      profileVisibility: settings.profileVisibility,
      finderEnabled: settings.allowFinderRequests,
      messagesEnabled: settings.allowDirectMessages,
      blockedPlayersCount: settings.blockList.length
    };
  }
}

export default new PrivacyService();