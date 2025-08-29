import { QueryInterface } from "sequelize";

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert("player_finder_requests", [
    {
      requester_id: 1,
      title: "Looking for doubles partner",
      description: "I’m looking for a doubles partner for casual matches on weekends.",
      skill_level: "intermediate",
      preferred_gender: "any",
      age_range_min: 18,
      age_range_max: 35,
      playing_style: "aggressive",
      max_distance: 20,
      location_id: 1,
      availability_days: JSON.stringify(["Saturday", "Sunday"]),
      availability_time_start: "09:00:00",
      availability_time_end: "12:00:00",
      max_players: 2,
      current_players: 1,
      is_active: true,
      expires_at: new Date(new Date().setDate(new Date().getDate() + 30)),
      preferences: JSON.stringify({ court_type: "hard" }),
      status: "active",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      requester_id: 2,
      title: "Weekly evening matches",
      description: "Looking for someone to play competitive singles during weekday evenings.",
      skill_level: "advanced",
      preferred_gender: "male",
      age_range_min: 25,
      age_range_max: 40,
      playing_style: "defensive",
      max_distance: 15,
      location_id: 1,
      availability_days: JSON.stringify(["Monday", "Wednesday", "Friday"]),
      availability_time_start: "18:00:00",
      availability_time_end: "21:00:00",
      max_players: 2,
      current_players: 1,
      is_active: true,
      expires_at: new Date(new Date().setDate(new Date().getDate() + 14)),
      preferences: JSON.stringify({ surface: "clay" }),
      status: "active",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      requester_id: 3,
      title: "Beginner friendly group",
      description: "Creating a group for beginners to learn and practice together.",
      skill_level: "beginner",
      preferred_gender: null,
      age_range_min: null,
      age_range_max: null,
      playing_style: null,
      max_distance: 25,
      location_id: 1,
      availability_days: JSON.stringify(["Sunday"]),
      availability_time_start: "10:00:00",
      availability_time_end: "13:00:00",
      max_players: 4,
      current_players: 2,
      is_active: true,
      expires_at: new Date(new Date().setDate(new Date().getDate() + 60)),
      preferences: JSON.stringify({ coaching: true }),
      status: "active",
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete("player_finder_requests", {}, {});
}
