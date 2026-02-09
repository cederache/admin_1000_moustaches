import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Monitoring platform 1000 Moustaches API',
    description: 'API documentation for the 1000 Moustaches monitoring platform',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      Authorization: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'Firebase authentication token'
      }
    },
    schemas: {
      // Base models
      Species: {
        id: {
          type: 'integer',
          description: 'Unique identifier',
          example: 1
        },
        name: {
          type: 'string',
          description: 'Species name',
          example: 'Chat'
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Creation timestamp'
        },
        updatedAt: {
          type: 'string',
          format: 'date-time', 
          description: 'Last update timestamp'
        }
      },
      
      User: {
        id: {
          type: 'integer',
          description: 'Unique identifier',
          example: 1
        },
        name: {
          type: 'string',
          description: 'User last name',
          example: 'Dupont'
        },
        firstname: {
          type: 'string',
          description: 'User first name',
          example: 'Jean'
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'User email address',
          example: 'jean.dupont@example.com'
        },
        isReferent: {
          type: 'boolean',
          description: 'Whether the user is a referent',
          example: true
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Creation timestamp'
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Last update timestamp'
        }
      },
      
      Animal: {
        id: {
          type: 'integer',
          description: 'Unique identifier',
          example: 1
        },
        name: {
          type: 'string',
          description: 'Animal name',
          example: 'Whiskers'
        },
        species: {
          $ref: '#/components/schemas/Species'
        },
        icad: {
          type: 'string',
          description: 'ICAD identification number',
          example: '250268500123456'
        },
        sexe: {
          type: 'string',
          description: 'Animal gender',
          enum: ['M', 'F'],
          example: 'F'
        },
        race: {
          type: 'string',
          description: 'Animal breed',
          example: 'European Shorthair'
        },
        adopted: {
          type: 'boolean',
          description: 'Is adopted',
          default: false
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Creation timestamp'
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Last update timestamp'
        }
      },
      
      HostFamily: {
        id: {
          type: 'integer',
          description: 'Unique identifier',
          example: 1
        },
        name: {
          type: 'string',
          description: 'Host family last name',
          example: 'Martin'
        },
        firstname: {
          type: 'string',
          description: 'Host family first name',
          example: 'Marie'
        },
        phone: {
          type: 'string',
          description: 'Phone number',
          example: '+33123456789'
        },
        mail: {
          type: 'string',
          format: 'email',
          description: 'Email address',
          example: 'marie.martin@example.com'
        },
        address: {
          type: 'string',
          description: 'Address',
          example: '456 Avenue des Fleurs, 69000 Lyon'
        },
        isAvailable: {
          type: 'boolean',
          description: 'Is available for hosting',
          default: true
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Creation timestamp'
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Last update timestamp'
        }
      },
      
      Veterinarian: {
        id: {
          type: 'integer',
          description: 'Unique identifier',
          example: 1
        },
        name: {
          type: 'string',
          description: 'Veterinarian name',
          example: 'Dr. Martin'
        },
        phone: {
          type: 'string',
          description: 'Phone number',
          example: '+33123456789'
        },
        mail: {
          type: 'string',
          format: 'email',
          description: 'Email address',
          example: 'dr.martin@veterinary.com'
        },
        address: {
          type: 'string',
          description: 'Veterinarian address',
          example: '123 Rue de la Paix, 75001 Paris'
        },
        priceLevel: {
          type: 'integer',
          description: 'Price level (1-5 scale)',
          minimum: 1,
          maximum: 5,
          example: 3
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Creation timestamp'
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Last update timestamp'
        }
      },
      
      VeterinarianIntervention: {
        id: {
          type: 'integer',
          description: 'Unique identifier',
          example: 1
        },
        date: {
          type: 'string',
          format: 'date-time',
          description: 'Date when intervention was performed',
          example: '2023-12-15T10:30:00Z'
        },
        description: {
          type: 'string',
          description: 'Detailed description of the intervention'
        },
        animal: {
          $ref: '#/components/schemas/Animal'
        },
        veterinarian: {
          $ref: '#/components/schemas/Veterinarian'
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Creation timestamp'
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Last update timestamp'
        }
      },
      
      AnimalHostFamily: {
        id: {
          type: 'integer',
          description: 'Unique identifier',
          example: 1
        },
        animal: {
          $ref: '#/components/schemas/Animal'
        },
        hostFamily: {
          $ref: '#/components/schemas/HostFamily'
        },
        entryDate: {
          type: 'string',
          format: 'date-time',
          description: 'Date when animal entered the host family',
          example: '2023-12-15T10:30:00Z'
        }
      },
      
      HostFamilyKind: {
        id: {
          type: 'integer',
          description: 'Unique identifier',
          example: 1
        },
        name: {
          type: 'string',
          description: 'Name of the host family kind',
          example: 'Fosters for cats'
        },
        species: {
          $ref: '#/components/schemas/Species'
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Creation timestamp'
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Last update timestamp'
        }
      },
      
      Permission: {
        id: {
          type: 'integer',
          description: 'Unique identifier',
          example: 1
        },
        resource: {
          type: 'string',
          description: 'Resource name',
          example: 'PET_LIST'
        },
        method: {
          type: 'string',
          description: 'HTTP method',
          example: 'GET'
        },
        allowed: {
          type: 'boolean',
          description: 'Whether the permission is allowed',
          example: true
        }
      },
      
      // Request DTOs
      CreateAnimalRequest: {
        name: {
          type: 'string',
          description: 'Animal name',
          example: 'Whiskers'
        },
        icad: {
          type: 'string',
          description: 'ICAD identification number',
          example: '250268500123456'
        },
        sexe: {
          type: 'string',
          enum: ['M', 'F'],
          example: 'F'
        },
        race: {
          type: 'string',
          example: 'European Shorthair'
        }
      },
      
      UpdateAnimalRequest: {
        name: {
          type: 'string',
          example: 'Whiskers Updated'
        },
        sexe: {
          type: 'string',
          enum: ['M', 'F']
        },
        race: {
          type: 'string'
        },
        adopted: {
          type: 'boolean'
        }
      },
      
      CreateUserRequest: {
        name: {
          type: 'string',
          example: 'Dupont'
        },
        firstname: {
          type: 'string',
          example: 'Jean'
        },
        email: {
          type: 'string',
          format: 'email',
          example: 'jean.dupont@example.com'
        },
        isReferent: {
          type: 'boolean',
          default: false
        }
      },
      
      CreateHostFamilyRequest: {
        name: {
          type: 'string',
          example: 'Martin'
        },
        firstname: {
          type: 'string',
          example: 'Marie'
        },
        phone: {
          type: 'string',
          example: '+33123456789'
        },
        mail: {
          type: 'string',
          format: 'email',
          example: 'marie.martin@example.com'
        },
        address: {
          type: 'string',
          example: '456 Avenue des Fleurs, 69000 Lyon'
        }
      },
      
      CreateVeterinarianRequest: {
        name: {
          type: 'string',
          example: 'Dr. Martin'
        },
        phone: {
          type: 'string',
          example: '+33123456789'
        },
        mail: {
          type: 'string',
          format: 'email',
          example: 'dr.martin@veterinary.com'
        },
        address: {
          type: 'string',
          example: '123 Rue de la Paix, 75001 Paris'
        },
        priceLevel: {
          type: 'integer',
          minimum: 1,
          maximum: 5,
          example: 3
        }
      },
      
      CreateVeterinarianInterventionRequest: {
        date: {
          type: 'string',
          format: 'date-time',
          description: 'Date when intervention was performed',
          example: '2023-12-15T10:30:00Z'
        },
        description: {
          type: 'string',
          description: 'Detailed description of the intervention'
        }
      },
      
      CreateAnimalHostFamilyRequest: {
        entryDate: {
          type: 'string',
          format: 'date-time',
          description: 'Date when animal entered the host family',
          example: '2023-12-15T10:30:00Z'
        }
      },
      
      CreateHostFamilyKindRequest: {
        name: {
          type: 'string',
          description: 'Name of the host family kind',
          example: 'Fosters for cats'
        }
      },
      
      // Response DTOs
      CountResponse: {
        count: {
          type: 'integer',
          description: 'Count result',
          example: 42
        }
      },
      
      HealthResponse: {
        status: {
          type: 'string',
          example: 'OK'
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2023-12-15T10:30:00.000Z'
        },
        service: {
          type: 'string',
          example: 'admin_1000_moustaches_server'
        }
      },
    }
  },
  security: [
    {
      Authorization: []
    }
  ],
  
  // Add tags for better organization
  tags: [
    {
      name: 'Health',
      description: 'Health check endpoints'
    },
    {
      name: 'Animals',
      description: 'Animal management endpoints'
    },
    {
      name: 'Users',
      description: 'User management endpoints'
    },
    {
      name: 'Host Families',
      description: 'Host family management endpoints'
    },
    {
      name: 'Veterinarians', 
      description: 'Veterinarian management endpoints'
    },
    {
      name: 'Species',
      description: 'Species management endpoints'
    },
    {
      name: 'Statistics',
      description: 'Statistical endpoints'
    },
    {
      name: 'Veterinary Interventions',
      description: 'Track veterinary interventions and medical care'
    },
    {
      name: 'Host Family Relations',
      description: 'Manage animal-host family relationships and placement history'
    },
    {
      name: 'Host Family Kinds',
      description: 'Manage types of host family care capabilities'
    },
    {
      name: 'Permissions',
      description: 'User permissions and access control'
    }
  ]
};

const outputFile = './swagger-output.json';
const routes = [
  './index.ts',
  './app/routes/AnimalRoutes.ts',
  './app/routes/AnimalHostFamilyRoutes.ts', 
  './app/routes/HostFamilyRoutes.ts',
  './app/routes/HostFamilyKindRoutes.ts',
  './app/routes/VeterinarianRoutes.ts',
  './app/routes/VeterinarianInterventionRoutes.ts',
  './app/routes/SpeciesRoutes.ts',
  './app/routes/UserRoutes.ts',
  './app/routes/PermissionRoutes.ts',
  './app/routes/CountAnimalsAdopted.ts',
  './app/routes/CountAnimalsNonAdopted.ts',
  './app/routes/CountHostFamiliesAvailable.ts'
];

const options = {
  openapi: '3.0.0', // Use OpenAPI 3.0 for better array handling
  language: 'en-US',
  disableLogs: false,
  autoHeaders: false,
  autoQuery: false,
  autoBody: false
};

swaggerAutogen(options)(outputFile, routes, doc);
