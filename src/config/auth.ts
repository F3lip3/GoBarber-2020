export default {
  jwt: {
    secret: process.env.API_SECRET ?? 'undefined',
    expiresIn: '1d'
  }
};
