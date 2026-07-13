# Autenticação própria com JWT

Padrão sem BaaS: registro, login, middleware de proteção, refresh token.

## Dependências

```
npm install bcrypt jsonwebtoken zod
```

## Registro

- Validar input com `zod` (email, senha mínima)
- Hash da senha com `bcrypt.hash(senha, 10)` — nunca guardar senha em texto puro
- Salvar usuário no banco com o hash

## Login

- Buscar usuário por email
- Comparar com `bcrypt.compare(senhaInformada, hashSalvo)`
- Se válido, gerar:
  - **Access token**: JWT curto (15min), payload mínimo (userId, role)
  - **Refresh token**: JWT longo (7-30 dias) ou token opaco salvo no banco, entregue via cookie httpOnly

```ts
const accessToken = jwt.sign({ userId, role }, process.env.JWT_SECRET!, { expiresIn: '15m' });
const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
```

Nunca usar o mesmo secret para access e refresh.

## Middleware de proteção de rota

```ts
export function requireAuth(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'não autenticado' });

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = payload;
      return handler(req, res);
    } catch {
      return res.status(401).json({ error: 'token inválido' });
    }
  };
}
```

## Refresh

- Endpoint separado (`/api/auth/refresh`) que valida o refresh token e emite novo access token
- Se usar refresh token opaco (não JWT), salvar hash dele no banco e invalidar no logout

## Variáveis de ambiente necessárias

```
JWT_SECRET=...
JWT_REFRESH_SECRET=...
```

Gerar com `openssl rand -base64 32`, nunca reusar entre projetos de clientes diferentes.

## Erros comuns a evitar

- Guardar JWT no localStorage (vulnerável a XSS) — preferir cookie httpOnly + SameSite
- Access token com expiração longa demais (facilita replay se vazar)
- Esquecer de invalidar refresh token no logout
