/**
 * Modelo de usuário para autenticação
 * Usando Sequelize para conexão com banco de dados
 */
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require("bcryptjs");

// Definição do modelo de usuário
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
    tableName: "users",
  }
);

// Método para converter para JSON (sem expor a senha)
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

// Método para verificar senha
User.prototype.checkPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Métodos para interagir com o banco de dados
const UserModel = {
  // Encontrar todos os usuários
  findAll: async () => await User.findAll(),

  // Encontrar usuário por ID
  findById: async (id) => await User.findByPk(id),

  // Encontrar usuário por email
  findByEmail: async (email) => await User.findOne({ where: { email } }),

  // Criar um novo usuário
  create: async (userData) => await User.create(userData),

  // Atualizar um usuário
  update: async (id, userData) => {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(userData);
  },

  // Excluir um usuário
  delete: async (id) => {
    const user = await User.findByPk(id);
    if (!user) return false;
    await user.destroy();
    return true;
  },

  // Inicializar usuários padrão (admin e user)
  initializeDefaultUsers: async () => {
    try {
      const adminExists = await User.findOne({
        where: { email: "admin@example.com" },
      });
      const userExists = await User.findOne({
        where: { email: "user@example.com" },
      });

      if (!adminExists) {
        await User.create({
          name: "Administrador",
          email: "admin@example.com",
          password: "admin123",
          role: "admin",
        });
        console.log("Usuário administrador criado com sucesso!");
      }

      if (!userExists) {
        await User.create({
          name: "Usuário Padrão",
          email: "user@example.com",
          password: "user123",
          role: "user",
        });
        console.log("Usuário padrão criado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao criar usuários padrão:", error);
    }
  },
};

module.exports = UserModel;
