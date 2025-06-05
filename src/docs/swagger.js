/**
 * Configuração do Swagger para documentação da API
 * Versão otimizada e mais limpa
 */
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const config = require("../config");

// Definições dos componentes reutilizáveis
const components = {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
  schemas: {
    // Esquemas de erro e resposta padrão
    Error: {
      type: "object",
      properties: {
        success: { type: "boolean", example: false },
        message: { type: "string", example: "Mensagem de erro" },
      },
    },

    // Esquemas de usuário
    User: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        name: { type: "string", example: "João Silva" },
        email: { type: "string", format: "email", example: "joao@example.com" },
        role: { type: "string", enum: ["admin", "user"], example: "user" },
        createdAt: { type: "string", format: "date-time" },
      },
    },

    // Esquemas de autenticação
    LoginRequest: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
          format: "email",
          example: "admin@example.com",
        },
        password: { type: "string", format: "password", example: "admin123" },
      },
    },
    LoginResponse: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string", example: "Login realizado com sucesso" },
        data: {
          type: "object",
          properties: {
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            user: { $ref: "#/components/schemas/User" },
          },
        },
      },
    },
    RegisterRequest: {
      type: "object",
      required: ["name", "email", "password"],
      properties: {
        name: { type: "string", example: "Novo Usuário" },
        email: { type: "string", format: "email", example: "novo@example.com" },
        password: { type: "string", format: "password", example: "senha123" },
      },
    },
    RegisterResponse: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string", example: "Usuário registrado com sucesso" },
        data: {
          type: "object",
          properties: {
            user: { $ref: "#/components/schemas/User" },
          },
        },
      },
    },

    // Esquemas de monitoramento
    HealthResponse: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string", example: "Serviço funcionando normalmente" },
        data: {
          type: "object",
          properties: {
            status: { type: "string", example: "OK" },
            timestamp: { type: "string", format: "date-time" },
            uptime: { type: "number", example: 12600 },
          },
        },
      },
    },
    LogsResponse: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string", example: "Logs consultados com sucesso" },
        data: {
          type: "object",
          properties: {
            logs: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },
    },
  },
};

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API MVC Escalável",
      version: "1.0.0",
      description: "Documentação da API de arquitetura MVC escalável",
      contact: {
        name: "Suporte",
        email: "suporte@example.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: `http://localhost:${config.PORT || 3000}`,
        description: "Servidor de desenvolvimento",
      },
    ],
    components,
  },
  // Padrão de arquivos para escanear por anotações de API
  apis: ["./src/routes/*.js"],
};

// Gerar especificação do Swagger
const swaggerSpec = swaggerJsDoc(swaggerOptions);

// Função para configurar o Swagger no app Express
function setupSwagger(app) {
  // Opções para personalizar a UI do Swagger
  const swaggerUiOptions = {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "API MVC - Documentação",
    docExpansion: "none",
  };

  // Rota para documentação do Swagger
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, swaggerUiOptions)
  );

  // Rota para obter a especificação do Swagger em JSON
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(
    `Swagger docs disponíveis em: http://localhost:${
      config.PORT || 3000
    }/api-docs`
  );
}

module.exports = { setupSwagger };
