# 🎮 Jogo da Velha (Tic-Tac-Toe) — Vanilla JS vs Angular

Este projeto foi desenvolvido como trabalho acadêmico com o objetivo de analisar e comparar na prática o desenvolvimento de uma aplicação web reativa utilizando **JavaScript Puro (Vanilla JS)** e o framework moderno **Angular**.

O foco principal é demonstrar as diferenças arquiteturais, de fluxo de dados e de manipulação de interface, cumprindo estritamente a regra de **zero processamento no servidor (sem APIs)** e **sem bibliotecas de interface externas** (como Bootstrap ou Tailwind).

---

## 🏗️ Arquitetura e Estrutura do Projeto

O repositório está dividido em dois diretórios isolados, representando as duas abordagens:

* **`/vanilla`**: Implementação tradicional utilizando HTML5, CSS3 e JavaScript ES6+ puro. A manipulação do DOM e a escuta de eventos são feitas manualmente de forma imperativa.
* **`/framework`**: Implementação moderna utilizando **Angular (v22+)** com arquitetura de *Standalone Components*. A renderização visual é totalmente declarativa e guiada por *Data Binding* e pela nova sintaxe de fluxo de controle (`@for` e `@if`).

---

## 🚀 Funcionalidades e Regras de Negócio

Ambas as versões compartilham exatamente o mesmo comportamento e visual, contendo:

- [x] **Grade 3x3 Interativa:** Turnos alternados automaticamente entre os jogadores **X** e **O**.
- [x] **Detecção Automática de Fim de Jogo:** Validação instantânea das 8 combinações de vitória ou declaração de empate ("velha").
- [x] **Feedback Visual:** Indicador de quem é a vez de jogar e destaque visual para o vencedor da rodada.
- [x] **Placar de Pontuação:** Contagem contínua de vitórias (X vs O) e empates, com opção de "Zerar Placar".
- [x] **Botão de Reiniciar:** Limpa o tabuleiro para uma nova rodada mantendo o placar intacto.
- [x] **Persistência de Estado (Survive ao F5):** O estado completo da partida (tabuleiro atual, turno da vez, status e placar) é salvo automaticamente no `localStorage` do navegador. Recarregar ou fechar a página não perde o progresso do jogo.

---

## 💻 Como Executar o Projeto

Como o projeto roda 100% no lado do cliente (Client-Side), a execução é simples:

### 1. Versão Vanilla JS
1. Navegue até a pasta `/vanilla`.
2. Abra o arquivo `index.html` diretamente em qualquer navegador web (ou utilize a extensão *Live Server* do VS Code).

### 2. Versão Angular
1. Certifique-se de ter o **Node.js** instalado.
2. Abra o terminal, navegue até a pasta do framework e instale as dependências:
   ```bash
   cd framework
   npm install

```

3. Inicie o servidor de desenvolvimento local:
```bash
npm start

```


4. Abra o navegador e acesse: `http://localhost:4200/`.

---

## 🔍 Principais Diferenças Técnicas Observadas

| Critério | Vanilla JS (`/vanilla`) | Angular (`/framework`) |
| --- | --- | --- |
| **Manipulação do DOM** | **Imperativa:** Necessidade de buscar elementos (`document.getElementById`, `querySelectorAll`) e atualizar suas classes e textos manualmente em cada jogada. | **Declarativa:** O DOM atualiza sozinho através do *Data Binding* (`{{ }}` e `[class]`). Alterar o array no TypeScript muda a tela automaticamente. |
| **Sincronização de Estado** | Alto risco de dessincronização entre a lógica de dados e o que está renderizado na tela caso um evento visual seja esquecido. | Fonte única de verdade (*Single Source of Truth*). O framework se encarrega de sincronizar a tela com a variável de estado. |
| **Estrutura e Escalabilidade** | Arquivos separados convencionalmente, mas com lógica atrelada diretamente à estrutura visual do HTML. | Separação clara de responsabilidades por Componente (Lógica, Template e Estilo encapsulados), facilitando a manutenção em sistemas maiores. |
