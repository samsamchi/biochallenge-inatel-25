# Sistema de Gestão de Medicamentos

Projeto frontend construído com Next.js (app router) que fornece uma interface para gerenciar usuários e medicamentos.

![Exemplo de tela](public/medico.png)

## Visão geral

Este repositório contém a aplicação frontend (Next.js + React) e a camada de persistência configurada com Prisma usando SQLite como banco local para desenvolvimento.

O foco deste README é explicar rapidamente a estrutura do front-end e como o adapter de banco (Prisma) está configurado para rodar localmente.

## Tecnologias principais

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS (estilos utilitários)
- Prisma (ORM)
- SQLite (base de dados local para desenvolvimento)

## Estrutura do front-end

- `src/app/` — rotas e páginas da aplicação (App Router).
- `src/components/` — componentes reusáveis (forms, listas, wrappers de sessão).
- `src/app/api/` — endpoints API route handlers (server-side) que usam Prisma para acessar o banco.

As páginas usam componentes controlados por `react-hook-form` para validar e enviar dados ao backend.

## Banco de dados e adapter (Prisma + SQLite)

O projeto usa Prisma como ORM e um arquivo SQLite (`prisma/dev.db`) para persistência durante o desenvolvimento. O adaptador é simples e local, ideal para testes e prototipagem.

Principais arquivos relacionados:
- `prisma/schema.prisma` — esquema do banco (modelos `User` e `Medicine`).
- `prisma/dev.db` — arquivo do banco SQLite (gerado após rodar as migrações).

Fluxo recomendado para preparar o banco local:

1. Defina a variável de ambiente `DATABASE_URL` no arquivo `.env` na raiz do projeto:

```text
DATABASE_URL="file:./prisma/dev.db"
```

2. Gere o cliente Prisma (após alterar o schema ou ao clonar o repositório):

```bash
npx prisma generate
```

3. Rode as migrações (desenvolvimento):

```bash
npx prisma migrate dev --name init
```

Após isso o arquivo `prisma/dev.db` será criado/atualizado e o Prisma Client ficará disponível em `node_modules/@prisma/client`.

## Como executar localmente

1. Clone o repositório e entre na pasta do projeto.

```bash
git clone <repo-url>
cd bioic
```

2. Instale as dependências:

```bash
npm install
```

3. Configure a variável de ambiente (`.env`) conforme explicado acima.

4. Gere o Prisma Client e aplique migrações (se necessário):

```bash
npx prisma generate
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra `http://localhost:3000` no navegador para acessar a aplicação.

## Notas rápidas

- Em produção você deve trocar o `DATABASE_URL` para um banco gerenciado (Postgres, MySQL, etc.) e executar as migrações no ambiente adequado.
- O esquema Prisma está em `prisma/schema.prisma`. Se fizer alterações no schema, rode `npx prisma migrate dev` e `npx prisma generate`.

---

Se quiser que eu acrescente instruções específicas (como seeds, testes ou deploy), me diga qual fluxo prefere e eu adiciono ao README.
