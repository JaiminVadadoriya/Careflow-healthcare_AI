import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'CareFlow Hospital Management System API',
    description: 'API for CareFlow Healthcare AI, managing hospital resources, patients, and staff.',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:8000/api/v1',
      description: 'Local Development Server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const outputFile = './openapi.json';
const endpointsFiles = [
  './src/app.js'
];

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);
