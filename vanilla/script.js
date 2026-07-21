/**
 * ==========================================================================
 * ARQUITETURA DE JOGO DA VELHA EM VANILLA JS (SEM FRAMEWORK)
 * 
 * Este arquivo está estruturado separando estritamente o ESTADO da aplicação
 * e a RENDERIZAÇÃO (manipulação do DOM). É o padrão que simula como frameworks
 * reativos modernos funcionam por baixo dos panos (sincronização automática).
 * ==========================================================================
 */

/**
 * ESTADO GLOBAL DA APLICAÇÃO (STATE)
 * Objeto central que armazena a verdade única sobre o estado atual do jogo.
 */
const estado = {
    tabuleiro: Array(9).fill(''), // Array de 9 posições representando o grid 3x3
    turnoAtual: 'X',             // Controla quem joga a seguir: 'X' ou 'O'
    jogoAtivo: true,             // Flag indicando se a partida está ativa ou terminou
    casasVencedoras: [],         // Guarda os 3 índices das células vencedoras para destaque
    placar: {
        x: 0,
        o: 0,
        empates: 0
    }
};

/**
 * REGRAS DE NEGÓCIO - COMBINAÇÕES VENCEDORAS
 * Representação vetorial das 8 formas possíveis de vencer no Jogo da Velha.
 */
const COMBINACOES_VITORIA = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
    [0, 4, 8], [2, 4, 6]             // Diagonais
];

// Chave utilizada para persistência dos dados no localStorage do navegador
const STORAGE_KEY = 'jogo-da-velha-ppi-estado';

/**
 * ELEMENTOS DO DOM (CACHE DE SELETORES)
 * Captura referências permanentes dos elementos para melhorar a performance.
 */
const celulasDOM = document.querySelectorAll('.cell');
const turnoDisplayDOM = document.getElementById('turno-atual-display');
const statusMensagemDOM = document.getElementById('mensagem-status');
const placarXDOM = document.getElementById('placar-vitorias-x');
const placarODOM = document.getElementById('placar-vitorias-o');
const placarEmpatesDOM = document.getElementById('placar-empates');
const btnReiniciar = document.getElementById('botao-reiniciar');
const btnZerarPlacar = document.getElementById('botao-zerar-placar');

/**
 * RENDERIZADOR CENTRAL (RENDER/VIEW UPDATE)
 * Lê o estado global da memória e força o DOM a refleti-lo fielmente.
 * Esta função demonstra o trabalho manual exigido no desenvolvimento sem frameworks.
 */
function atualizarDOM() {
    // 1. Renderizar o Tabuleiro
    celulasDOM.forEach((celula, index) => {
        const jogada = estado.tabuleiro[index];
        celula.textContent = jogada;
        
        // Remove classes estéticas anteriores para evitar duplicações
        celula.classList.remove('cell-x', 'cell-o', 'winner-cell');
        
        // Aplica o estilo apropriado dependendo de quem marcou a casa
        if (jogada === 'X') {
            celula.classList.add('cell-x');
        } else if (jogada === 'O') {
            celula.classList.add('cell-o');
        }

        // Aplica destaque brilhante e pulsante se for uma das casas vencedoras
        if (estado.casasVencedoras.includes(index)) {
            celula.classList.add('winner-cell');
        }

        // Acessibilidade: Atualiza tags de leitura para deficientes visuais
        let descricaoAcessibilidade = `Casa ${index + 1}`;
        if (jogada) {
            descricaoAcessibilidade += ` marcada por jogador ${jogada}`;
        } else {
            descricaoAcessibilidade += ` vazia`;
        }
        celula.setAttribute('aria-label', descricaoAcessibilidade);
    });

    // 2. Renderizar Indicador de Turno
    turnoDisplayDOM.textContent = estado.turnoAtual;
    if (estado.turnoAtual === 'X') {
        turnoDisplayDOM.className = 'player-turn-badge text-x';
    } else {
        turnoDisplayDOM.className = 'player-turn-badge text-o';
    }

    // 3. Renderizar Mensagem de Status
    if (!estado.jogoAtivo) {
        if (estado.casasVencedoras.length > 0) {
            // Caso haja vitória
            const vencedor = estado.tabuleiro[estado.casasVencedoras[0]];
            statusMensagemDOM.innerHTML = `Jogador <span class="text-${vencedor.toLowerCase()}">${vencedor}</span> venceu! 🎉`;
        } else {
            // Caso de empate (velha)
            statusMensagemDOM.innerHTML = `Deu <span class="text-tie">Velha</span>! O jogo empatou. 👵`;
        }
    } else {
        // Caso esteja ocorrendo a partida
        statusMensagemDOM.textContent = 'A partida está ativa!';
    }

    // 4. Renderizar Placar com micro-animações (bump effect)
    atualizarValorPlacarComAnimacao(placarXDOM, estado.placar.x);
    atualizarValorPlacarComAnimacao(placarODOM, estado.placar.o);
    atualizarValorPlacarComAnimacao(placarEmpatesDOM, estado.placar.empates);
}

/**
 * MICRO-ANIMAÇÃO DO PLACAR
 * Aplica um efeito de aumento de escala temporário quando os números do placar aumentam.
 */
function atualizarValorPlacarComAnimacao(elementoDOM, novoValor) {
    const valorAtual = parseInt(elementoDOM.textContent) || 0;
    
    // Se o valor na tela mudou, anima o crescimento e restaura
    if (valorAtual !== novoValor) {
        elementoDOM.textContent = novoValor;
        elementoDOM.classList.add('bump');
        setTimeout(() => {
            elementoDOM.classList.remove('bump');
        }, 300);
    } else {
        elementoDOM.textContent = novoValor;
    }
}

