# Site Alt Labs

Site de página única (HTML, CSS e JS puros, sem build).

## Ver o site
Dê duplo clique em `iniciar.bat`. Ele abre `http://localhost:4500`. Precisa do Python instalado. Para parar, feche a janela preta.

Não abra o `index.html` direto no navegador: o site lê o `conteudo.json` e isso exige o servidor local.

## Onde editar
| O que mudar | Onde |
|---|---|
| Textos, links do Instagram, serviços, passos do processo | `conteudo.json` |
| Adicionar ou trocar um trabalho | `conteudo.json` (seção `trabalhos`) + imagem em `assets/logos/` ou `assets/identidades/` |
| Marcar "Cliente" ou "Projeto autoral" | campo `tipo` de cada trabalho (use exatamente `Cliente` ou `Projeto autoral`) |
| Cores e fontes | topo do `styles.css` (bloco `:root`) |
| Vídeos | `assets/videos/` (os arquivos de origem estão em `..\Alt-Labs-videos`) |

## Estrutura
- `index.html`: esqueleto da página.
- `styles.css`: visual.
- `app.js`: monta a página a partir do `conteudo.json`, abas, parallax e zoom das imagens.
- `assets/`: imagens e vídeos (colagens já recortadas em formato orgânico).

## Instagram
- Botão principal: `https://ig.me/m/altlabs_design` (abre o direct).
- Botão "Ver perfil": `https://www.instagram.com/altlabs_design/`.
