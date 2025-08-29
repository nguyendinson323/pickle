import { QueryInterface } from "sequelize";

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert("court_reviews", [
    {
      court_id: 1,
      user_id: 1,
      reservation_id: 1,
      rating: 5,
      title: "Excellent court!",
      comment: "The surface was well maintained, lighting was perfect for an evening match.",
      amenity_ratings: JSON.stringify({ lighting: 5, cleanliness: 5, seating: 4 }),
      is_verified_booking: true,
      is_recommended: true,
      owner_response: "Thank you for your feedback! We hope to see you again soon.",
      owner_response_at: new Date("2025-08-15"),
      is_hidden: false,
      created_at: new Date("2025-08-10"),
      updated_at: new Date("2025-08-15")
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete("court_reviews", {}, {});
}
