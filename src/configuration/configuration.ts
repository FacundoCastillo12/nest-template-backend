export const configuration = () => ({
  server: {
    port: Number(process.env.PORT),
    nodeEnvironment: process.env.NODE_ENV,
  },
});
