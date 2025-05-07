const express = require('express');
const LogController = require('../controllers/log.controller');
const { authMiddleware, authorizeRoles } = require('../middlewares/auth.middleware');

// Criação do roteador
const router = express.Router();

/**
 * Rotas de logs
 * Implementa os endpoints para acesso aos logs do sistema
 * Apenas usuários autenticados com papel 'admin' podem acessar
 */

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Obter logs do sistema
 *     description: Retorna os logs do sistema de acordo com o tipo especificado. Apenas usuários com papel de 'admin' podem acessar este recurso.
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [combined, error, access]
 *           default: combined
 *         description: Tipo de log a ser retornado
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *           minimum: 1
 *           maximum: 1000
 *         description: Número máximo de entradas de log a serem retornadas
 *     responses:
 *       200:
 *         description: Logs obtidos com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogsResponse'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Sem permissão para acessar este recurso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Arquivo de log não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authMiddleware, authorizeRoles(['admin']), LogController.getLogs);

module.exports = router;