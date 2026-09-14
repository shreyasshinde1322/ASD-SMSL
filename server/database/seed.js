const bcrypt = require('bcryptjs');
const { getDb } = require('./database');

function seedDatabase() {
  const db = getDb();

  try {
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@example.com');
    if (existingUser) {
      console.log('Seed data already exists. Skipping seed.');
      db.close();
      return;
    }

    const hashedPassword = bcrypt.hashSync('Demo@123', 10);

    const insertUser = db.prepare(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)'
    );
    insertUser.run('Demo User', 'demo@example.com', hashedPassword, '9999999999');

    const insertShipment = db.prepare(
      'INSERT INTO shipments (shipment_id, sender_name, receiver_name, package_details, destination, status) VALUES (?, ?, ?, ?, ?, ?)'
    );
    insertShipment.run('SHP-1001', 'Rahul Sharma', 'Amit Patil', 'Electronics', 'Pune', 'Created');
    insertShipment.run('SHP-1002', 'Neha Joshi', 'Rohan Mehta', 'Documents', 'Mumbai', 'Created');
    insertShipment.run('SHP-1003', 'Priya Verma', 'Sanjay Kulkarni', 'Clothing', 'Delhi', 'Created');

    console.log('Database seeded successfully.');
    console.log('');
    console.log('Test User Credentials:');
    console.log('  Email: demo@example.com');
    console.log('  Password: Demo@123');
    console.log('');
    console.log('Seed Shipments:');
    console.log('  SHP-1001, SHP-1002, SHP-1003');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    throw error;
  } finally {
    db.close();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
