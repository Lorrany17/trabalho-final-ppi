import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ==========================================================================
 * ARQUITETURA DE JOGO DA VELHA EM ANGULAR (v17+) - COMPONENTE STANDALONE
 * 
 * COMPARAÇÃO DIDÁTICA (VANILLA JS vs ANGULAR):
 * No Vanilla JS, você precisava gerenciar manualmente a sincronização entre
 * o estado na memória (array do tabuleiro) e a tela física (DOM), tendo que
 * selecionar elementos com 'document.getElementById' e editar suas propriedades
 * ativamente em uma função 'atualizarDOM()'.
 * 
 * No Angular, nós simplesmente declaramos o estado como propriedades da classe 
 * (ex: 'this.tabuleiro'). Graças ao DATA BINDING bidirecional/unidirecional e 
 * à DETECÇÃO DE MUDANÇAS (Change Detection) do Angular, qualquer alteração que 
 * fizermos nestas propriedades TypeScript irá se propagar e atualizar o HTML 
 * automaticamente e instantaneamente, sem que precisemos manipular o DOM diretamente.
 * Isso elimina toda uma classe de bugs de dessincronização visual.
 * ==========================================================================
 */

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule], // Suporte geral a diretivas e facilidades
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {

  // ==========================================================================
  // ESTADO DA APLICAÇÃO (STATE)
  // O Angular monitora estas propriedades e atualiza a tela quando mudam.
  // ==========================================================================
  tabuleiro: string[] = Array(9).fill(''); // Array de 9 posições: ['', 'X', 'O', ...]
  turnoAtual: 'X' | 'O' = 'X';             // Jogador da vez
  jogoAtivo: boolean = true;               // Define se a partida está rodando ou acabou
  casasVencedoras: number[] = [];          // Índices das casas que venceram para o CSS neon
  vencedor: 'X' | 'O' | null = null;       // Identifica o vencedor ('X', 'O' ou null se empate/rodando)

  placar = {
    x: 0,
    o: 0,
    empates: 0
  };

  // Chave de persistência de dados no navegador
  private readonly STORAGE_KEY = 'jogo-da-velha-angular-estado';

  // Combinações matemáticas para detectar vitória (8 padrões)
  private readonly COMBINACOES_VITORIA = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
    [0, 4, 8], [2, 4, 6]             // Diagonais
  ];

  /**
   * CICLO DE VIDA - INICIALIZAÇÃO DO COMPONENTE
   * O ngOnInit substitui o evento 'DOMContentLoaded' do JavaScript puro.
   */
  ngOnInit(): void {
    this.carregarEstadoLocalStorage();
  }

  /**
   * LÓGICA DE NEGÓCIO - AÇÃO DE CLICAR EM UMA CASA
   * @param index Índice da célula clicada (0 a 8)
   */
  jogar(index: number): void {
    // Validações básicas idênticas às do Vanilla JS
    if (this.tabuleiro[index] !== '' || !this.jogoAtivo) {
      return;
    }

    // 1. Atualiza o estado na memória.
    // DIDÁTICO: Apenas alterando este array, o Angular percebe a mudança de referência/valor 
    // e atualiza os botões correspondentes no template HTML de forma automática.
    this.tabuleiro[index] = this.turnoAtual;

    // 2. Executa as validações de fim de jogo
    this.verificarFimDeJogo();

    // 3. Alterna o turno caso a partida ainda esteja ativa
    if (this.jogoAtivo) {
      this.turnoAtual = this.turnoAtual === 'X' ? 'O' : 'X';
    }

    // 4. Salva o novo estado de forma persistente
    this.salvarEstadoLocalStorage();
  }

  /**
   * VALIDAÇÃO DE VITÓRIA OU EMPATE (VELHA)
   */
  private verificarFimDeJogo(): void {
    let houveVitoria = false;
    let combinacaoGanhadora: number[] = [];

    // Compara o tabuleiro atual com as combinações de vitória
    for (const combinacao of this.COMBINACOES_VITORIA) {
      const [a, b, c] = combinacao;
      if (
        this.tabuleiro[a] &&
        this.tabuleiro[a] === this.tabuleiro[b] &&
        this.tabuleiro[a] === this.tabuleiro[c]
      ) {
        houveVitoria = true;
        combinacaoGanhadora = combinacao;
        break;
      }
    }

    if (houveVitoria) {
      this.jogoAtivo = false;
      this.casasVencedoras = combinacaoGanhadora;

      const vencedorSinal = this.tabuleiro[combinacaoGanhadora[0]] as 'X' | 'O';
      this.vencedor = vencedorSinal;
      if (vencedorSinal === 'X') {
        this.placar.x++;
      } else {
        this.placar.o++;
      }
      return;
    }

    // Verifica empate se o tabuleiro estiver todo preenchido e não houve vitória
    const todosCamposPreenchidos = this.tabuleiro.every(celula => celula !== '');
    if (todosCamposPreenchidos) {
      this.jogoAtivo = false;
      this.casasVencedoras = [];
      this.placar.empates++;
    }
  }

  /**
   * CONTROLES DE PARTIDA E RESET
   */

  // Inicia uma nova rodada limpando o tabuleiro e as marcações, mas mantendo os placares
  reiniciarPartida(): void {
    this.resetarParaEstadoPadrao();
    this.salvarEstadoLocalStorage();
  }

  // Zera completamente o placar acumulado e limpa o tabuleiro
  zerarJogoEPlacar(): void {
    this.resetarParaEstadoPadrao();
    this.placar = {
      x: 0,
      o: 0,
      empates: 0
    };
    this.salvarEstadoLocalStorage();
  }

  private resetarParaEstadoPadrao(): void {
    this.tabuleiro = Array(9).fill('');
    this.turnoAtual = 'X';
    this.jogoAtivo = true;
    this.casasVencedoras = [];
    this.vencedor = null;
  }

  // ==========================================================================
  // MÉTODOS DE PERSISTÊNCIA (LOCALSTORAGE)
  // Mantém os dados gravados no navegador caso o usuário dê F5 na página.
  // ==========================================================================
  private salvarEstadoLocalStorage(): void {
    const estadoJSON = {
      tabuleiro: this.tabuleiro,
      turnoAtual: this.turnoAtual,
      jogoAtivo: this.jogoAtivo,
      casasVencedoras: this.casasVencedoras,
      vencedor: this.vencedor,
      placar: this.placar
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(estadoJSON));
  }

  private carregarEstadoLocalStorage(): void {
    const dadosSalvos = localStorage.getItem(this.STORAGE_KEY);

    if (dadosSalvos) {
      try {
        const estadoRecuperado = JSON.parse(dadosSalvos);
        this.tabuleiro = estadoRecuperado.tabuleiro;
        this.turnoAtual = estadoRecuperado.turnoAtual;
        this.jogoAtivo = estadoRecuperado.jogoAtivo;
        this.casasVencedoras = estadoRecuperado.casasVencedoras;
        this.vencedor = estadoRecuperado.vencedor !== undefined ? estadoRecuperado.vencedor : null;
        this.placar = estadoRecuperado.placar;
      } catch (erro) {
        console.error('Falha ao restaurar estado do LocalStorage no Angular:', erro);
        this.resetarParaEstadoPadrao();
      }
    } else {
      this.resetarParaEstadoPadrao();
    }
  }
}
