
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BookReviewHub API',
      version: '1.0.0',
      description: 'API for managing book reviews, comments, and users'
    },
    servers: [{ url: 'https://bookreviewhub-api.onrender.com' }]
  },
  apis: [path.resolve(process.cwd(), 'src/Routes/*.js')]
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
