export const baseConfig = () => ({
  jwt_secret: process.env.JWT_SECRET,
  port: process.env.PORT,
  saltRounds: process.env.SALT_ROUNDS,
  rabbit_url: process.env.RABBIT_URL,
});

//Spilit config into different files