/**
 * PERSISTÊNCIA LOCAL (LOCALSTORAGE)
 * Funções para salvar e recuperar o estado da aplicação na memória local do navegador.
 */
function salvarEstadoLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
}

function carregarEstadoLocalStorage() {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);
    
    if (dadosSalvos) {
        try {
            const estadoRecuperado = JSON.parse(dadosSalvos);
            
            // Restaura as variáveis globais a partir do JSON salvo
            estado.tabuleiro = estadoRecuperado.tabuleiro;
            estado.turnoAtual = estadoRecuperado.turnoAtual;
            estado.jogoAtivo = estadoRecuperado.jogoAtivo;
            estado.casasVencedoras = estadoRecuperado.casasVencedoras;
            estado.placar = estadoRecuperado.placar;
        } catch (erro) {
            console.error('Falha ao restaurar estado do LocalStorage. Inicializando jogo limpo.', erro);
            resetarParaEstadoPadrao();
        }
    } else {
        resetarParaEstadoPadrao();
    }
}

// Retorna as configurações do tabuleiro ao estado original
function resetarParaEstadoPadrao() {
    estado.tabuleiro = Array(9).fill('');
    estado.turnoAtual = 'X';
    estado.jogoAtivo = true;
    estado.casasVencedoras = [];
}

/**
 * LÓGICA DE NEGÓCIO - CONTROLE DA JOGADA
 * Disparado pelo clique em qualquer célula do tabuleiro.
 */
function processarJogada(event) {
    const celulaClicada = event.target;
    const indiceCelula = parseInt(celulaClicada.getAttribute('data-index'));

    // Validações: impede jogada em células ocupadas ou se o jogo já terminou
    if (estado.tabuleiro[indiceCelula] !== '' || !estado.jogoAtivo) {
        return;
    }

    // 1. Registra a jogada no Estado
    estado.tabuleiro[indiceCelula] = estado.turnoAtual;

    // 2. Processa as consequências da jogada (Vitória / Empate)
    verificarStatusResultado();

    // 3. Se o jogo ainda estiver rolando, alterna a vez
    if (estado.jogoAtivo) {
        estado.turnoAtual = estado.turnoAtual === 'X' ? 'O' : 'X';
    }

    // 4. Persiste o estado modificado no LocalStorage
    salvarEstadoLocalStorage();

    // 5. Redesenha a tela
    atualizarDOM();
}

/**
 * VERIFICADOR DE VITÓRIA E EMPATE
 * Compara o tabuleiro atual com o mapa de combinações vitoriosas.
 */
function verificarStatusResultado() {
    let houveVitoria = false;
    let combinacaoGanhadora = [];

    // Varre todas as 8 combinações de vitória
    for (let i = 0; i < COMBINACOES_VITORIA.length; i++) {
        const [a, b, c] = COMBINACOES_VITORIA[i];
        
        // Verifica se a combinação possui 3 símbolos iguais e válidos (não vazios)
        if (
            estado.tabuleiro[a] &&
            estado.tabuleiro[a] === estado.tabuleiro[b] &&
            estado.tabuleiro[a] === estado.tabuleiro[c]
        ) {
            houveVitoria = true;
            combinacaoGanhadora = [a, b, c];
            break;
        }
    }

    // Ação em caso de vitória
    if (houveVitoria) {
        estado.jogoAtivo = false;
        estado.casasVencedoras = combinacaoGanhadora;
        
        const vencedor = estado.tabuleiro[combinacaoGanhadora[0]];
        if (vencedor === 'X') {
            estado.placar.x++;
        } else {
            estado.placar.o++;
        }
        return;
    }

    // Ação em caso de empate (velha)
    const todosCamposPreenchidos = estado.tabuleiro.every(celula => celula !== '');
    if (todosCamposPreenchidos) {
        estado.jogoAtivo = false;
        estado.casasVencedoras = [];
        estado.placar.empates++;
    }
}

/**
 * CONTROLES DE PARTIDA E PLACAR
 */

// Cria uma nova rodada limpando o tabuleiro, mantendo a pontuação atual do placar
function iniciarNovaPartida() {
    resetarParaEstadoPadrao();
    salvarEstadoLocalStorage();
    atualizarDOM();
}

// Zera as estatísticas do placar acumuladas e limpa o tabuleiro
function zerarJogoEPlacar() {
    resetarParaEstadoPadrao();
    estado.placar = {
        x: 0,
        o: 0,
        empates: 0
    };
    salvarEstadoLocalStorage();
    atualizarDOM();
}

/**
 * CONFIGURAÇÃO DO FLUXO DE INICIALIZAÇÃO E OUVINTES DE EVENTOS (LISTENERS)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Tenta carregar os dados salvos anteriormente (para resistir ao F5)
    carregarEstadoLocalStorage();

    // 2. Renderiza a tela inicialmente baseada nos dados recuperados
    atualizarDOM();

    // 3. Vincula os escutas de clique nas 9 casas do tabuleiro
    celulasDOM.forEach(celula => {
        celula.addEventListener('click', processarJogada);
    });

    // 4. Vincula os escutas de clique nos botões de controle
    btnReiniciar.addEventListener('click', iniciarNovaPartida);
    btnZerarPlacar.addEventListener('click', zerarJogoEPlacar);
});
