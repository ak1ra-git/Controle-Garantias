# Sistema de Controle de Garantias — Backend

## Antes de rodar

1. Ajuste `appsettings.json`:
   - `ConnectionStrings:DefaultConnection` → coloque o nome do seu servidor LocalDB (confere no SSMS, algo tipo `(localdb)\MSSQLLocalDB` ou o nome que aparece na sua conexão).
   - `Jwt:Key` → troque pela sua chave secreta (qualquer string longa e aleatória).
2. Rode o `script-criacao-banco.sql` no SSMS pra criar o banco e as 3 tabelas (já vem com categorias pré-cadastradas).
3. Na pasta do projeto: `dotnet restore` depois `dotnet run`.
4. Abra `/swagger` no navegador pra testar.

## Estrutura (camadas)

```
Controller  → recebe a requisição HTTP
Service     → aplica regras de negócio (validação, cálculo, segurança)
Repository  → conversa com o banco via Dapper
Banco       → onde os dados ficam
```

- **Models/** — `Usuario`, `Produto`, `Categoria`: espelham as tabelas do banco, sem lógica.
- **DTOs/** — formato de entrada/saída da API. Separado do Model pra nunca vazar dado sensível (senha) nem deixar o front mandar campo que não devia (`CodUsuario`).
- **Interfaces/** — contratos de cada Repository/Service. O Controller depende só da interface, nunca da implementação concreta.
- **Repositories/** — SQL puro com Dapper, sempre com queries parametrizadas (`@Nome`, `@Id`) contra SQL Injection.
- **Services/** — regra de negócio: hash de senha (BCrypt), geração/validação de token (JWT), validação de datas, e a checagem de que um produto pertence ao usuário logado antes de editar/excluir.
- **Controllers/** — endpoints da API (`AuthController`, `ProdutoController`, `CategoriaController`).
- **Program.cs** — configuração: injeção de dependência, conexão Dapper, autenticação JWT, pipeline de middlewares.

## Fluxo de login

1. `POST /api/auth/login` com `{ nome, senha }`
2. `AuthService` busca o usuário, compara a senha com o hash salvo via `BCrypt.Verify`
3. Se válido, gera um token JWT (contendo o `Id` do usuário como claim) e devolve

## Fluxo de criar produto (autenticado)

1. Front manda o token no header `Authorization: Bearer <token>`
2. `[Authorize]` bloqueia quem não tem token válido
3. Controller lê o `usuario_id` **do token** (nunca do body — proteção contra fraude)
4. `ProdutoService` valida se `DataVencimento > DataCompra`
5. `ProdutoRepository` insere no banco e retorna o novo `Id`

## Segurança aplicada

- Senha nunca salva em texto puro (hash BCrypt)
- Autenticação via JWT com expiração configurável
- Queries sempre parametrizadas (sem concatenação de string = sem SQL Injection)
- Todo acesso a produto confere se `CodUsuario` do registro bate com o usuário do token (evita um usuário acessar/editar produto de outro)

## Rotas disponíveis

| Método | Rota | Autenticado? | Descrição |
|---|---|---|---|
| POST | /api/auth/registrar | Não | Cria novo usuário |
| POST | /api/auth/login | Não | Retorna o token JWT |
| GET | /api/categoria | Sim | Lista categorias |
| GET | /api/produto | Sim | Lista produtos do usuário logado |
| GET | /api/produto/{id} | Sim | Detalhe de um produto |
| POST | /api/produto | Sim | Cria um produto |
| PUT | /api/produto/{id} | Sim | Atualiza um produto |
| DELETE | /api/produto/{id} | Sim | Exclui um produto |

## Testando no Swagger

1. `POST /api/auth/registrar` → cria seu usuário
2. `POST /api/auth/login` → copia o `token` da resposta
3. Clica em **Authorize** (canto superior direito do Swagger) e cola `Bearer <token>`
4. Testa os endpoints de produto/categoria normalmente
