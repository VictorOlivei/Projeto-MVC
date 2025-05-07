const express = require('express');
const HealthController = require('../controllers/health.controller');

// Criação do roteador
const router = express.Router();

/**
 * Rotas de health check
 * Implementa os endpoints para monitoramento básico do sistema
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificar saúde do sistema
 *     description: Retorna informações sobre o estado atual do sistema, incluindo métricas de CPU, memória e tempo de atividade
 *     tags: [Monitoramento]
 *     responses:
 *       200:
 *         description: Informações de saúde do sistema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
router.get('/', HealthController.check);

module.exports = router;