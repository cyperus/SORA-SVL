import express from 'express';
export const sensorRouter = express.Router();
sensorRouter.use(express.json());
sensorRouter.get('/queryBridges', (req, res) => {});
sensorRouter.get('/querySensorConfigs', (req, res) => {});
