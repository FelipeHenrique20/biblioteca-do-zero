# 📚 Biblioteca do Zero

> 🔗 Front-end deste projeto: [biblioteca-front](https://github.com/FelipeHenrique20/biblioteca-front)

API REST para gerenciamento de uma biblioteca, desenvolvida com **Node.js, Express e TypeScript**.

O projeto tem como objetivo aplicar conceitos de desenvolvimento backend, como criação de APIs, organização de código, separação de responsabilidades, autenticação, autorização e boas práticas utilizando TypeScript.

---

## 🚀 Sobre o projeto

A **Biblioteca do Zero** é uma API para gerenciamento de uma biblioteca, permitindo controlar livros, autores, usuários e empréstimos, com um sistema de contas e permissões para proteger operações sensíveis.

---

## ✨ Funcionalidades

✅ Cadastro e gerenciamento de livros, autores e usuários (leitores)
✅ Controle de empréstimos, com checagem de disponibilidade de exemplares
✅ Autenticação de contas com e-mail e senha (hash com bcrypt)
✅ Autorização baseada em papéis (`admin` / `comum`) via JWT
✅ Gestão de contas: listar, promover e rebaixar administradores
✅ Rotas de leitura públicas; rotas de escrita protegidas e restritas a administradores
✅ Tratamento de erros centralizado, com códigos HTTP apropriados
✅ Proteção de integridade referencial entre todas as entidades

---

## 🛠️ Tecnologias utilizadas

* **Node.js**
* **Express 5**
* **TypeScript**
* **node:sqlite** (módulo nativo de banco de dados do Node.js)
* **bcrypt** — hash de senhas
* **jsonwebtoken** — autenticação via JWT
* **TSX**
* **Git e GitHub**

---

## 📦 Principais dependências

* **Express** — criação da API REST e gerenciamento das rotas
* **TypeScript** — tipagem estática e maior segurança no desenvolvimento
* **bcrypt** — geração e verificação de hash de senhas
* **jsonwebtoken** — geração e verificação de tokens de autenticação
* **TSX** — execução do TypeScript em ambiente de desenvolvimento

---

## 📂 Estrutura do projeto

```
biblioteca-do-zero
│
├── src
│   ├── autor
│   ├── conta
│   ├── database
│   ├── emprestimo
│   ├── errors
│   ├── livro
│   ├── middlewares
│   ├── routes
│   ├── usuario
│   ├── utils
│   ├── app.ts
│   └── server.ts
│
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```


---

## 🏗️ Arquitetura do projeto

O projeto segue uma organização baseada na separação de responsabilidades:

* **Módulos:** cada entidade (autor, livro, usuario, emprestimo, conta) tem sua própria pasta com `Service`, `Controller` e `Routes`
* **Middlewares:** autenticação (`autenticar`) e autorização (`apenasAdmin`) reutilizáveis em qualquer rota
* **Database:** conexão e criação das tabelas do SQLite
* **Errors:** classe de erro customizada (`AppError`), carregando o status HTTP correto
* **Utils:** tratamento de erro centralizado

Fluxo de uma requisição protegida: **rota → middleware de autenticação → middleware de autorização → controller → service → banco de dados**.

---

## 🔐 Autenticação e Autorização

O sistema possui uma tabela `contas`, separada da tabela `usuarios` (que representa os leitores da biblioteca). Contas são usadas por quem opera o sistema (administradores e funcionários).

* Toda conta nasce com o papel `comum`
* Apenas administradores podem promover ou rebaixar outras contas
* Rotas de leitura (`GET`) são públicas
* Rotas de escrita (`POST`, `PUT`, `PATCH`, `DELETE`) exigem um token JWT válido e o papel `admin`
* O token é enviado pelo cliente no cabeçalho `Authorization: Bearer <token>` e expira em 8 horas

---

## ⚙️ Como executar o projeto

### Pré-requisitos

* Node.js (versão 22 ou superior, por causa do `node:sqlite`)
* npm
* Git

---

### Clone o repositório

```bash
git clone https://github.com/FelipeHenrique20/biblioteca-do-zero.git
cd biblioteca-do-zero
npm install
```

### Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

DATABASE_URL=dev.db
JWT_SECRET=uma-frase-bem-longa-e-dificil-de-adivinhar-aqui
PORT=3000


### Execute o projeto

```bash
npm run dev
```

A API estará disponível em:

```
http://localhost:3000
```


---

## 📌 Endpoints da API

### 🔐 Contas

| Método | Endpoint                 | Descrição                            | Acesso        |
| ------ | ------------------------ | ------------------------------------- | -------------- |
| POST   | `/contas/registro`       | Cria uma nova conta (papel `comum`)   | Público        |
| POST   | `/contas/login`          | Autentica e retorna um token JWT      | Público        |
| GET    | `/contas`                | Lista todas as contas                 | Admin          |
| PATCH  | `/contas/:id/promover`   | Promove uma conta a `admin`           | Admin          |
| PATCH  | `/contas/:id/rebaixar`   | Rebaixa uma conta a `comum`           | Admin          |

### 📚 Livros

| Método | Endpoint      | Descrição             | Acesso  |
| ------ | ------------- | ---------------------- | ------- |
| GET    | `/livros`     | Lista todos os livros  | Público |
| GET    | `/livros/:id` | Busca um livro por ID  | Público |
| POST   | `/livros`     | Cadastra um livro      | Admin   |
| PUT    | `/livros/:id` | Atualiza um livro      | Admin   |
| DELETE | `/livros/:id` | Remove um livro        | Admin   |

### ✍️ Autores

| Método | Endpoint       | Descrição       | Acesso  |
| ------ | -------------- | ---------------- | ------- |
| GET    | `/autores`     | Lista autores     | Público |
| GET    | `/autores/:id` | Busca por ID      | Público |
| POST   | `/autores`     | Cadastra autor     | Admin   |
| PUT    | `/autores/:id` | Atualiza autor     | Admin   |
| DELETE | `/autores/:id` | Remove autor       | Admin   |

### 👤 Usuários (leitores)

| Método | Endpoint        | Descrição          | Acesso  |
| ------ | --------------- | -------------------- | ------- |
| GET    | `/usuarios`     | Lista usuários        | Público |
| GET    | `/usuarios/:id` | Busca por ID          | Público |
| POST   | `/usuarios`     | Cadastra usuário       | Admin   |
| PUT    | `/usuarios/:id` | Atualiza usuário       | Admin   |
| DELETE | `/usuarios/:id` | Remove usuário         | Admin   |

### 🔄 Empréstimos

| Método | Endpoint                     | Descrição                              | Acesso  |
| ------ | ----------------------------- | ---------------------------------------- | ------- |
| GET    | `/emprestimos`                | Lista todos os empréstimos                | Público |
| GET    | `/emprestimos/ativos`         | Lista empréstimos não devolvidos          | Público |
| GET    | `/emprestimos/:id`            | Busca um empréstimo por ID                | Público |
| POST   | `/emprestimos`                | Cria empréstimo (checa disponibilidade)   | Admin   |
| PATCH  | `/emprestimos/:id/devolver`   | Marca um empréstimo como devolvido        | Admin   |

---

## 🧠 Conceitos aplicados

* Desenvolvimento de API REST
* TypeScript com tipagem estática
* Organização de projeto backend em camadas
* Autenticação com JWT e hash de senhas com bcrypt
* Autorização baseada em papéis (RBAC)
* Middlewares customizados no Express
* Manipulação de requisições e respostas
* Tratamento de erros centralizado
* Integridade referencial entre entidades
* Versionamento com Git

---

## 🔮 Próximas melhorias

* [ ] Portal do leitor (catálogo de busca e pedido de empréstimo)
* [ ] Testes automatizados
* [ ] Documentar API com Swagger
* [ ] Deploy da aplicação

---

## 👨‍💻 Autor

**Felipe Henrique**

GitHub: https://github.com/FelipeHenrique20

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.