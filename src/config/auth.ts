const APP_SECRET = process.env.APP_SECRET || 's3cr3t';

export default {
  secret: APP_SECRET,
  signOptions: { expiresIn: '7d' },
};
