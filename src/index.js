import express from 'express';
import winston from 'winston';
import cookieParser from 'cookie-parser';
import mainRouter from './routes/main.router.js';
import { sequelize } from './config/database.config.js';

const app = express();
const PORT = process.env.API_PORT || 3000;

// logger to be used instead of directly the console for handling
// console statements in a more controlled and professional manner
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

// middlewares
app.use(express.json());
app.use(cookieParser());

// router
mainRouter(app);

async function main() {
  try {
    // synchronize models with the database
    await sequelize.sync();

    const port = 3000;
    app.listen(port);
    logger.info(`Server listening on port: ${PORT}`);
  } catch (error) {
    logger.info('Unable to connect to the database:', error);
  }
}

main();
