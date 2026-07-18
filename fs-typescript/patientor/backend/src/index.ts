import express from 'express';
import cors from 'cors';
import diagnosesRouter from './routes/diagnosesRoute.ts';
import patientsRouter from './routes/patiensRoute.ts';
import { errorMiddleware } from './utils.ts';

const app = express();

app.use(cors());
app.use(express.json());
app.use(errorMiddleware);

app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', patientsRouter);

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    
});