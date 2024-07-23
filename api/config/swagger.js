const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RoleMaster API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'], // files containing annotations as above
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;