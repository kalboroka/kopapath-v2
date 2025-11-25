import express from 'express';
import { requireAuth } from '#middlewares';
import clean from './clean.js';
import ack from './ack.js';
import messages from './list.js';

const rt = express.Router();

rt.get('/', requireAuth, messages);
rt.patch('/ack/:id', requireAuth, ack);
rt.delete('/clean/:id', requireAuth, clean);

export default rt;