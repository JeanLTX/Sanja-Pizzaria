# Impressão — documentação do MVP

## Arquitetura

Cardápio online → Supabase → fila de impressão → aplicativo Impressão no Windows → impressora.

O aplicativo desktop guarda localmente a credencial da bridge e as preferências da impressora. A credencial nunca é mostrada ao cliente.

## Ativação

1. O administrador entra no painel.
2. Seleciona o estabelecimento.
3. Gera um código de ativação com validade.
4. O cliente instala o Impressão.
5. O cliente informa o código em Primeiro acesso.
6. O sistema cria ou reutiliza a bridge daquele computador e gera uma nova credencial local.
7. O cliente escolhe a impressora e configura o formato da comanda.

Cada código é de uso único.

## Administração

O painel administrativo fica em `admin/index.html` e usa Supabase Auth.

Funções principais:
- cadastro de estabelecimentos;
- geração de códigos;
- acompanhamento de computadores;
- desativação e reativação de computadores.

## Impressão

O aplicativo suporta:
- fila pendente;
- impressão manual;
- impressão automática;
- reimpressão imediata;
- recuperação de tarefas presas em impressão;
- modo de simulação.

Sem impressora física, o modo de simulação salva o recibo como arquivo TXT na pasta de dados do aplicativo.

## Configuração de comanda

A aba Etiqueta permite configurar:
- 58 mm ou 80 mm;
- quantidade de caracteres por linha;
- margem esquerda;
- espaço superior e inferior;
- espaçamento de linhas;
- alinhamento do cabeçalho;
- telefone;
- endereço;
- região;
- pagamento;
- observações.

A largura física final ainda depende do driver da impressora no Windows. Para controle gráfico/milimétrico completo, o próximo passo é testar uma impressora térmica real e avaliar ESC/POS.

## Segurança

O cardápio não grava mais diretamente em `orders` e `order_items`. O fluxo de produção usa a RPC `create_public_order`, que valida o estabelecimento e cria o pedido e seus itens de forma atômica.

As funções da bridge validam a credencial do dispositivo. Bridges podem ser desativadas pelo administrador.

## Banco

Migrations:
- `schema.sql` — estrutura inicial;
- `bridge-security.sql` — credenciais e fila inicial;
- `v0.2-upgrade.sql` — ativação, simulação, recuperação e reimpressão;
- `v0.3-upgrade.sql` — segurança, revogação e criação atômica de pedidos;
- `admin-panel.sql` — autenticação/rotinas administrativas.

## Teste de produção

Antes do primeiro cliente real:
1. testar ativação com código novo;
2. testar pedido real do cardápio;
3. validar fila;
4. validar impressão manual;
5. validar impressão automática;
6. validar reimpressão;
7. desativar a bridge no Admin e confirmar bloqueio;
8. reativar e confirmar retorno;
9. testar uma impressora térmica real.

## Build

Dentro de `print-system/bridge`:

`npm install`

`npm run dist`

O instalador NSIS é gerado em `bridge/dist`.

