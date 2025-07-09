export default () => ({
  port: process.env.PORT,
  swagger: {
    user: process.env.SWAGGER_USER,
    password: process.env.SWAGGER_PASSWORD,
  },
});
