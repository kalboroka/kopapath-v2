import express from 'express';
import path from "path";
import { fileURLToPath } from "url";

import { secureApp } from '#middlewares';
import { migDb } from '#config';
import authRoutes from '#routes/auth';
import adminRoutes from '#routes/admin';
import loanRoutes from '#routes/loans';
import msgRoutes from '#routes/messages';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
secureApp(app);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

const paths = [
  /^\/(about|account|admin|fqas|messages)?$/,
  /^\/auth\/(login|reset|signup)$/,
  /^\/loans(\/apply|\/repay)?$/
];
app.get(paths, (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  } catch(err) {
    next(err)
  }
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/loans', loanRoutes);
app.use('/api/v1/messages', msgRoutes);

app.use((req, res) => {
  res.status(404).json({ err: 'Not Found' });
})
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ err: 'Internal server error' });
  next()
});

app.listen(process.env.PORT, () => {
  console.log('server started');
  migDb(); // db migrstions
});
