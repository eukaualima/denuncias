# Sistema de Gestão de Denúncias (API)

Backend desenvolvido como requisito avaliativo para a disciplina de Laboratório de Programação II. Esta API REST permite o cadastro de usuários (registrantes), gestão de categorias e o ciclo de vida completo de denúncias/ocorrências institucionais (infraestrutura, eventos, etc.), incluindo histórico de atualizações.

## 🚀 Tecnologias Utilizadas

* **Node.js** (Ambiente de execução)
* **TypeScript** (Linguagem com tipagem estática)
* **Express** (Framework Web)
* **TypeORM** (ORM para persistência de dados)
* **SQLite** (Banco de dados relacional)

## 🛠️ Como Executar o Projeto

### Pré-requisitos

* Node.js instalado (v16 ou superior)
* Gerenciador de pacotes (npm ou yarn)

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone https://github.com/eukaualima/denuncias.git
cd denuncias

```


2. **Instale as dependências:**
```bash
npm install

```


3. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev

```


4. **Acesse a API:**
O servidor iniciará em `http://localhost:3000`.

---

## 📚 Documentação da API (Endpoints)

A API segue os padrões REST, retornando respostas em JSON.

### 📂 Categorias (`/categories`)

Gerenciamento dos temas das denúncias (Ex: Infraestrutura, Limpeza, Segurança).

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/categories` | Lista todas as categorias |
| `GET` | `/categories/:id` | Busca uma categoria pelo ID |
| `POST` | `/categories` | Cria uma nova categoria |
| `PUT` | `/categories/:id` | Atualiza uma categoria |
| `DELETE` | `/categories/:id` | Remove uma categoria |

### 📢 Denúncias (`/reports`)

Ciclo de vida das ocorrências.

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/reports` | Lista denúncias (suporta filtros e paginação) |
| `GET` | `/reports/:id` | Detalhes de uma denúncia específica |
| `POST` | `/reports` | Registra uma nova denúncia |
| `PATCH` | `/reports/:id/status` | Atualiza apenas o status da denúncia |
| `POST` | `/reports/:id/updates` | Adiciona um novo registro ao histórico |

---

## 🧪 Exemplos de Requisições (Para Testes)

Utilize os JSONs abaixo no **Insomnia**, **Postman** ou **VS Code Thunder Client**.

### 1. Criar Categoria (Obrigatório primeiro)

**POST** `http://localhost:3000/categories`

```json
{
  "nome": "Infraestrutura",
  "descricao": "Problemas relacionados a prédios, salas e equipamentos."
}

```

### 2. Criar Denúncia

**POST** `http://localhost:3000/reports`
*Nota: `categoriaId` deve ser um ID existente. `registrante` é opcional.*

```json
{
  "titulo": "Ar condicionado quebrado",
  "descricao": "O aparelho do laboratório 3 está fazendo muito barulho e não gela.",
  "local": "Laboratório 3",
  "prioridade": "alta",
  "status": "aberta",
  "categoriaId": 1,
  "registrante": "Aluno João Silva"
}

```

### 3. Listar Denúncias com Filtros

**GET** `http://localhost:3000/reports?status=aberta&prioridade=alta&page=1`
*Filtra apenas denúncias abertas de prioridade alta.*

### 4. Atualizar Status da Denúncia

**PATCH** `http://localhost:3000/reports/1/status`
*Status possíveis: aberta, progresso, resolvida, fechada, cancelada.*

```json
{
  "status": "progresso"
}

```

### 5. Adicionar Histórico (Andamento)

**POST** `http://localhost:3000/reports/1/updates`

```json
{
  "comentario": "Equipe de manutenção já foi notificada e visitará o local hoje a tarde.",
  "responsavel": "Coordenação Predial"
}

```

### 6. Consultar Denúncia com Histórico

**GET** `http://localhost:3000/reports/1`
*O retorno incluirá a categoria e a lista de históricos associados.*

---

## 🗂 Estrutura do Banco de Dados

* **Categoria**: `id`, `nome`, `descricao`.
* **Denuncia**: `id`, `titulo`, `descricao`, `local`, `prioridade`, `status`, `registrante`, `categoria_id`.
* **Historico**: `id`, `comentario`, `responsavel`, `data`, `denuncia_id`.
