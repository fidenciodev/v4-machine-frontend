# Especificações técnicas

## Objetivo

Proposta de front-end para a V4 Machines, valorizando os veículos e facilitando o contato com a loja. A versão inicial mantém preto e dourado, com cinza quente nas superfícies claras e textos secundários ligeiramente maiores.

## Arquitetura

| Camada | Implementação |
| --- | --- |
| Estrutura | HTML5 sem framework |
| Estilos | CSS, propriedades customizadas, Grid, Flexbox e media queries |
| Interações | JavaScript nativo em `dist/app.js` |
| Dados | `fetch('./data/stock.json')` |
| Persistência | `localStorage`, somente para favoritos |
| Atendimento | Links `wa.me` e formulário que abre o WhatsApp |
| Desenvolvimento | Servidor HTTP em Node.js com módulos nativos |
| Publicação | Arquivos estáticos de `dist/`, sem etapa de build |

Não há banco de dados, painel administrativo, integração de estoque ou processamento de pagamentos.

## Componentes

Página única com cabeçalho, abertura, catálogo, apresentação da loja, serviços, contato WhatsApp, localização e rodapé. Os detalhes dos veículos e os formulários usam `<dialog>`. O catálogo começa com seis veículos e permite carregar os demais.

## Contrato de dados

Arquivo: `dist/data/stock.json`.

| Campo principal | Tipo | Finalidade |
| --- | --- | --- |
| `demo` | boolean | Ativa avisos e mensagens de conteúdo ilustrativo |
| `whatsapp` | string | Número internacional, somente dígitos |
| `notice` | string | Descrição do caráter demonstrativo dos dados |
| `cars` | array | Lista de veículos |

Cada veículo contém:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | string | Identificador único e estável usado nos favoritos |
| `brand` | string | Marca; alimenta o filtro de marcas |
| `model` | string | Nome do modelo |
| `version` | string | Descrição breve |
| `year` | string | Ano/modelo, por exemplo `2020/2021` |
| `km` | number ou string | Quilometragem; números são formatados em pt-BR |
| `fuel` | string | Combustível |
| `transmission` | string | Câmbio |
| `category` | string | `suv`, `sedan`, `hatch`, `picape` ou `esportivo` |
| `price` | number | Reais; ausente ou não positivo exibe “Sob consulta” |
| `image` | string | Imagem principal relativa à raiz de `dist/` |
| `images` | array, opcional | Fotos adicionais do mesmo exemplar |
| `tag` | string, opcional | Selo do cartão |
| `featured` | boolean, opcional | Indicação opcional de destaque |

Categorias dos botões e faixas de preço são configuradas no HTML. Acrescente ou ajuste os botões ao alterar categorias. Veículos sem preço numérico não aparecem ao filtrar por um teto de preço.

## Comportamentos

- Busca por marca, modelo, descrição, ano e categoria, ignorando acentos.
- Busca e filtros funcionam em conjunto; estado vazio permite limpar os filtros.
- Favoritos usam `v4machine-favorites-v1` no armazenamento local. Sem acesso ao armazenamento, funcionam durante a visita.
- Modais mantêm a navegação por teclado e restauram o foco ao fechar.
- O formulário valida os campos e prepara uma mensagem; o visitante continua o envio no WhatsApp.
- Falha de carregamento do JSON mostra mensagem recuperável e permite tentar novamente.
- `prefers-reduced-motion` reduz animações e evita rolagem suave quando indicado.

## Identidade e responsividade

| Elemento | Referência |
| --- | --- |
| Cor principal | `#171916` |
| Dourado / dourado claro | `#b4935a` / `#c9ac78` |
| Fundo / superfície | `#e9e6df` / `#f0ede7` |
| Tipografia | DM Sans e Manrope, via Google Fonts, com fallback sans-serif |

Catálogo com três colunas em telas amplas, duas até 900 px e uma até 640 px. Ajustes adicionais até 1180 px e a partir de 1600 px. Menu, filtros, modais e contatos acompanham a responsividade.

## Execução

Node.js 20+ para o servidor local. `npm start` ou `npm run dev` inicia em `http://127.0.0.1:4173`. `PORT` altera a porta. `npm run check` verifica a sintaxe do aplicativo e do servidor. Não há dependências para instalar.

O site publicado usa somente arquivos estáticos. Sirva por HTTP/HTTPS: abrir por `file://` pode impedir o carregamento do JSON. O servidor local escuta apenas em `127.0.0.1` e não é um servidor de produção.

## Revisão antes do lançamento comercial

- Substituir exemplos, preços e fotos pelos dados reais do estoque.
- Conferir contatos, endereço, marca, textos e condições comerciais com o cliente.
- Rever `demo`, a faixa de aviso no HTML e os selos dos dados após a atualização comercial.
- Ajustar `noindex, nofollow` apenas quando o conteúdo estiver aprovado.
- Validar aparência, teclado, responsividade e diálogos em navegadores reais.
- Definir integração de estoque, painel e captura de leads em escopo posterior, se necessários.
