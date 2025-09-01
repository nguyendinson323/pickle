import { Request, Response } from 'express';
import { AuthRequest } from '../types/auth';
import playerFinderService from '../services/playerFinderService';
import { asyncHandler } from '../middleware/errorHandler';

export const createFinderRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { location, preferences } = req.body;
  const userId = req.user.userId;

  // Validate required fields
  if (!location || !location.city || !location.state || !preferences) {
    return res.status(400).json({
      success: false,
      error: 'Location (city, state) and preferences are required'
    });
  }

  const request = await playerFinderService.createFinderRequest({
    userId,
    location,
    preferences
  });

  res.status(201).json({
    success: true,
    data: request,
    message: 'Player finder request created successfully. We\'ll notify you when matches are found!'
  });
});

export const getUserFinderRequests = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId;
  const requests = await playerFinderService.getUserFinderRequests(userId);

  res.json({
    success: true,
    data: requests
  });
});

export const getUserMatches = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId;
  const matches = await playerFinderService.getUserMatches(userId);

  res.json({
    success: true,
    data: matches
  });
});

export const respondToMatch = asyncHandler(async (req: AuthRequest, res: Response) => {
  const matchId = parseInt(req.params.matchId);
  const userId = req.user.userId;
  const { response, message } = req.body;

  if (!['accepted', 'declined'].includes(response)) {
    return res.status(400).json({
      success: false,
      error: 'Response must be "accepted" or "declined"'
    });
  }

  const match = await playerFinderService.respondToMatch(
    matchId,
    userId,
    response,
    message
  );

  res.json({
    success: true,
    data: match,
    message: `Match ${response} successfully`
  });
});

export const getMatchDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
  const matchId = parseInt(req.params.matchId);
  const userId = req.user.userId;

  const match = await playerFinderService.getMatchDetails(matchId, userId);

  res.json({
    success: true,
    data: match
  });
});

export const getUserLocation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId;
  const location = await playerFinderService.getUserLocation(userId);

  res.json({
    success: true,
    data: location
  });
});

export const updateUserLocation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId;
  const locationData = req.body;

  const location = await playerFinderService.updateUserLocation(userId, locationData);

  res.json({
    success: true,
    data: location,
    message: 'Location updated successfully'
  });
});

export const cancelFinderRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const requestId = parseInt(req.params.requestId);
  const userId = req.user.userId;

  const request = await playerFinderService.cancelFinderRequest(requestId, userId);

  res.json({
    success: true,
    data: request,
    message: 'Finder request cancelled successfully'
  });
});

export const triggerMatchSearch = asyncHandler(async (req: AuthRequest, res: Response) => {
  const requestId = parseInt(req.params.requestId);
  const userId = req.user.userId;

  // Verify the request belongs to the user
  const userRequests = await playerFinderService.getUserFinderRequests(userId);
  const request = userRequests.find(r => r.id === requestId);

  if (!request) {
    return res.status(404).json({
      success: false,
      error: 'Finder request not found or unauthorized'
    });
  }

  const matches = await (playerFinderService as any).findMatches(requestId);

  res.json({
    success: true,
    data: matches,
    message: `Found ${matches.length} new potential matches`
  });
});