# Estruturação da Arquitetura para Projetos Futuros

## Arquitetura MVC Escalável para APIs

### Introdução

Este documento descreve a arquitetura proposta para projetos futuros, seguindo o padrão MVC (Model-View-Controller) e implementando os requisitos não funcionais essenciais como autenticação, log estruturado, tratamento de exceções, configurações centralizadas e monitoramento básico.

A solução desenvolvida neste trabalho pode ser utilizada como base para novos projetos, garantindo que requisitos essenciais já estejam embutidos na arquitetura desde o início.

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

## Conclusão

A arquitetura MVC implementada neste projeto fornece uma base sólida para o desenvolvimento de novas aplicações, garantindo que requisitos não funcionais importantes já estejam incorporados desde o início. Ela é flexível o suficiente para ser adaptada a diferentes tipos de projetos, mantendo ao mesmo tempo uma estrutura consistente e segura.

A separação clara entre as camadas, o tratamento adequado de erros, o sistema de log estruturado, e os mecanismos de autenticação e autorização contribuem para um sistema robusto e de fácil manutenção.