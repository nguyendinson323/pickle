import { QueryInterface } from 'sequelize';
import subscriptionPlansSeeder from '../seeders/subscriptionPlans';

export default {
  async up(queryInterface: QueryInterface) {
    return subscriptionPlansSeeder.up(queryInterface);
  },

  async down(queryInterface: QueryInterface) {
    return subscriptionPlansSeeder.down(queryInterface);
  }
};