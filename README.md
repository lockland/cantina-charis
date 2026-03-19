# cantina-charis

Ref: https://www.youtube.com/watch?v=QevhhM_QfbM&ab_channel=TomDoesTech

## Autenticação (Basic Auth + cookie)

O servidor usa Basic Auth com dois usuários fixos: `admin` e `viewer`. A senha de cada um é definida por variáveis de ambiente. O viewer só pode acessar a tela de pedidos (`/orders`) e as APIs necessárias (GET events, GET events/:id/orders, etc.). O login é o diálogo nativo do navegador; credenciais não são enviadas na URL (sessão via cookie).

Variáveis de ambiente:

- **ADMIN_PASSWORD** – senha do usuário `admin`
- **VIEWER_PASSWORD** – senha do usuário `viewer`
- **SESSION_SECRET** (opcional) – segredo para assinar o cookie de sessão; se não definido, usa um valor padrão de desenvolvimento

## Cliente (front-end)

Use **Yarn** para dependências e scripts do diretório `client`. Não use `npm install` no client (evita `package-lock.json` em paralelo ao `yarn.lock`).

```bash
cd client
yarn install    # instalar dependências
yarn dev        # Vite em desenvolvimento
yarn build      # build de produção (também usado pelo Makefile)
```

O `Makefile` na raiz já chama `yarn build` dentro de `client`.