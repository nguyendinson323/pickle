import { QueryInterface } from "sequelize";

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert("player_finder_matches", [
    {
      request_id: 1,
      player_id: 2,
      match_score: 85,
      distance: 5.25,
      status: "accepted",
      requested_at: new Date("2025-08-10T10:00:00Z"),
      responded_at: new Date("2025-08-11T12:30:00Z"),
      message: "Hey, I’d love to join your doubles match this weekend!",
      is_viewed: true,
      match_reasons: JSON.stringify(["close_distance", "similar_skill_level"]),
      created_at: new Date("2025-08-10T10:00:00Z"),
      updated_at: new Date("2025-08-11T12:30:00Z")
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete("player_finder_matches", {}, {});
}
