module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    // Get sample users to create push subscriptions for
    const users = await queryInterface.sequelize.query(
      'SELECT id, username FROM users WHERE role IN (\'player\', \'coach\', \'club\') LIMIT 20',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const subscriptions = users.map((user, index) => {
      // Generate realistic push subscription data
      const subscription = {
        user_id: user.id,
        subscription_data: JSON.stringify({
          endpoint: `https://fcm.googleapis.com/fcm/send/subscription_${index + 1}`,
          keys: {
            p256dh: generateKey(87),
            auth: generateKey(24)
          }
        }),
        user_agent: getUserAgent(index),
        device_type: getDeviceType(index),
        browser: getBrowser(index),
        is_active: true,
        last_used: now,
        created_at: now,
        updated_at: now
      };

      return subscription;
    });

    console.log(`Seeding ${subscriptions.length} push notification subscriptions...`);
    await queryInterface.bulkInsert('push_subscriptions', subscriptions);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('push_subscriptions', {}, {});
  }
};

function generateKey(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getUserAgent(index) {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 14; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0'
  ];
  return userAgents[index % userAgents.length];
}

function getDeviceType(index) {
  const deviceTypes = ['desktop', 'mobile', 'tablet'];
  return deviceTypes[index % deviceTypes.length];
}

function getBrowser(index) {
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
  return browsers[index % browsers.length];
}