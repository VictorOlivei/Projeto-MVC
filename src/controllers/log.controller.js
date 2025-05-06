const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const ApiView = require('../views/api.view');

/**
 * Controlador de Logs
 * Responsável por fornecer acesso aos logs do sistema
 */
const LogController = {
  /**
   * Obter logs do sistema
   * @param {Request} req - Objeto de requisição do Express
   * @param {Response} res - Objeto de resposta do Express
   * @param {NextFunction} next - Função next do Express
   */
  getLogs: async (req, res, next) => {
    try {
      const logType = req.query.type || 'combined';
      const limit = parseInt(req.query.limit) || 100;
      
      // Define qual arquivo de log será lido
      let logFileName;
      switch (logType) {
        case 'error':
          logFileName = 'error.log';
          break;
        case 'access':
          logFileName = 'access.log';
          break;
        case 'combined':
        default:
          logFileName = 'combined.log';
      }
      
      // Caminho para o arquivo de log
      const logFilePath = path.join(__dirname, '../logs', logFileName);
      
      // Verifica se o arquivo de log existe
      if (!fs.existsSync(logFilePath)) {
        const response = ApiView.error(`Arquivo de log não encontrado`, 404);
        return res.status(response.status).json(response.body);
      }
      
      // Lê o arquivo de log
      const logData = fs.readFileSync(logFilePath, 'utf8');
      
      // Divide por linha e obtém as entradas mais recentes
      const logEntries = logData
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          try {
            return JSON.parse(line);
          } catch (error) {
            return { message: line };
          }
        })
        .slice(-limit)
        .reverse(); // Mais recentes primeiro
        
      // Registra a consulta aos logs
      logger.info(`Logs consultados: tipo=${logType}, limite=${limit}`, {
        user: req.user ? req.user.id : 'anônimo'
      });
      
      // Retorna os logs usando a camada View
      const response = ApiView.success('Logs obtidos com sucesso', {
        logType,
        count: logEntries.length,
        logs: logEntries
      });
      res.status(response.status).json(response.body);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = LogController;