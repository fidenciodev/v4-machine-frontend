# V4 Machine — Front-end

Front-end para a **V4 Machines — Autos Consignados**, em Itaquaquecetuba/SP. Interface responsiva em preto, dourado e cinza quente, desenvolvida com HTML, CSS e JavaScript, sem dependências de execução ou etapa de build.

[Especificações técnicas](docs/SPECIFICATIONS.md) · [Fontes e créditos](docs/ASSETS.md)

## Executar

Requer Node.js 20 ou superior.

```bash
git clone https://github.com/fidenciodev/v4-machine-frontend.git
cd v4-machine-frontend
npm start
```

Abra **http://127.0.0.1:4173**. Não é necessário instalar pacotes. `npm run dev` também inicia o servidor local; `npm run check` verifica a sintaxe do JavaScript.

Para escolher outra porta no PowerShell:

```powershell
$env:PORT = '4174'
npm start
```

## Funcionalidades

- Catálogo demonstrativo com busca e filtros por marca, categoria e preço.
- Favoritos persistidos no navegador e filtro para visualizar os veículos salvos.
- Detalhes em modal com ficha, foto e contato contextual.
- Formulário para iniciar conversa sobre atendimento, troca ou financiamento no WhatsApp.
- Informações da loja, Instagram e link de rota no Google Maps.
- Menu móvel, navegação por teclado e respeito à preferência por movimento reduzido.

## Estrutura

```text
dist/
  assets/           Imagens e ícone usados pelo site; logo original preservado
  data/stock.json   Dados demonstrativos e contato WhatsApp
  index.html        Estrutura e conteúdo
  styles.css        Layout, componentes e responsividade
  refinements.css   Fundos suaves e ajustes de legibilidade
  app.js            Catálogo, favoritos, modais e interações
docs/
  SPECIFICATIONS.md Arquitetura, requisitos e configuração
  ASSETS.md         Origem e créditos das imagens
server.mjs          Servidor HTTP para desenvolvimento local
package.json        Comandos do projeto
```

## Personalizar

- **Estoque:** edite `dist/data/stock.json`; contrato nas especificações.
- **Contato:** atualize `whatsapp` no JSON e os links institucionais em `dist/index.html`.
- **Visual:** variáveis em `dist/styles.css` e ajustes em `dist/refinements.css`.
- **Textos e seções:** `dist/index.html`.

## Dados demonstrativos

O catálogo contém **veículos, anos, quilometragens e preços ilustrativos**, sinalizados na interface. Não representa o estoque ou ofertas confirmadas da loja. Antes de lançar comercialmente, substitua os dados e as fotos pelos veículos reais e revise os textos com o cliente.

Os formulários abrem o WhatsApp; não armazenam nem enviam leads por servidor próprio. O mapa é ilustrativo e tem link para o Google Maps. A marca tipográfica é uma releitura; o logo original está preservado em `dist/assets/v4-logo.png`.

## Verificação

Execute `npm run check` para verificar a sintaxe do aplicativo e do servidor local. Confira também a responsividade, a navegação por teclado, os filtros e os diálogos nos navegadores de destino.

## Publicação

Publique o conteúdo de **`dist/`** em uma hospedagem estática. O Node.js é necessário apenas para o servidor local. O HTML contém `noindex, nofollow` enquanto o catálogo usar conteúdo demonstrativo.

Os créditos dos recursos visuais estão em `docs/ASSETS.md`.

O repositório não concede licença de redistribuição para marca, fotos ou material institucional do cliente. Consulte as fontes antes de outro uso.
