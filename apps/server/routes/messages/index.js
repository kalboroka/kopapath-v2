import express from 'express';
import { requireAuth } from '#middlewares';
import clean from './clean.js';
import ack from './ack.js';
import messages from './list.js';

const rt = express.Router();

rt.use(requireAuth);
rt.get('/', messages);
rt.patch('/ack/:id', ack);
rt.delete('/clean/:id', clean);

export default rt;