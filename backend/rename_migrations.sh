#!/bin/bash

cd /home/a/Documents/projects/pick-new/backend/src/migrations

# Remove duplicates and non-table migrations
rm -f 20240901000003-seed-subscription-plans.ts
rm -f 20240901000003-create-microsites.ts  # duplicate

# Now rename all files with new sequential numbering based on dependencies

# Level 1: Foundation (No Dependencies)
mv 20240301000001-create-states.ts 20241201000001-create-states.ts 2>/dev/null
mv 20240301000003-create-membership-plans.ts 20241201000002-create-membership-plans.ts 2>/dev/null
mv 20240901000009-create-subscription-plans.ts 20241201000003-create-subscription-plans.ts 2>/dev/null
mv 20240301000004-create-microsite-themes.ts 20241201000004-create-themes.ts 2>/dev/null
mv 20240901000006-create-notification-templates.ts 20241201000005-create-notification-templates.ts 2>/dev/null
# System alerts - need to create
# Platform statistics - need to create

# Level 2: Core Users
mv 20240301000002-create-users.ts 20241201000006-create-users.ts 2>/dev/null

# Level 3: User-Dependent Models
mv 20240301000005-create-players.ts 20241201000007-create-players.ts 2>/dev/null
mv 20240301000006-create-coaches.ts 20241201000008-create-coaches.ts 2>/dev/null
mv 20240301000008-create-partners.ts 20241201000009-create-partners.ts 2>/dev/null
mv 20240301000007-create-clubs.ts 20241201000010-create-clubs.ts 2>/dev/null
mv 20240301000009-create-state-committees.ts 20241201000011-create-state-committees.ts 2>/dev/null
mv 20240301000016-create-admin-credentials.ts 20241201000012-create-credentials.ts 2>/dev/null
mv 20240901000028-create-admin-logs.ts 20241201000013-create-admin-logs.ts 2>/dev/null
mv 20240901000007-create-payment-methods.ts 20241201000014-create-payment-methods.ts 2>/dev/null
mv 20240901000005-create-notification-preferences.ts 20241201000015-create-notification-preferences.ts 2>/dev/null
mv 20240301000017-create-media-files.ts 20241201000016-create-media-files.ts 2>/dev/null

# Level 4: Organization Dependent
mv 20240301000011-create-memberships.ts 20241201000017-create-memberships.ts 2>/dev/null
mv 20240901000008-create-subscriptions.ts 20241201000018-create-subscriptions.ts 2>/dev/null
mv 20240901000003-create-court-facilities.ts 20241201000019-create-court-facilities.ts 2>/dev/null
mv 20240301000018-create-microsites.ts 20241201000020-create-microsites.ts 2>/dev/null

# Level 5: Facility Dependent
mv 20240301000010-create-courts.ts 20241201000021-create-courts.ts 2>/dev/null
mv 20240301000026-create-court-schedules.ts 20241201000022-create-court-schedules.ts 2>/dev/null
mv 20240901000004-create-maintenance-records.ts 20241201000023-create-maintenance-records.ts 2>/dev/null

# Level 6: Tournament & Location
mv 20240301000012-create-player-locations.ts 20241201000024-create-player-locations.ts 2>/dev/null
mv 20240301000013-create-tournaments.ts 20241201000025-create-tournaments.ts 2>/dev/null
mv 20240301000021-create-tournament-categories.ts 20241201000026-create-tournament-categories.ts 2>/dev/null

# Level 7: Complex Relationships
mv 20240301000028-create-tournament-registrations.ts 20241201000027-create-tournament-registrations.ts 2>/dev/null
mv 20240301000030-create-tournament-brackets.ts 20241201000028-create-tournament-brackets.ts 2>/dev/null
mv 20240301000031-create-tournament-matches.ts 20241201000029-create-tournament-matches.ts 2>/dev/null
mv 20240301000020-create-reservations.ts 20241201000030-create-reservations.ts 2>/dev/null
mv 20240901000002-create-court-bookings.ts 20241201000031-create-court-bookings.ts 2>/dev/null
mv 20240301000027-create-court-reviews.ts 20241201000032-create-court-reviews.ts 2>/dev/null

# Level 8: Rankings & Points
mv 20240301000015-create-player-rankings.ts 20241201000033-create-rankings.ts 2>/dev/null
mv 20240901000027-create-ranking-history.ts 20241201000034-create-ranking-history.ts 2>/dev/null
mv 20240901000026-create-point-calculations.ts 20241201000035-create-point-calculations.ts 2>/dev/null

# Level 9: Player Matching
mv 20240901000025-create-player-privacy-settings.ts 20241201000036-create-player-privacy-settings.ts 2>/dev/null
mv 20240301000022-create-player-finder-requests.ts 20241201000037-create-player-finder-requests.ts 2>/dev/null
mv 20240301000029-create-player-finder-matches.ts 20241201000038-create-player-finder-matches.ts 2>/dev/null

# Level 10: Messaging & Communication
mv 20240301000014-create-conversations.ts 20241201000039-create-conversations.ts 2>/dev/null
mv 20240301000023-create-messages.ts 20241201000040-create-messages.ts 2>/dev/null
mv 20240901000016-create-conversation-messages.ts 20241201000041-create-conversation-messages.ts 2>/dev/null
mv 20240901000018-create-message-reactions.ts 20241201000042-create-message-reactions.ts 2>/dev/null
mv 20240901000019-create-message-read-status.ts 20241201000043-create-message-read-status.ts 2>/dev/null
mv 20240301000024-create-notifications.ts 20241201000044-create-notifications.ts 2>/dev/null
mv 20240901000024-create-notification-queue.ts 20241201000045-create-notification-queue.ts 2>/dev/null

# Level 11: Payments
mv 20240301000019-create-payments.ts 20241201000046-create-payments.ts 2>/dev/null
mv 20240301000025-create-invoices.ts 20241201000047-create-invoices.ts 2>/dev/null

# Level 12: Microsite Features
mv 20240901000021-create-microsite-pages.ts 20241201000048-create-microsite-pages.ts 2>/dev/null
mv 20240901000015-create-content-blocks.ts 20241201000049-create-content-blocks.ts 2>/dev/null
mv 20240901000022-create-microsite-templates.ts 20241201000050-create-microsite-templates.ts 2>/dev/null
mv 20240901000020-create-microsite-analytics.ts 20241201000051-create-microsite-analytics.ts 2>/dev/null
mv 20240901000017-create-media-library.ts 20241201000052-create-media-library.ts 2>/dev/null

# Level 13: Moderation
mv 20240901000023-create-moderation-logs.ts 20241201000053-create-moderation-logs.ts 2>/dev/null

echo "Migration renaming complete!"
ls -la