
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define Base Config
const openApiConfig = {
  openapi: "3.0.0",
  info: {
    title: "Careflow Healthcare AI API",
    version: "1.0.0",
    description: "API documentation for the Careflow Healthcare AI backend. Automatically generated."
  },
  servers: [
    {
      url: "http://localhost:8000/api/v1",
      description: "Local Development Server"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          email: { type: "string" },
          role: { type: "string", enum: ["admin", "doctor", "nurse", "receptionist", "patient"] },
          full_name: { type: "string" }
        }
      }
      // Add more schemas as needed strictly from models
    }
  },
  paths: {} // Paths will be populated or merged
};

// Function to generate the file
const generateDocs = () => {
  const outputPath = path.join(__dirname, '../../openapi.json');
  
  // In a real automated scenario, we would parse the routes/controllers here.
  // For now, we will ensure the file structure is valid and update the timestamp/version.
  
  console.log("Generating OpenAPI Documentation...");
  
  // Read existing manual definitions to preserve them (as we don't have a full auto-parser yet)
  let existingData = {};
  if (fs.existsSync(outputPath)) {
      existingData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      openApiConfig.paths = existingData.paths || {};
      openApiConfig.components = existingData.components || openApiConfig.components;
  }

  // Write back the file
  fs.writeFileSync(outputPath, JSON.stringify(openApiConfig, null, 2));
  console.log(`Documentation updated at: ${outputPath}`);
};

generateDocs();
