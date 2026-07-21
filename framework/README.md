# ⚛️ Jogo da Velha — Versão Angular

Esta é a implementação moderna e reativa do Jogo da Velha construída com o framework **Angular (v22+)**, mantendo exatamente as mesmas regras e visual da versão Vanilla, mas com uma arquitetura baseada em componentes.

## 🧠 Como funciona esta versão

* **Arquitetura de Componente Único:** Construído como um *Standalone Component* (`app.ts`), que centraliza a lógica do jogo separada do template visual (`app.html`) e dos estilos (`app.css`).
* **Manipulação Declarativa (Data Binding):** Ao contrário do Vanilla JS, aqui não manipulamos o DOM manualmente. A interface consome o estado da classe de forma reativa através de interpolação `{{ }}` e vinculação de propriedades `[class]`.
* **Novo Fluxo de Controle:** O template utiliza a sintaxe moderna do Angular (`@for` e `@if`) para renderizar a grade do tabuleiro e mensagens de status de maneira limpa e direta.
* **Persistência Sem Servidor:** Cumpri-se a regra de zero processamento backend. O construtor do componente sincroniza o array do tabuleiro e o placar automaticamente com o `localStorage` do navegador, sobrevivendo ao recarregamento (F5).

## 🚀 Como Executar

Esta versão requer o Node.js instalado para gerenciar as dependências do framework:

1. Abra o terminal diretamente nesta pasta (`/framework`).
2. Instale os pacotes necessários:
   ```bash
   npm install

3. Inicie o servidor local de desenvolvimento:

```bash
npm start
```

4. Acesse `http://localhost:4200/` no seu navegador.