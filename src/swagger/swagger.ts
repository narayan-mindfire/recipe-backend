import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Recipe API",
    version: "1.0.0",
    description: "API for managing recipes, users, comments, ratings, and auth",
  },
  servers: [
    {
      url: "http://localhost:5000/api/v1",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "accessToken",
      },
    },
  },
  security: [
    {
      cookieAuth: [],
    },
  ],
};

export const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: ["./src/routes/*.ts"],
});
