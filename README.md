# Estruturação da Arquitetura para Projetos Futuros

## Arquitetura MVC Escalável para APIs

### Introdução

Este documento descreve a arquitetura proposta para projetos futuros, seguindo o padrão MVC (Model-View-Controller) e implementando os requisitos não funcionais essenciais como autenticação, log estruturado, tratamento de exceções, configurações centralizadas e monitoramento básico.

A solução desenvolvida neste trabalho pode ser utilizada como base para novos projetos, garantindo que requisitos essenciais já estejam embutidos na arquitetura desde o início.

### Índice

1. [Visão Geral da Arquitetura](#diagrama-da-arquitetura)
2. [Estrutura de Diretórios](#estrutura-de-diretórios)
3. [Explicação das Decisões Técnicas](#explicação-das-decisões-técnicas)
4. [API e Endpoints](#api-e-endpoints)
5. [Guia de Instalação e Execução](#guia-de-instalação-e-execução)
6. [Front-end React](#front-end-react)
7. [Garantia de Escalabilidade e Segurança](#garantia-de-escalabilidade-e-segurança)
8. [Documentação da API com Swagger](#documentação-da-api-com-swagger)
9. [Monitoramento e Logs](#monitoramento-e-logs)
10. [Práticas de Desenvolvimento Recomendadas](#práticas-de-desenvolvimento-recomendadas)
11. [Conclusão](#conclusão)

### Diagrama da Arquitetura

```
+-----------------------------------------------+
|                  API Client                   |
+------------------------+----------------------+
                         |
                         v
+-----------------------------------------------+
|          Express Application Server           |
+-----------------------------------------------+
| Middlewares:                                  |
| - Helmet (Segurança)                          |
| - CORS                                        |
| - Authentication/Authorization                |
| - Error Handler                               |
| - Logger                                      |
+-----------------------------------------------+
                         |
       +----------------+-----------------+
       |                |                 |
       v                v                 v
+-------------+  +-------------+  +-------------+
| Controllers |  | Models      |  | Views       |
+-------------+  +-------------+  +-------------+
| - Auth      |  | - User      |  | - API View  |
| - Log       |  | - ...       |  | - ...       |
| - Health    |  |             |  |             |
+------+------+  +------+------+  +------+------+
       |                |                 |
       +----------------+-----------------+
                         |
                         v
+-----------------------------------------------+
| Configurações e Utilidades                    |
+-----------------------------------------------+
| - Logger                                      |
| - Env Config                                  |
| - ...                                         |
+-----------------------------------------------+
```

### Estrutura de Diretórios

```
src/
  ├── app.js                    # Ponto de entrada da aplicação
  ├── config/                   # Configurações centralizadas
  │    └── index.js             # Configuração principal
  ├── controllers/              # Camada de controladores (C)
  │    ├── auth.controller.js   # Autenticação
  │    ├── health.controller.js # Verificação de saúde
  │    └── log.controller.js    # Acesso aos logs
  ├── docs/                     # Documentação da API
  │    └── swagger.js           # Configuração do Swagger
  ├── logs/                     # Armazenamento de logs
  ├── middlewares/              # Middlewares
  │    ├── auth.middleware.js   # Autenticação e autorização
  │    └── error.middleware.js  # Tratamento central de erros
  ├── models/                   # Camada de modelos (M)
  │    └── user.model.js        # Modelo de usuário
  ├── routes/                   # Rotas da API
  │    ├── auth.routes.js       # Rotas de autenticação
  │    ├── health.routes.js     # Rotas de verificação de saúde
  │    └── log.routes.js        # Rotas de acesso a logs
  ├── utils/                    # Utilitários
  │    └── logger.js            # Logger estruturado
  └── views/                    # Camada de visualização (V)
       └── api.view.js          # Formatação de respostas
```

## Explicação das Decisões Técnicas

### 1. Padrão MVC

O padrão MVC foi escolhido para separar claramente as responsabilidades do código:

- **Model**: Representa os dados e regras de negócio da aplicação. Implementado na pasta `models/`.
- **View**: Responsável pela formatação e apresentação dos dados. Implementado na pasta `views/`.
- **Controller**: Gerencia as requisições do usuário, manipula os modelos e seleciona as visualizações apropriadas. Implementado na pasta `controllers/`.

Esta separação de responsabilidades facilita a manutenção, o teste e a expansão do código, além de permitir que diferentes equipes trabalhem em diferentes partes da aplicação simultaneamente.

### 2. Autenticação e Autorização

Foi implementado um sistema de autenticação baseado em JWT (JSON Web Tokens) por várias razões:

- **Sem estado**: JWTs não exigem armazenamento no servidor, o que facilita a escalabilidade.
- **Auto-contido**: O token carrega todas as informações necessárias para verificar a identidade do usuário.
- **Amplamente suportado**: JWTs são um padrão da indústria com bibliotecas disponíveis em diversas linguagens.
- **Segurança**: Oferece assinatura digital para garantir a integridade dos dados.

O middleware de autorização implementa controle por papéis (roles), permitindo restringir o acesso a determinados recursos com base nas permissões do usuário.

### 3. Log Estruturado

O sistema de log utiliza o Winston, uma biblioteca robusta e flexível, por oferecer:

- **Formato JSON**: Logs em formato estruturado para fácil processamento e análise.
- **Níveis de log**: Diferentes níveis para diferentes tipos de eventos (error, warn, info, etc.).
- **Múltiplos transportes**: Capacidade de enviar logs para diferentes destinos simultaneamente.
- **Timestamping automático**: Adição de carimbos de data/hora para todos os eventos.

Os logs são armazenados em arquivos separados por tipo, facilitando a análise e o diagnóstico de problemas.

### 4. Tratamento de Exceções

Foi implementado um middleware centralizado para tratamento de erros que:

- **Captura todos os erros**: Intercepta exceções não tratadas em qualquer parte da aplicação.
- **Padroniza respostas**: Formata as respostas de erro de maneira consistente.
- **Log automático**: Registra detalhes dos erros para facilitar o diagnóstico.
- **Mensagens amigáveis**: Oculta detalhes técnicos dos usuários finais em ambiente de produção.

### 5. Configuração Centralizada

A configuração da aplicação é gerenciada através do módulo `dotenv` e um arquivo de configuração central que:

- **Protege informações sensíveis**: Mantém senhas, chaves de API e outras informações sensíveis fora do código-fonte.
- **Facilita mudanças**: Permite alterar configurações sem modificar o código.
- **Suporta múltiplos ambientes**: Facilita a configuração para desenvolvimento, teste e produção.

### 6. Monitoramento Básico

O endpoint `/health` fornece informações sobre o estado da aplicação, incluindo:

- **Métricas do sistema**: CPU, memória e carga do sistema.
- **Métricas do processo**: Uso de memória e CPU pelo processo Node.js.
- **Tempo de atividade**: Quanto tempo a aplicação está rodando.

Estas métricas são essenciais para monitorar a saúde da aplicação e identificar possíveis problemas.

## API e Endpoints

A API implementada nesta arquitetura segue os princípios RESTful e oferece os seguintes endpoints principais:

### Autenticação

| Método | Endpoint         | Descrição                | Autenticação |
| ------ | ---------------- | ------------------------ | ------------ |
| POST   | `/auth/login`    | Autenticação de usuário  | Não          |
| POST   | `/auth/register` | Registro de novo usuário | Não          |

#### Exemplo de Requisição - Login

```json
POST /auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

#### Exemplo de Resposta - Login

```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Administrador",
      "email": "admin@example.com",
      "role": "admin",
      "createdAt": "2025-05-07T12:00:00.000Z"
    }
  }
}
```

### Monitoramento

| Método | Endpoint  | Descrição                  | Autenticação |
| ------ | --------- | -------------------------- | ------------ |
| GET    | `/health` | Verificar saúde do sistema | Não          |

#### Exemplo de Resposta - Health Check

```json
{
  "success": true,
  "message": "Serviço funcionando normalmente",
  "data": {
    "status": "OK",
    "timestamp": "2025-05-07T15:30:00.000Z",
    "serverStartTime": "2025-05-07T12:00:00.000Z",
    "metrics": {
      "process": {
        "uptime": 12600,
        "memoryUsage": {
          "rss": 45056000,
          "heapTotal": 23195648,
          "heapUsed": 18093000
        },
        "cpuUsage": {
          "user": 256000,
          "system": 32000
        }
      },
      "system": {
        "totalMemory": 8589934592,
        "freeMemory": 4294967296,
        "cpus": 8,
        "loadAvg": [1.2, 1.5, 1.7]
      }
    }
  }
}
```

### Logs

| Método | Endpoint | Descrição             | Autenticação | Autorização |
| ------ | -------- | --------------------- | ------------ | ----------- |
| GET    | `/logs`  | Obter logs do sistema | Sim          | Role: admin |

#### Parâmetros de Consulta

- `type` - Tipo de log (combined, error, access). Padrão: combined
- `limit` - Número máximo de entradas (1-1000). Padrão: 100

#### Exemplo de Requisição

```
GET /logs?type=error&limit=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Exemplo de Resposta

```json
{
  "success": true,
  "message": "Logs obtidos com sucesso",
  "data": {
    "logType": "error",
    "count": 10,
    "logs": [
      {
        "level": "error",
        "message": "POST /auth/login - 401 - Credenciais inválidas",
        "timestamp": "2025-05-07T15:25:00.000Z",
        "ip": "192.168.1.100"
      }
      // ... outras entradas de log
    ]
  }
}
```

## Guia de Instalação e Execução

### Pré-requisitos

- Node.js (v14.x ou superior)
- npm (v6.x ou superior)

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/arquitetura-mvc.git
cd arquitetura-mvc
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` baseado no `.env.example` (se disponível):

```bash
cp .env.example .env
```

4. Configure as variáveis de ambiente no arquivo `.env`:

```
PORT=3000
NODE_ENV=development
JWT_SECRET=seu-segredo-jwt
JWT_EXPIRES_IN=1h
LOG_LEVEL=info
```

### Execução

- Para ambiente de desenvolvimento:

```bash
npm run dev
```

- Para ambiente de produção:

```bash
npm start
```

### Teste da API

Após iniciar o servidor, você pode:

1. Acessar a interface de teste HTML em `http://localhost:3000/test.html`
2. Usar ferramentas como Postman ou Insomnia para testar os endpoints
3. Consultar a documentação Swagger em `http://localhost:3000/api-docs`

## Front-end React

Uma interface de usuário moderna foi desenvolvida utilizando React para interagir com a API. O front-end oferece uma experiência amigável e responsiva para testar todas as funcionalidades da API.

### Estrutura do Projeto React

O projeto React está organizado da seguinte forma:

```
frontend/
├── public/                # Arquivos estáticos
├── src/                   # Código-fonte
│   ├── components/        # Componentes reutilizáveis
│   │   ├── Button/        # Componente de botão
│   │   ├── Card/          # Componente de card
│   │   ├── Header/        # Componente de cabeçalho
│   │   ├── Input/         # Componente de input
│   │   └── Layout/        # Componente de layout
│   ├── contexts/          # Contextos React
│   │   └── AuthContext.js # Contexto de autenticação
│   ├── pages/             # Páginas da aplicação
│   │   ├── Home/          # Página inicial
│   │   ├── Login/         # Página de login
│   │   ├── Register/      # Página de cadastro
│   │   ├── Health/        # Página de health check
│   │   └── Logs/          # Página de logs
│   ├── services/          # Serviços
│   │   └── api.js         # Configuração do Axios
│   ├── App.js             # Componente principal
│   └── index.js           # Ponto de entrada
└── package.json           # Dependências
```

### Instalação e Execução do Front-end

#### Pré-requisitos

- Node.js (v14.x ou superior)
- npm (v6.x ou superior)
- Back-end da API em execução

#### Instalação

1. Navegue até o diretório do front-end:

```bash
cd frontend
```

2. Instale as dependências:

```bash
npm install
```

#### Execução

1. Certifique-se de que o back-end está rodando:

```bash
# No diretório raiz do projeto
npm run dev
```

2. Em outro terminal, inicie o front-end React:

```bash
cd frontend
npm start
```

Como o back-end já está usando a porta 3000, o React provavelmente perguntará se você deseja usar outra porta (como a 3001). Responda "Y" (sim).

3. Acesse o front-end no navegador:

```
http://localhost:3001
```

### Funcionalidades do Front-end

- **Login**: Use as credenciais padrão (admin@example.com / admin123)
- **Cadastro**: Registre novos usuários no sistema
- **Health Check**: Verifique o status do sistema, incluindo métricas de desempenho
- **Logs**: Acesse e filtre os logs do sistema (apenas como administrador)

### Tecnologias Utilizadas

- **React**: Biblioteca para construção de interfaces
- **React Router**: Navegação entre páginas
- **Axios**: Cliente HTTP para comunicação com a API
- **Styled Components**: Estilização de componentes
- **Context API**: Gerenciamento de estado global

## Garantia de Escalabilidade e Segurança

### Escalabilidade

A arquitetura foi projetada para ser escalável através de:

1. **Desacoplamento de componentes**: A separação clara das responsabilidades permite que componentes sejam escalados independentemente.

2. **Sem estado (Stateless)**: A autenticação baseada em JWT não requer armazenamento de sessão no servidor, permitindo que a aplicação seja facilmente distribuída.

3. **Centralização de configuração**: Facilita a configuração em ambientes distribuídos.

4. **Modularidade**: Permite adicionar ou remover funcionalidades sem afetar o sistema como um todo.

### Segurança

Vários aspectos de segurança foram implementados:

1. **Helmet**: Middleware que configura vários cabeçalhos HTTP relacionados à segurança.

2. **Autenticação segura**: Uso de JWT com expiração e tokens assinados.

3. **Autorização por papéis**: Controle de acesso granular baseado em papéis de usuário.

4. **Sanitização de entrada**: Validação de dados de entrada para prevenir injeções e outros ataques.

5. **Centralização do tratamento de erros**: Evita vazamento de informações sensíveis através de mensagens de erro.

6. **Variáveis de ambiente**: Isolamento de informações sensíveis do código-fonte.

## Documentação da API com Swagger

A documentação completa da API está disponível através da interface do Swagger, que fornece uma UI interativa para explorar e testar os endpoints.

### Acessando a Documentação

Após iniciar o servidor, acesse:

```
http://localhost:3000/api-docs
```

### Recursos disponíveis na documentação

- Descrição detalhada de todos os endpoints
- Modelos de requisição e resposta
- Possibilidade de testar a API diretamente na interface
- Informações sobre autenticação e autorização
- Detalhes sobre parâmetros e códigos de status

### Autenticação no Swagger

Para testar endpoints protegidos através do Swagger UI:

1. Execute primeiro uma requisição POST para `/auth/login`
2. Copie o token JWT da resposta
3. Clique no botão "Authorize" na parte superior do Swagger UI
4. Digite o token no formato `Bearer seu-token-jwt`
5. Agora você pode acessar os endpoints protegidos

## Monitoramento e Logs

### Estrutura de Logs

O sistema gera três tipos de arquivos de log:

1. **combined.log**: Todos os logs do sistema
2. **error.log**: Apenas logs de erro
3. **access.log**: Logs de acesso à API (gerados pelo Morgan)

### Níveis de Log

O Winston está configurado para os seguintes níveis (em ordem de prioridade):

1. **error**: Situações de erro que exigem atenção imediata
2. **warn**: Avisos sobre situações potencialmente problemáticas
3. **info**: Informações gerais sobre o funcionamento do sistema
4. **debug**: Informações detalhadas úteis para depuração

### Monitoramento em Tempo Real

O endpoint `/health` fornece informações em tempo real sobre:

- **Carga do sistema**: CPU, memória, etc.
- **Estado da aplicação**: Tempo de atividade, uso de memória
- **Disponibilidade de recursos**: Espaço em disco, conexões de rede, etc.

## Práticas de Desenvolvimento Recomendadas

Ao estender ou modificar esta arquitetura, recomenda-se seguir estas práticas:

1. **Manter a separação das camadas**: Respeitar o padrão MVC para manter o código organizado.

2. **Documentar novas APIs**: Atualizar a documentação Swagger ao adicionar novos endpoints.

3. **Registrar logs adequados**: Utilizar os níveis de log apropriados para cada situação.

4. **Tratamento de erros consistente**: Utilizar o middleware de erro para todas as exceções.

5. **Validação de entrada**: Sempre validar e sanitizar dados de entrada.

6. **Testes automatizados**: Implementar testes para novas funcionalidades.

7. **Segurança primeiro**: Considerar as implicações de segurança de cada nova funcionalidade.

## Conclusão

A arquitetura MVC implementada neste projeto fornece uma base sólida para o desenvolvimento de novas aplicações, garantindo que requisitos não funcionais importantes já estejam incorporados desde o início. Ela é flexível o suficiente para ser adaptada a diferentes tipos de projetos, mantendo ao mesmo tempo uma estrutura consistente e segura.

A separação clara entre as camadas, o tratamento adequado de erros, o sistema de log estruturado, os mecanismos de autenticação e autorização, e a documentação completa com Swagger contribuem para um sistema robusto, bem documentado e de fácil manutenção.

Esta arquitetura representa não apenas uma solução técnica, mas um conjunto de boas práticas de desenvolvimento que podem ser aplicadas em diversos contextos de projetos de software.
