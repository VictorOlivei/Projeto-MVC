const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user.model');
const config = require('../config');
const logger = require('../utils/logger');
const ApiView = require('../views/api.view');

/**
 * Controlador de Autenticação
 * Responsável por gerenciar login e registro de usuários
 */
const AuthController = {
  /**
   * Login de usuário
   * @param {Request} req - Objeto de requisição do Express
   * @param {Response} res - Objeto de resposta do Express
   * @param {NextFunction} next - Função next do Express
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Validação básica dos campos
      if (!email || !password) {
        logger.warn('Tentativa de login com campos incompletos');
        const response = ApiView.error('E-mail e senha são obrigatórios', 400);
        return res.status(response.status).json(response.body);
      }

      // Busca o usuário pelo e-mail
      const user = UserModel.findByEmail(email);

      // Verifica se o usuário existe
      if (!user) {
        logger.warn(`Tentativa de login com e-mail não cadastrado: ${email}`);
        const response = ApiView.error('Credenciais inválidas', 401);
        return res.status(response.status).json(response.body);
      }

      // Em um sistema real, verificaríamos o hash da senha
      // Para o MVP, fazemos uma comparação direta
      const isPasswordValid = password === user.password;
      
      // Em produção, usaríamos bcrypt.compare:
      // const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        logger.warn(`Tentativa de login com senha incorreta para: ${email}`);
        const response = ApiView.error('Credenciais inválidas', 401);
        return res.status(response.status).json(response.body);
      }

      // Gera o token JWT
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          role: user.role 
        },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      // Registra o login bem-sucedido
      logger.info(`Login bem-sucedido: ${user.email}`);

      // Retorna o token e informações do usuário usando a camada View
      const response = ApiView.success('Login realizado com sucesso', {
        token,
        user: user.toJSON()
      });
      res.status(response.status).json(response.body);
    } catch (error) {
      // Passa o erro para o middleware de tratamento de erros
      next(error);
    }
  },

  /**
   * Registro de novo usuário
   * @param {Request} req - Objeto de requisição do Express
   * @param {Response} res - Objeto de resposta do Express
   * @param {NextFunction} next - Função next do Express
   */
  register: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      // Validação básica dos campos
      if (!name || !email || !password) {
        const response = ApiView.error('Nome, e-mail e senha são obrigatórios', 400);
        return res.status(response.status).json(response.body);
      }

      // Verifica se o e-mail já está cadastrado
      const existingUser = UserModel.findByEmail(email);
      if (existingUser) {
        logger.warn(`Tentativa de registro com e-mail já existente: ${email}`);
        const response = ApiView.error('E-mail já cadastrado', 409);
        return res.status(response.status).json(response.body);
      }

      // Em um sistema real, faríamos o hash da senha
      // const hashedPassword = await bcrypt.hash(password, 10);
      
      // Cria o novo usuário
      const newUser = UserModel.create({
        name,
        email,
        password, // Em produção: hashedPassword
        role: 'user' // Por padrão, novos usuários têm o papel 'user'
      });

      // Registra a criação do usuário
      logger.info(`Novo usuário registrado: ${email}`);

      // Retorna os dados do usuário (sem a senha) usando a camada View
      const response = ApiView.success('Usuário registrado com sucesso', {
        user: newUser.toJSON()
      }, 201);
      res.status(response.status).json(response.body);
    } catch (error) {
      // Passa o erro para o middleware de tratamento de erros
      next(error);
    }
  }
};

module.exports = AuthController;