const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('../config');

// Informações básicas sobre a API
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API MVC Escalável',
      version: '1.0.0',
      description: 'Documentação da API de arquitetura MVC escalável para projetos futuros',
      contact: {
        name: 'Suporte',
        email: 'suporte@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.PORT || 3000}`,
        description: 'Servidor de desenvolvimento'
      },
      {
        url: 'https://api-producao.example.com',
        description: 'Servidor de produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Mensagem de erro'
            },
            errors: {
              type: 'object',
              example: {}
            }
          }
        },
        User: {
          type: 'object',
          required: ['id', 'name', 'email', 'role'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: 'João Silva'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@example.com'
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              example: 'user'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-05-07T15:30:00Z'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'admin123'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Login realizado com sucesso'
            },
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                },
                user: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'Novo Usuário'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'novo@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'senha123'
            }
          }
        },
        RegisterResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Usuário registrado com sucesso'
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Serviço funcionando normalmente'
            },
            data: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'OK'
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-05-07T15:30:00Z'
                },
                serverStartTime: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-05-07T12:00:00Z'
                },
                metrics: {
                  type: 'object',
                  properties: {
                    process: {
                      type: 'object',
                      properties: {
                        uptime: {
                          type: 'number',
                          example: 12600
                        },
                        memoryUsage: {
                          type: 'object'
                        },
                        cpuUsage: {
                          type: 'object'
                        }
                      }
                    },
                    system: {
                      type: 'object',
                      properties: {
                        totalMemory: {
                          type: 'number',
                          example: 8589934592
                        },
                        freeMemory: {
                          type: 'number',
                          example: 4294967296
                        },
                        cpus: {
                          type: 'number',
                          example: 8
                        },
                        loadAvg: {
                          type: 'array',
                          items: {
                            type: 'number'
                          },
                          example: [1.2, 1.5, 1.7]
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        LogsResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Logs obtidos com sucesso'
            },
            data: {
              type: 'object',
              properties: {
                logType: {
                  type: 'string',
                  example: 'error'
                },
                count: {
                  type: 'number',
                  example: 10
                },
                logs: {
                  type: 'array',
                  items: {
                    type: 'object'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/docs/*.js', './src/app.js']
};

// Gerar especificação do Swagger
const swaggerSpec = swaggerJsDoc(swaggerOptions);

// Função para configurar o Swagger no app Express
function setupSwagger(app) {
  // Rota para documentação do Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Rota para obter a especificação do Swagger em JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log(`Swagger docs disponíveis em: http://localhost:${config.PORT}/api-docs`);
}

module.exports = {
  setupSwagger
};