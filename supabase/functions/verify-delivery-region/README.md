# Verificação de região de entrega via GPS

A Edge Function `verify-delivery-region` consulta a geocodificação reversa do LocationIQ. A chave não deve ser gravada no JavaScript público nem neste repositório.

## Configurar a chave

1. Abra as configurações de segredos das Edge Functions do projeto Supabase **Impressão**:
   https://supabase.com/dashboard/project/tbzdpvyotlfzpowsniou/functions/secrets
2. Adicione um segredo com o nome `LOCATIONIQ_API_KEY`.
3. Como valor, cole o token de acesso LocationIQ que foi fornecido para a integração.
4. Salve o segredo. Não é necessário redeploy após cadastrar a variável de ambiente.

Até esse segredo existir, a função retorna `LOCATIONIQ_SECRET_MISSING` e o checkout mantém a taxa que o cliente selecionou, exibindo uma mensagem de verificação indisponível.

## Origens permitidas

A função aceita chamadas do domínio oficial `sanjapizzaria.com.br` e `www.sanjapizzaria.com.br`, além dos endereços locais `localhost:5500`, `127.0.0.1:5500`, `localhost:3000` e `127.0.0.1:3000`.

Se o site passar a usar outro domínio de produção, adicione a origem explicitamente em `ALLOWED_ORIGINS` no `index.ts` e publique uma nova versão da função.
