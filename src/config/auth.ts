export default {
  jwt: {
    secret: process.env.API_SECRET,
    expiresIn: '1d'
  }
};
