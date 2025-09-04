import dotenv from "dotenv"

dotenv.config({path: "./../"});

import express from 'express';
import { appRouter } from './routes/app-router';
import { errorController } from './controllers/error-controller';

const app = express();

app.use(express.json());
appRouter(app);

app.use(errorController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on port: ${PORT}`));
