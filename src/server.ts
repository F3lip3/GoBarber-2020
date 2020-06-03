import 'reflect-metadata';
import express from 'express';

import uploadConfig from './config/upload.config';
import routes from './routes';

import './database';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.listen(3333, () => {
  console.info('🚀 Server running on port 3333...');
});
