import { QueryInterface } from "sequelize";

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert("tournament_brackets", [
    {
      tournament_id: 1,
      category_id: 1,
      name: "Men’s Singles Bracket",
      bracket_type: "single_elimination",
      seeding_method: "ranking",
      total_rounds: 4,
      current_round: 2,
      is_complete: false,
      winner_player_id: null,
      runner_up_player_id: null,
      third_place_player_id: null,
      fourth_place_player_id: null,
      bracket_data: JSON.stringify({
        round1: ["P1 vs P8", "P2 vs P7", "P3 vs P6", "P4 vs P5"],
        round2: []
      }),
      seeding_data: JSON.stringify({ players: [1, 2, 3, 4, 5, 6, 7, 8] }),
      settings: JSON.stringify({ court_type: "hard", match_format: "best_of_3" }),
      generated_date: new Date("2025-08-01T09:00:00Z"),
      finalized_date: null,
      created_at: new Date("2025-08-01T09:00:00Z"),
      updated_at: new Date("2025-08-05T12:00:00Z")
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete("tournament_brackets", {}, {});
}
