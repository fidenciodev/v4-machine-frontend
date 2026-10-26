# Especificações técnicas

## Objetivo

Proposta de front-end para a V4 Machines, valorizando os veículos e facilitando o contato com a loja. A versão inicial mantém preto e dourado, com cinza quente nas superfícies claras e textos secundários ligeiramente maiores.

## Arquitetura

| Camada | Implementação |
| --- | --- |
| Estrutura | Componentes Astro com geração estática de HTML |
| Estilos | Tailwind CSS via plugin Vite, tokens e CSS de componentes |
| Interações | JavaScript em `src/scripts/catalog.js` e Motion em `src/scripts/experience.ts` |
| Dados | `src/data/stock.json`, importado no build e publicado como JSON estático |
| Persistência | `localStorage`, somente para favoritos |
| Atendimento | Links `wa.me` e formulário que abre o WhatsApp |
| Desenvolvimento | Servidor de desenvolvimento do Astro/Vite |
| Publicação | Build estático gerado pelo Astro em `dist/` |

Não há banco de dados, painel administrativo, integração de estoque ou processamento de pagamentos.

## Componentes

Página única com componentes para cabeçalho, abertura, catálogo, apresentação da loja, serviços, contato e rodapé. `BaseLayout.astro` reúne o documento, as fontes, os estilos e os scripts. Os detalhes e formulários usam `<dialog>`. Os seis primeiros cartões são renderizados em HTML no build; o JavaScript aplica favoritos e filtros e permite carregar os demais.

## Contrato de dados

Fonte: `src/data/stock.json`. A rota `src/pages/data/stock.json.ts` gera `/data/stock.json` estaticamente no build, sem exigir um backend.

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
| `image` | string | Imagem principal relativa à raiz pública, como `assets/porsche-911.jpg` |
| `images` | array, opcional | Fotos adicionais do mesmo exemplar |
| `tag` | string, opcional | Selo do cartão |
| `featured` | boolean, opcional | Indicação opcional de destaque |

Categorias e faixas de preço são configuradas em `src/components/Inventory.astro`. Acrescente ou ajuste os botões ao alterar categorias. Veículos sem preço numérico não aparecem ao filtrar por um teto de preço.

## Comportamentos

- Busca por marca, modelo, descrição, ano e categoria, ignorando acentos.
- Busca e filtros funcionam em conjunto; estado vazio permite limpar os filtros.
- Favoritos usam `v4machine-favorites-v1` no armazenamento local. Sem acesso ao armazenamento, funcionam durante a visita.
- Modais mantêm a navegação por teclado e restauram o foco ao fechar.
- O formulário valida os campos e prepara uma mensagem; o visitante continua o envio no WhatsApp.
- Falha de carregamento do JSON mostra mensagem recuperável e permite tentar novamente.
- `prefers-reduced-motion` reduz animações e evita rolagem suave quando indicado.
- Motion controla a entrada do título e das seções, o movimento discreto da foto de abertura, a resposta dos cartões e a abertura dos modais.
- A barra superior indica progresso da página; a navegação destaca a seção em exibição.
- Animações dos cartões são registradas novamente após filtro ou carregamento, com limpeza dos observadores anteriores.

## Identidade e responsividade

| Elemento | Referência |
| --- | --- |
| Cor principal | `#171916` |
| Dourado / dourado claro | `#b4935a` / `#c9ac78` |
| Fundo / superfície | `#e9e6df` / `#f0ede7` |
| Tipografia | DM Sans e Manrope, via Google Fonts, com fallback sans-serif |

Catálogo com três colunas em telas amplas, duas até 900 px e uma até 640 px. Ajustes adicionais até 1180 px e a partir de 1600 px. Menu, filtros, modais e contatos acompanham a responsividade.

## Execução

Node.js 22.23.4+ e npm. Execute `npm ci` para instalar as versões do lockfile. `npm start` ou `npm run dev` inicia em `http://127.0.0.1:4173`; `-- --port 4174` altera a porta. `npm run check` verifica os componentes e TypeScript. `npm run build` gera o site estático; `npm run preview` serve o resultado localmente.

O resultado publicado usa somente arquivos estáticos de `dist/`. Sirva por HTTP/HTTPS: abrir por `file://` pode impedir o carregamento do JSON. Os servidores locais escutam apenas em `127.0.0.1`.

## Publicação online

GitHub Pages: https://fidenciodev.github.io/v4-machine-frontend/ . O workflow `.github/workflows/deploy-pages.yml` verifica e compila o projeto, e publica o resultado a cada push em `main`. `DEPLOY_TARGET=github-pages` ativa o `site` e o `base` específicos dessa hospedagem no Astro. O build padrão mantém a base `/` para outras hospedagens.

## Revisão antes do lançamento comercial

- Substituir exemplos, preços e fotos pelos dados reais do estoque.
- Conferir contatos, endereço, marca, textos e condições comerciais com o cliente.
- Rever `demo`, a faixa de aviso no componente de catálogo e os selos após a atualização comercial.
- Ajustar `noindex, nofollow` apenas quando o conteúdo estiver aprovado.
- Validar aparência, teclado, responsividade e diálogos em navegadores reais.
- Definir integração de estoque, painel e captura de leads em escopo posterior, se necessários.
