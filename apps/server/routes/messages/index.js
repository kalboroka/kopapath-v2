import express from 'express';
import { requireAuth } from '#middlewares';
import send from './send.js';
import clean from './clean.js';
import ack from './ack.js';
import message from './message.js';
import messages from './list.js';

const rt = express.Router();

rt.get('/', requireAuth, messages);
rt.post('/', requireAuth, send);
rt.patch('/ack', requireAuth, ack);
rt.delete('/clean/:id', requireAuth, clean);
rt.get('/:id', requireAuth, message);

export default rt;