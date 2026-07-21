# 🕹️ Jogo da Velha — Versão Vanilla JS

Esta é a implementação fundamental do Jogo da Velha utilizando apenas tecnologias nativas do navegador (HTML5, CSS3 e JavaScript ES6+ puro), sem nenhuma dependência, API externa ou biblioteca visual.

## 🧠 Como funciona esta versão

* **Manipulação Imperativa do DOM:** O JavaScript é responsável por buscar os elementos HTML na tela (`document.getElementById`, `querySelectorAll`) e alterar manualmente suas classes, estilos e textos a cada jogada.
* **Escuta de Eventos:** Eventos de clique (`addEventListener`) são atrelados diretamente às células do tabuleiro para disparar a lógica de turnos e validação de vitória.
* **Persistência Local:** O estado completo da partida (tabuleiro atual, jogador da vez, status e histórico do placar) é salvo em tempo real no `localStorage`. Ao recarregar a página (F5), os dados são resgatados para reconstruir visualmente o tabuleiro exatamente como estava.

## 🚀 Como Executar

Por ser puro código estático, não há necessidade de compilação ou instalação de pacotes:

1. Abra a pasta `/vanilla` no seu computador.
2. Dê um duplo clique no arquivo `index.html` para abri-lo em qualquer navegador web (ou utilize a extensão *Live Server* no VS Code).