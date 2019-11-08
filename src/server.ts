import { createConnection } from 'typeorm';

import app from './app';

createConnection()
  .then(() => {
    app.listen(5000, () => console.log('Server running on http://localhost:5000/'));
  })
  .catch((err) => {
    console.error(err);
  });
