require('dotenv').config();
const db = require('../../models');

async function main() {
  try {
    console.log('Starting database models synchronization...');
    //await db.sequelize.sync({ alter: true });
    await db.sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');
  } catch (exception) {
    console.error(exception);
  }
}

main();
