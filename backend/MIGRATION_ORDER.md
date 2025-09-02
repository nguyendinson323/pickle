# Migration Order Based on Dependencies

## Proper Sequential Order (Based on Foreign Key Dependencies)

### Level 1: Foundation (No Dependencies)
1. states
2. membership-plans  
3. subscription-plans
4. microsite-themes
5. notification-templates
6. system-alerts
7. platform-statistics

### Level 2: Core Users & Auth
8. users

### Level 3: User-Dependent Models
9. players (depends on users)
10. coaches (depends on users, states)
11. partners (depends on users)
12. clubs (depends on users, states)
13. state-committees (depends on states)
14. credentials (depends on users)
15. admin-logs (depends on users)
16. payment-methods (depends on users)
17. notification-preferences (depends on users)

### Level 4: Organization Dependent
18. memberships (depends on users, membership-plans)
19. subscriptions (depends on users, subscription-plans)
20. court-facilities (depends on clubs/users)
21. microsites (depends on users, themes)

### Level 5: Facility Dependent
22. courts (depends on court-facilities)
23. court-schedules (depends on courts)
24. maintenance-records (depends on courts)

### Level 6: Tournament & Location
25. player-locations (depends on players)
26. tournaments (depends on states, users)
27. tournament-categories (depends on tournaments)

### Level 7: Complex Relationships
28. tournament-registrations (depends on tournaments, players)
29. tournament-brackets (depends on tournaments, categories)
30. tournament-matches (depends on tournaments, players)
31. reservations (depends on tournaments, courts)
32. court-bookings (depends on courts, users)
33. court-reviews (depends on courts, users)

### Level 8: Rankings & Points
34. rankings (depends on players)
35. ranking-history (depends on players, tournaments)
36. point-calculations (depends on tournaments, players)

### Level 9: Player Matching
37. player-privacy-settings (depends on players)
38. player-finder-requests (depends on players)
39. player-finder-matches (depends on requests, players)

### Level 10: Messaging & Communication
40. conversations (depends on users)
41. messages (depends on users)
42. conversation-messages (depends on conversations, users)
43. message-reactions (depends on conversation-messages, users)
44. message-read-status (depends on conversation-messages, users)
45. notifications (depends on users)
46. notification-queue (depends on users)

### Level 11: Payments
47. payments (depends on users, bookings, registrations)
48. invoices (depends on users, payments)

### Level 12: Microsite Features
49. microsite-pages (depends on microsites)
50. content-blocks (depends on microsite-pages)
51. microsite-templates (no real dependency but logically here)
52. microsite-analytics (depends on microsites)
53. media-library (depends on microsites, users)
54. media-files (depends on users)

### Level 13: Moderation
55. content-moderation (depends on users, various content)
56. moderation-logs (depends on microsites, users)