# V4 Machine — Front-end

Site da **V4 Machines — Autos Consignados**, construído com **Astro, Tailwind CSS e Motion**. Catálogo interativo, favoritos, detalhes dos veículos e atendimento pelo WhatsApp, com identidade em preto, dourado e cinza quente.

[Especificações técnicas](docs/SPECIFICATIONS.md) · [Fontes e créditos](docs/ASSETS.md)

## Executar

Requer Node.js **22.23.4 ou superior** e npm. As versões das dependências estão registradas no lockfile.

```bash
git clone https://github.com/fidenciodev/v4-machine-frontend.git
cd v4-machine-frontend
npm ci
npm run dev
```

Abra **http://127.0.0.1:4173**.

| Comando | Finalidade |
| --- | --- |
| `npm run dev` ou `npm start` | Desenvolvimento local com atualização automática |
| `npm run check` | Verificação dos componentes Astro e TypeScript |
| `npm run build` | Gerar o site estático em `dist/` |
| `npm run preview` | Conferir o build de produção localmente |

Para outra porta: `npm run dev -- --port 4174`.

## Funcionalidades

- Catálogo inicial renderizado em HTML, com busca, filtros e carregamento progressivo.
- Favoritos persistidos no navegador e compartilhados entre abas.
- Detalhes em modal com ficha, foto e contato contextual.
- Formulário para conversar sobre atendimento, troca ou financiamento no WhatsApp.
- Navegação com indicação de seção e progresso da página.
- Entradas graduais, movimento discreto da foto de abertura e respostas dos cartões ao passar o mouse.
- Modais animados, indicação visual de favoritos e botões com efeitos de destaque.
- Layout responsivo, navegação por teclado e respeito à preferência por movimento reduzido.

## Estrutura

```text
public/assets/             Fotos, logo e ícone
src/
  components/              Seções e componentes reutilizáveis
  layouts/BaseLayout.astro Documento, fontes, estilos e scripts
  pages/index.astro        Página principal
  pages/data/stock.json.ts JSON estático gerado no build
  data/stock.json          Fonte dos veículos demonstrativos
  scripts/catalog.js      Busca, filtros, favoritos e contatos
  scripts/experience.ts   Animações Motion e navegação
  styles/                 Tema, componentes e refinamentos visuais
  types/vehicle.ts        Contrato dos veículos
docs/                     Especificações e créditos
astro.config.mjs          Astro e integração Tailwind/Vite
tsconfig.json             Configuração TypeScript
```

`dist/` é gerado pelo build e não é versionado. O site usa componentes Astro e JavaScript no navegador, sem dependência de um servidor de aplicação em produção.

## Personalizar

- **Veículos e WhatsApp:** `src/data/stock.json`.
- **Fotos e logo:** `public/assets/`.
- **Conteúdo institucional:** componentes em `src/components/`.
- **Tokens Tailwind:** `src/styles/global.css`.
- **Cores e componentes:** `base.css`, `refinements.css` e `polish.css` em `src/styles/`.
- **Movimento:** `src/scripts/experience.ts`.

Ao alterar contatos, confira também os links institucionais dos componentes. O catálogo e o JSON público são gerados a partir da mesma fonte no build.

## Dados demonstrativos

Veículos, anos, quilometragens e valores são **ilustrativos** e estão sinalizados na interface. Não representam ofertas ou disponibilidade confirmadas da loja. Substitua dados e fotos pelos veículos reais antes de um lançamento comercial.

O formulário abre o WhatsApp; a mensagem é enviada pelo próprio visitante. Não há banco de dados, painel administrativo ou armazenamento de leads. O mapa é ilustrativo e tem link para o Google Maps.

## Publicar

```bash
npm ci
npm run check
npm run build
```

Configure a hospedagem para servir **`dist/`**. O resultado é estático: HTML, CSS, JavaScript, JSON e imagens. O HTML usa `noindex, nofollow` enquanto o conteúdo for demonstrativo.

## Verificação

Além da verificação de tipos e do build, confira filtros combinados, favoritos, abertura e fechamento dos modais, links WhatsApp, teclado e telas pequenas. As animações são desativadas ou reduzidas quando o visitante ativa movimento reduzido no sistema.

O repositório não concede licença de redistribuição de marca ou fotografias. Consulte os créditos antes de reutilizar recursos.
