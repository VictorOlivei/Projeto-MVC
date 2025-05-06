/**
 * Modelo de usuário para autenticação
 * Em um sistema real, isso seria conectado a um banco de dados
 * Para este MVP, usamos uma estrutura simples em memória
 */
class User {
  constructor(id, name, email, password, role = 'user') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password; // Em produção, esta senha seria armazenada com hash
    this.role = role;
    this.createdAt = new Date();
  }

  // Método para converter para JSON
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

// Mock de base de dados de usuários para o MVP
// Em um sistema real, isso viria de um banco de dados
const users = [
  new User(1, 'Administrador', 'admin@example.com', 'admin123', 'admin'),
  new User(2, 'Usuário Padrão', 'user@example.com', 'user123', 'user'),
];

// Métodos para interagir com os "dados"
const UserModel = {
  // Encontrar todos os usuários
  findAll: () => users,

  // Encontrar usuário por ID
  findById: (id) => users.find(user => user.id === parseInt(id)),

  // Encontrar usuário por email
  findByEmail: (email) => users.find(user => user.email === email),

  // Criar um novo usuário
  create: (userData) => {
    const id = users.length + 1;
    const newUser = new User(
      id,
      userData.name,
      userData.email,
      userData.password,
      userData.role || 'user'
    );
    users.push(newUser);
    return newUser;
  }
};

module.exports = UserModel;