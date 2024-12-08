/* Require, utilizado para manipular arquivos. 
Utiliza do conceito de Escopo ou Closure, 
para trazer o escopo das funções do arquivo trazido. */
const base = require("./base");
Object.getOwnPropertyNames(base).map((p) => (global[p] = base[p]));

// Constantes de movimentação
// Constantes usadas para dizer o quão a cobra deve avançar em cada direção
const NORTH = { x: 0, y: -1 };
const SOUTH = { x: 0, y: 1 };
const EAST = { x: 1, y: 0 };
const WEST = { x: -1, y: 0 };

/* A função "pointEq" verifica se dois pontos então no mesmo lugar no plano cartesiano da tela, isso será muito útil
para verificar se a cobra colidiu consigo mesma ou se ela comeu a maçã, já que seus pontos no plano cartesiano serão iguais */
const pointEq = (p1) => (p2) => p1.x == p2.x && p1.y == p2.y;

// Funções de ações
/* As funções de ações retornam valores booleanos baseados no estado atual do jogo */

/*A função "willEat" verifica se no proximo update que o jogo fizer, a cobra comerá a maçã, 
a função faz isso se baseando na proxima posição da cabeça da cobra e na posição atual da maçã.*/
const willEat = (state) => pointEq(nextHead(state))(state.apple);
const willEatPoison = (state) =>
  pointEq(nextHead(state))(state.poison) ||
  pointEq(nextHead(state))(state.poison2) ||
  pointEq(nextHead(state))(state.poison3);
const willEatAppleEsp = (state) =>
  pointEq(nextHead(state))(state.appleEspecial);
/*A função "willCrash" verifica se a cobra irá colidir consigo mesma no proximo update
baseado no estado atual.*/
const willCrash = (state) => state.snake.find(pointEq(nextHead(state)));
const willCrashWall = (p1) =>
  (p1.y == 0 && p1.x >= 0 && p1.x < 5) ||
  (p1.y == 0 && p1.x >= 15 && p1.x < 20) ||
  (p1.x == 0 && p1.y >= 0 && p1.y < 5) ||
  (p1.x == 0 && p1.y >= 9 && p1.y < 13) ||
  (p1.y == 13 && p1.x >= 0 && p1.x < 5) ||
  (p1.y == 13 && p1.x >= 15 && p1.x < 20) ||
  (p1.x == 19 && p1.y >= 0 && p1.y < 5) ||
  (p1.x == 19 && p1.y >= 9 && p1.y < 13);

/* A função "validMove" verifica se o o movimento que a cobra fará no próximo update é válido.
Para o movimento ser invalido, ele precisa ter sentido oposto ao que ele está se movendo.
Por exemplo: A cobra esta se movendo para a direita e subtamente vai para a esquerda, sem fazer curvas. */
const validMove = (move) => (state) =>
  /* Para saber se o movimento é válido é aproveitado que os movimentos: NORTH, SOUTH, EAST e WEST possuem
  valores para o eixo X e Y; isso quer dizer que caso a cobra queira ir subtamente da esquerda para a direita
  (EAST para WEST) isso pode ser representado como: -1 + 1 que irá resultar em 0.
  Logo, caso o proximo movimento + movimento atual resulte em 0 em algum dos sentidos, o movimento é inválido.*/
  state.moves[0].x + move.x != 0 || state.moves[0].y + move.y != 0;

// Próximos valores baseados no estado atual

/* Função que recebe o estado atual e verifica se a lista de movimentos é maior que 1, caso seja,
  substitue o primeiro movimento pelo novo na lista de movimentos*/
const nextMoves = (state) =>
  state.moves.length > 1 ? dropFirst(state.moves) : state.moves;
const nextWall = (state) =>
  willEatAppleEsp(state)
    ? { color: "rgba(172, 167, 170, 0.8)", active: false }
    : willEat(state) && !state.walls.active
    ? { color: "rgba(172, 167, 170, 1)", active: true }
    : state.walls;
/*Função que usa "willEat" para verificar se a cobra irá comer a maçã no próximo update, se a resposta
for true, a posição da maçã irá mudar usando a função "rndPos"; se a reposta for false 
a maçã permanece onde esta*/
const nextApple = (state) => (willEat(state) ? rndPos(state) : state.apple);
const nextAppleEspecial = (state) =>
  willEatAppleEsp(state) && state.walls.active
    ? { x: -1, y: -1 }
    : !state.walls.active && willEat(state)
    ? rndPos(state)
    : state.appleEspecial;
const nextPoison = (state) =>
  willEatPoison(state) ? rndPos(state) : state.poison;
const nextPoison2 = (state) =>
  willEatPoison(state) ? rndPos(state) : state.poison2;
const nextPoison3 = (state) =>
  willEatPoison(state) ? rndPos(state) : state.poison3;
/* Função que primeiro verifica se o tamanho da cobra é 0, caso seja, isso significa que o jogo
acabou de começar ou que a cobra colidiu consigo mesma e o jogo deve recomeçar, por isso 
ela retorna as posições iniciais da cobra no plano cartesiano.
Caso o tamanho  da cobra não seja 0, a função simplesmente retorna a p´roxima posicção da cabeça da cobra
baseado no movimento dela. */
const nextHead = (state) =>
  state.snake.length == 0
    ? { x: 5, y: 6 }
    : {
        x: mod(state.cols)(state.snake[0].x + state.moves[0].x),
        y: mod(state.rows)(state.snake[0].y + state.moves[0].y),
      };
/*Função que usa "willCrash" para verificar se a cobra colidiu consigo mesma, caso não, usa a função 
  "willEat" para verificar se a cobra irá comer a maçã e adciona a nova cabeça,ou não, usando a função
  "nextHead".*/
const nextSnake = (state) =>
  willCrash(state) ||
  willEatPoison(state) ||
  (state.walls.active && willCrashWall(nextHead(state)))
    ? []
    : willEat(state)
    ? [nextHead(state)].concat(state.snake)
    : [nextHead(state)].concat(dropLast(state.snake));

// Aleatoriedade
// Função que define uma posição aleatoria no plano cartesiano para determinado objeto
/* Como exemplo, para a função ser criada foi utilizado o Currying e Closure, 
ou seja, a Avalição Tardia, onde a função pega os parâmetros do arquivo 
e já sabe o que executar para ganhar tempo dando entrada em parâmetros separados. */
const rndPos = (table) => ({
  x: rnd(0)(table.cols - 1),
  y: rnd(0)(table.rows - 2),
});

// Estado inicial
/*Função que define como o jogo irá se comportar em seu estado inicial*/
const initialState = () => ({
  cols: 20,
  rows: 14,
  moves: [EAST],
  snake: [],
  apple: { x: 16, y: 2 },
  poison: { x: 12, y: 3 },
  poison2: { x: 3, y: 6 },
  poison3: { x: 8, y: 10 },
  appleEspecial: { x: 8, y: 12 },
  walls: { color: "rgba(172, 167, 170, 1)", active: true },
});


/* Função que define como será o estado do jogo no proximo Update*/
const next = spec({
  rows: prop("rows"),
  cols: prop("cols"),
  moves: nextMoves,
  snake: nextSnake,
  apple: nextApple,
  poison: nextPoison,
  poison2: nextPoison2,
  poison3: nextPoison3,
  appleEspecial: nextAppleEspecial,
  walls: nextWall,
});

const enqueue = (state, move) =>
  validMove(move)(state)
    ? merge(state)({ moves: state.moves.concat([move]) })
    : state;

module.exports = { EAST, NORTH, SOUTH, WEST, initialState, enqueue, next };
