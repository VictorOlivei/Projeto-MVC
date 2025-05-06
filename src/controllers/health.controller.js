const os = require('os');
const logger = require('../utils/logger');
const ApiView = require('../views/api.view');

/**
 * Controlador de Health Check
 * Responsável por expor métricas e informações de saúde da aplicação
 */
const HealthController = {
  /**
   * Verificação básica de status
   * @param {Request} req - Objeto de requisição do Express
   * @param {Response} res - Objeto de resposta do Express
   */
  check: (req, res) => {
    // Métricas de processo
    const processMetrics = {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    };

    // Métricas do sistema
    const systemMetrics = {
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpus: os.cpus().length,
      loadAvg: os.loadavg()
    };

    // Data de início do servidor
    const startTime = new Date(Date.now() - (process.uptime() * 1000));

    // Registra o health check no sistema de logs
    logger.info('Health check realizado', { 
      ip: req.ip || 'unknown'
    });

    // Retorna as informações de saúde da aplicação usando a camada View
    const response = ApiView.success('Serviço funcionando normalmente', {
      status: 'OK',
      timestamp: new Date(),
      serverStartTime: startTime,
      metrics: {
        process: processMetrics,
        system: systemMetrics
      }
    });
    res.status(response.status).json(response.body);
  }
};

module.exports = HealthController;