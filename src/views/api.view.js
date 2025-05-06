/**
 * Camada de visualização (View) para resposta da API
 * Fornece formatação padronizada para respostas HTTP
 */
class ApiView {
  /**
   * Formata uma resposta de sucesso
   * @param {string} message - Mensagem de sucesso
   * @param {object} data - Dados a serem retornados
   * @param {number} statusCode - Código de status HTTP (padrão: 200)
   * @returns {object} Resposta formatada
   */
  static success(message, data = {}, statusCode = 200) {
    return {
      status: statusCode,
      body: {
        success: true,
        message,
        data
      }
    };
  }

  /**
   * Formata uma resposta de erro
   * @param {string} message - Mensagem de erro
   * @param {number} statusCode - Código de status HTTP (padrão: 400)
   * @param {object} errors - Detalhes adicionais do erro
   * @returns {object} Resposta formatada
   */
  static error(message, statusCode = 400, errors = {}) {
    return {
      status: statusCode,
      body: {
        success: false,
        message,
        errors
      }
    };
  }

  /**
   * Formata uma resposta paginada
   * @param {Array} items - Itens da página atual
   * @param {number} totalItems - Total de itens disponíveis
   * @param {number} page - Página atual
   * @param {number} pageSize - Tamanho da página
   * @param {string} message - Mensagem adicional
   * @returns {object} Resposta formatada
   */
  static paginated(items, totalItems, page, pageSize, message = 'Dados retornados com sucesso') {
    const totalPages = Math.ceil(totalItems / pageSize);
    
    return {
      status: 200,
      body: {
        success: true,
        message,
        data: {
          items,
          meta: {
            totalItems,
            totalPages,
            currentPage: page,
            pageSize,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      }
    };
  }
}

module.exports = ApiView;