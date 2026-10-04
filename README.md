# FastAPI Auth System + CRUD

[![CI](https://github.com/MatheusLeo26/fastapi-auth-system/actions/workflows/ci.yml/badge.svg)](https://github.com/MatheusLeo26/fastapi-auth-system/actions/workflows/ci.yml)
![Python](https://img.shields.io/badge/python-3.11%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.118-009688)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
![Docker](https://img.shields.io/badge/docker-ready-2496ED)

API REST completa com **autenticação JWT**, **hash de senhas com bcrypt**, **rate limiting** e **CRUD**, acompanhada de um frontend em glassmorphism servido pela própria aplicação.

## Funcionalidades

| Recurso | Implementação |
|---|---|
| Autenticação | OAuth2 Password Flow + JWT (`PyJWT`) |
| Hash de senhas | `bcrypt` com salt aleatório |
| Rate limiting | `slowapi` — login 5/min, cadastro 3/min, global 100/min |
| Banco de dados | SQLAlchemy 2.0 (SQLite por padrão, compatível com PostgreSQL) |
| Validação | Pydantic v2 (email, tamanho de senha, formato de usuário) |
| Configuração | `pydantic-settings` via variáveis de ambiente / `.env` |
| Isolamento | Cada usuário só acessa os próprios itens (404 para itens de outros) |
| Testes | `pytest` + `pytest-cov`, **100% de cobertura**, CI no GitHub Actions |
| Docker | Imagem slim, usuário não-root, healthcheck, volume persistente |

## Rodando com Docker (recomendado)

```bash
git clone https://github.com/MatheusLeo26/fastapi-auth-system.git
cd fastapi-auth-system
docker compose up --build
```

Acesse:
- **App:** http://localhost:8000
- **Swagger:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

> Para produção, crie um `.env` a partir de `.env.example` e defina um `SECRET_KEY` forte.

## Rodando localmente (sem Docker)

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate   |   Linux/Mac: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Testes

```bash
pip install -r requirements-dev.txt
pytest
```

A suíte falha automaticamente se a cobertura cair abaixo de **95%** (configurado no `pyproject.toml`). Os testes usam um SQLite em memória isolado por teste.

```
tests/
├── conftest.py              # registra as fixtures via pytest_plugins
├── fixtures/                # fixtures reutilizáveis
│   ├── database.py          # engine/sessão em memória
│   ├── client.py            # TestClient + controle do rate limiter
│   ├── users.py             # user_factory, user, token, auth_headers...
│   ├── items.py             # item_factory, item, other_user_item
│   └── security.py          # bcrypt com custo baixo para acelerar testes
├── test_auth.py             # hash, JWT, autenticação, usuário atual
├── test_config_database.py  # settings, engine, sessão
├── test_schemas_models.py   # validações e modelos
├── test_users_api.py        # cadastro, login, /me
├── test_items_api.py        # CRUD + isolamento entre usuários
├── test_rate_limit.py       # 429 no login e no cadastro
└── test_main.py             # health, frontend, docs, CORS
```

## Endpoints

### Usuários
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/users/register` | — | Cadastra usuário (rate limit 3/min) |
| POST | `/users/login` | — | Retorna JWT (form OAuth2, rate limit 5/min) |
| GET | `/users/me` | ✅ | Dados do usuário logado |
| DELETE | `/users/me` | ✅ | Exclui a conta e seus itens |

### Itens
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/items/` | ✅ | Cria item |
| GET | `/items/?skip=0&limit=100` | ✅ | Lista itens do usuário (paginado) |
| GET | `/items/{id}` | ✅ | Busca item |
| PUT | `/items/{id}` | ✅ | Atualiza item (parcial) |
| DELETE | `/items/{id}` | ✅ | Remove item |

### Exemplo com `curl`
```bash
curl -X POST localhost:8000/users/register -H "Content-Type: application/json" \
  -d '{"username":"matheus","email":"m@example.com","password":"SuperSecret123"}'

TOKEN=$(curl -s -X POST localhost:8000/users/login \
  -d "username=matheus&password=SuperSecret123" | python -c "import sys,json;print(json.load(sys.stdin)['access_token'])")

curl -X POST localhost:8000/items/ -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"title":"Meu primeiro item"}'
```

## Configuração

Todas as opções podem ser definidas por variável de ambiente (veja [`.env.example`](.env.example)):

| Variável | Padrão |
|---|---|
| `SECRET_KEY` | valor de desenvolvimento — **troque em produção** |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` |
| `DATABASE_URL` | `sqlite:///./data/sql_app.db` |
| `RATE_LIMIT_ENABLED` | `true` |
| `RATE_LIMIT_LOGIN` / `RATE_LIMIT_REGISTER` / `RATE_LIMIT_DEFAULT` | `5/minute` / `3/minute` / `100/minute` |

Para usar PostgreSQL, instale `psycopg[binary]` e defina `DATABASE_URL=postgresql+psycopg://user:pass@host:5432/db`.

## Estrutura

```
app/
├── main.py        # app FastAPI, middlewares, frontend
├── config.py      # Settings (pydantic-settings)
├── database.py    # engine e sessão SQLAlchemy
├── models.py      # User, Item
├── schemas.py     # schemas Pydantic
├── auth.py        # bcrypt, JWT, dependência get_current_user
├── limiter.py     # instância do slowapi
└── routers/
    ├── users.py
    └── items.py
frontend/          # HTML + CSS + JS puro
```

## Licença

MIT
