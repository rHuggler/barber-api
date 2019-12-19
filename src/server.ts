import app from './app';

const APP_PORT = process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 5000;
const APP_URL = process.env.APP_URL || 'localhost';

app.listen(APP_PORT, () => console.log(`Server running on http://${APP_URL}:${APP_PORT}/`));
