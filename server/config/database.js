import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

let sequelize;

if (dbUrl) {
  sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: dbUrl.includes('localhost') ? false : {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'),
    logging: false
  });
}

export default sequelize;

