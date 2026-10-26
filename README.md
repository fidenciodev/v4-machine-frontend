# V4 Machines — proposta de front-end

Proposta visual responsiva para apresentar ao cliente. HTML, CSS e JavaScript sem dependências de execução ou etapa de build.

## Abrir localmente

```powershell
cd v4-machine
npm start
```

Abra http://127.0.0.1:4173. Para verificar JavaScript: `npm run check`.

## O que está pronto

- Identidade em preto, dourado e marfim; abertura com a foto do site atual.
- Catálogo com busca por texto, marca, preço e categoria.
- Favoritos persistidos no navegador e filtro de favoritos.
- Detalhes em modal com ficha, fotos e contato contextual.
- Formulário para iniciar conversa no WhatsApp sobre atendimento, troca ou financiamento.
- Navegação móvel, acessibilidade por teclado e redução de movimento.
- Endereço, WhatsApp e Instagram consultados no site atual.

## Conteúdo demonstrativo

O site atual não tem estoque público. `dist/data/stock.json` contém veículos, versões, anos, quilometragens e valores **ilustrativos**, claramente sinalizados na interface. Substitua pelos dados reais antes de disponibilizar como site comercial. As imagens de galeria são referências visuais e podem mostrar exemplares diferentes. O mapa é uma ilustração com link para o Google Maps.

Os formulários abrem o WhatsApp; não enviam ou armazenam leads em servidor. As condições de financiamento são tratadas diretamente com a loja. Não foram inventadas avaliações, taxas, garantias ou números comerciais.

A marca tipográfica é uma releitura de apresentação. O logo original está preservado em `dist/assets/v4-logo.png` para futura escolha do cliente. A paleta está em `:root` de `dist/styles.css`.

## Fontes e créditos

Fonte institucional: http://v4machine.com.br/ (consultado em 26/10/2026). Foto de abertura e fachada pertencem ao material do site atual, usadas na proposta de redesign. Dados e fontes dos assets: `reference-data.json`. Fotografias demonstrativas do Unsplash; autoria e URLs preservadas nesse arquivo. Tipografia: DM Sans e Manrope via Google Fonts.

## Publicação

`dist/` é o diretório estático. O Site da proposta usa uma identidade própria em `.openai/hosting.json`; o domínio atual do cliente não é alterado. Metadados `noindex` evitam indexação deliberada da proposta.

## Valida??o desta entrega

Sintaxe JavaScript e 33 cen?rios funcionais passaram em DOM simulado: filtros, busca, favoritos, carregamento progressivo, detalhes, formul?rio WhatsApp, navega??o m?vel e recupera??o de erro. Os arquivos est?ticos foram verificados por HTTP local. N?o havia navegador dispon?vel nesta sess?o para confirmar renderiza??o visual e comportamento nativo dos di?logos.
