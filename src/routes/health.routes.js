const express = require('express');
const HealthController = require('../controllers/health.controller');

// Criação do roteador
const router = express.Router();

/**
 * Rotas de health check
 * Implementa os endpoints para monitoramento básico do sistema
 */

// Rota para health check - GET /health
router.get('/', HealthController.check);

module.exports = router;