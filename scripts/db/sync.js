require('dotenv').config();
const db = require('../../models');

async function main() {
  try {
    console.log('Starting database models synchronization...');
    await db.sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (exception) {
    console.error(exception);
  }
}

main();
