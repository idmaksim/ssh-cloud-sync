export default () => ({
  port: process.env.PORT,
  secretKey: process.env.SECRET_KEY,
  swagger: {
    user: process.env.SWAGGER_USER,
    password: process.env.SWAGGER_PASSWORD,
  },
});
