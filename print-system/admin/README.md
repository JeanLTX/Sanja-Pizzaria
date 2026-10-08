 # Painel administrativo — Impressão

O painel fica separado do aplicativo desktop do cliente.

## Primeiro administrador

1. No Supabase, abra **Authentication → Users** e crie o usuário que será responsável pela administração.
2. No SQL Editor, execute o INSERT comentado no final de admin-panel.sql, substituindo SEU_EMAIL_AQUI pelo e-mail criado.
3. Hospede admin/index.html em um domínio seu (Netlify, Vercel ou outro host estático).
4. Entre no painel com o e-mail e senha do usuário administrador.

## Fluxo

Estabelecimentos → selecionar cliente → Gerar código de ativação → enviar o código para o computador do cliente.

O código é de uso único e pode ter validade configurável.

O Bridge Token não é exibido no painel.
