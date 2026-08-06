# 📚 Biblioteca do Zero

API REST para gerenciamento de uma biblioteca, desenvolvida com **Node.js, Express e TypeScript**.

O projeto tem como objetivo aplicar conceitos de desenvolvimento backend, como criação de APIs, organização de código, separação de responsabilidades, tratamento de erros e boas práticas utilizando TypeScript.

---

## 🚀 Sobre o projeto

A **Biblioteca do Zero** é uma API para gerenciamento de uma biblioteca, permitindo controlar livros, autores, usuários e empréstimos.

O projeto foi desenvolvido com uma estrutura organizada, buscando aplicar conceitos utilizados em aplicações backend reais, como divisão de módulos, criação de rotas e organização das regras da aplicação.

---

## ✨ Funcionalidades

Atualmente a API possui:

✅ Cadastro e gerenciamento de livros
✅ Cadastro e gerenciamento de autores
✅ Cadastro e gerenciamento de usuários
✅ Controle de empréstimos
✅ Busca e listagem de informações
✅ Atualização de registros
✅ Remoção de registros
✅ Tratamento de erros da aplicação

---

## 🛠️ Tecnologias utilizadas

* **Node.js**
* **Express 5**
* **TypeScript**
* **TSX**
* **Git e GitHub**

---

## 📦 Principais dependências

* **Express** — criação da API REST e gerenciamento das rotas
* **TypeScript** — tipagem estática e maior segurança no desenvolvimento
* **TSX** — execução do TypeScript em ambiente de desenvolvimento

---

## 📂 Estrutura do projeto

```
biblioteca-do-zero
│
├── src
│   ├── autor
│   ├── database
│   ├── emprestimo
│   ├── errors
│   ├── livro
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

* **Routes:** definição dos endpoints da API
* **Módulos:** organização das funcionalidades da aplicação
* **Database:** gerenciamento dos dados utilizados pela aplicação
* **Errors:** tratamento de erros personalizados
* **Utils:** funções auxiliares reutilizáveis

Essa estrutura facilita a manutenção e evolução do projeto.

---

## ⚙️ Como executar o projeto

### Pré-requisitos

Antes de iniciar, tenha instalado:

* Node.js
* npm
* Git

---

### Clone o repositório

```bash
git clone https://github.com/FelipeHenrique20/biblioteca-do-zero.git
```

Entre na pasta:

```bash
cd biblioteca-do-zero
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

A API estará disponível em:

```
http://localhost:3000
```

---

## 📌 Endpoints da API

### 📚 Livros

| Método | Endpoint      | Descrição             |
| ------ | ------------- | --------------------- |
| GET    | `/livros`     | Lista todos os livros |
| GET    | `/livros/:id` | Busca um livro por ID |
| POST   | `/livros`     | Cadastra um livro     |
| PUT    | `/livros/:id` | Atualiza um livro     |
| DELETE | `/livros/:id` | Remove um livro       |

---

### 👤 Usuários

| Método | Endpoint    | Descrição        |
| ------ | ----------- | ---------------- |
| GET    | `/usuarios` | Lista usuários   |
| POST   | `/usuarios` | Cadastra usuário |

---

### ✍️ Autores

| Método | Endpoint   | Descrição      |
| ------ | ---------- | -------------- |
| GET    | `/autores` | Lista autores  |
| POST   | `/autores` | Cadastra autor |

---

### 🔄 Empréstimos

| Método | Endpoint       | Descrição         |
| ------ | -------------- | ----------------- |
| GET    | `/emprestimos` | Lista empréstimos |
| POST   | `/emprestimos` | Cria empréstimo   |

---

## 🧠 Conceitos aplicados

Durante o desenvolvimento foram praticados:

* Desenvolvimento de API REST
* TypeScript com tipagem estática
* Organização de projeto backend
* Criação de rotas HTTP
* Manipulação de requisições e respostas
* Separação de responsabilidades
* Tratamento de erros
* Versionamento com Git

---

## 🔮 Próximas melhorias

Algumas melhorias planejadas:

* [ ] Implementar banco de dados
* [ ] Criar autenticação de usuários
* [ ] Adicionar validação de dados
* [ ] Criar testes automatizados
* [ ] Documentar API com Swagger
* [ ] Realizar deploy da aplicação

---

## 👨‍💻 Autor

**Felipe Henrique**

GitHub:
https://github.com/FelipeHenrique20

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.