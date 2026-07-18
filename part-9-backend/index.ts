import express from 'express';
import { Request, Response } from 'express';
import { calculateBmi } from './bmiCalculator.ts';

const app = express();

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

const PORT = 3003;



app.get('/bmi', (req, res) => {

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const {height, weight} = req.query;

    const heightNum = Number(height);
    const weightNum = Number(weight);

    if ( !height || !weight || isNaN(heightNum) || isNaN(weightNum)) {
       return res.status(400).json({error: 'malformated parameters'});
    };

    const result = calculateBmi(heightNum as number, weightNum as number);

    return res.json({
        weight: weightNum,
        height: heightNum,
        bmi: result
    });
});

app.post('/bmiCalculator', (req:Request, res:Response) => {

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
     const { height, weight } = req.body;

     const heightValue = Number(height);
     const weightvalue = Number(weight);

     if (isNaN(heightValue) || isNaN(weightvalue)) {

        return res.status(400).json({error: 'malformated parameters'});
     }

     const bmi = calculateBmi( heightValue as number, weightvalue as number);

     return res.status(201).json({bmi});
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
});