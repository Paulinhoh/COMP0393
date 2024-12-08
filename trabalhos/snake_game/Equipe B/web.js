const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
//elemento HTML para mostrar a pontuação
const score = document.getElementById(`scorePoints`)


// Estado é mutável

/* "state" será uma variável que, ira receber o estado inicial do jogo, como: em que posição a maçã e a cobra
irão iniciar, para qual direção a cobra deverá andar quando o jogo iniciar, etc. 
Tudo isso está definido em "initialState()"que se encontra no arquivo "snake.js".
A medida que o jogo for atualizando o state também irá mudar.*/

/* Esse estado não é utilizado no paradigma funcional, 
pois ela permite que seu estado se mude de acordo com as ações que for passada.
O paradigma funcional utiliza o estado const, que determina uma CONSTANTE que não pode ser alterada.*/
let state = initialState()

// Posicionamento
/*A tela pode ser vista como um plano cartesiano contendo coordenadas nox exios "x" e "y"
estas constantes definem onde determinado objeto se encontra nos eixos da tela.*/
const x = c => Math.round(c * canvas.width / state.cols)
const y = r => Math.round(r * canvas.height / state.rows)
//pontuação
const totalPontos = painel => tamanho => (peso = 25) => painel.innerText = (tamanho.snake.length-1)*peso
// Desenho do laço do jogo
/*Função encarregada de desenhar os objetos na tela*/

// Desenho do laço do jogo
const draw = () => {
  // limpa
  /* "Pinta" a tela com uma cor mais escura próxima do preto */
  ctx.fillStyle = '#232323' // Cor da tela definida em hexadecimal
  ctx.fillRect(0, 0, canvas.width, canvas.height) // Preenche a área da tela com a cor definida acima

  // desenha cobra
  ctx.fillStyle = 'rgb(0,200,50)' // Cor da cobra definida em RGB 
  state.snake.map(p => ctx.fillRect(x(p.x), y(p.y), x(1), y(1))) // Preenche cada parte da cobra com a cor definida acima

  // desenha maçãs
  ctx.fillStyle = 'rgb(255,0,0)'  // Cor da maçã definida em RGB
  ctx.fillRect(x(state.apple.x), y(state.apple.y), x(1), y(1)) // Preenche o quadrado que representa a maçã com a cor definida acima

  // desenha maçãs envenenadas
  ctx.fillStyle = 'rgb(75,0,130)' // Cor do veneno definida em RGB
  ctx.fillRect(x(state.poison.x), y(state.poison.y), x(1), y(1)) // Preenche o quadrado que representa o veneno com a cor definida acima
  ctx.fillRect(x(state.poison2.x), y(state.poison2.y), x(1), y(1))
  ctx.fillRect(x(state.poison3.x), y(state.poison3.y), x(1), y(1))
  
  //adiciona paredes
  ctx.fillStyle = state.walls.color;
  ctx.fillRect(x(0), y(0), x(1), y(5));
  ctx.fillRect(x(0), y(0), x(5), y(1));

  ctx.fillRect(x(19), y(0), x(1), y(5));
  ctx.fillRect(x(15), y(0), x(5), y(1));

  ctx.fillRect(x(19), y(9), x(1), y(5));
  ctx.fillRect(x(15), y(13), x(5), y(1));

  ctx.fillRect(x(0), y(9), x(1), y(5));
  ctx.fillRect(x(0), y(13), x(5), y(1));

  // desenha maçãs especiais
  ctx.fillStyle = "yellow";
  ctx.fillRect(x(state.appleEspecial.x), y(state.appleEspecial.y), x(1), y(1));


// adiciona choque
  /* Caso o tamanho da cobra seja 0 (lembre-se que a cobra em si é um array) então um flash 
 vermelho deverá preencher toda a tela, isso por consequência, faz com que não só quando a cobra se choque 
 a tela fica vermelha mas também quando o jogo se inicia*/
 if (state.snake.length == 0) {
  ctx.fillStyle = 'rgb(255,0,0)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}
//pontuação do jogo
totalPontos(score)(state)()

}

// Eventos do teclado

/*O método "window.addEventListener" me permite registrar ações do usuário.
Neste caso, quero verificar se o usuário pressionou algumas teclas especícicas, caso sim,
o estado do jogo será alterado, conforme a tecla pressionada.*/
window.addEventListener('keydown', e => {
    switch (e.key) {
      /*Primeiro é verificado se a tecla pressionada pelo usuário é alguma das teclas mencionadas nos casos abaixo. 
      Caso sim, a variável state deverá, ser alterada. Por exemplo: o usuário pressionou a tecla "w", neste caso o 
      estado do jogo irá receber "enqueue(state, NORTH)" esta função irá verificar se esse movimento é válido e caso seja 
      a cobra irá se mover para o norte(para cima), caso o movimento não seja válido o estado permanece o mesmo.*/
      case 'w': case 'h': case 'ArrowUp':    state = enqueue(state, NORTH); break
      case 'a': case 'j': case 'ArrowLeft':  state = enqueue(state, WEST);  break
      case 's': case 'k': case 'ArrowDown':  state = enqueue(state, SOUTH); break
      case 'd': case 'l': case 'ArrowRight': state = enqueue(state, EAST);  break
    }
  })

/**
 * LAÇO PRINCIPAL DO JOGO
 */
 /* A função "step()" irá receber um tempo inicial(t1) e vai verificar quanto tempo se passou desde a 
 ultima vez que o o tempo inicial foi declarado*/
 /* O princípio da recursividade é utilizado nessa função, repetindo os passos da função dentro dela mesmo. */
const step = t1 => t2 => {
  /* Se o tempo que se passou(t2 - t1) for maior que 100 milisegundos, deverá ser feito:*/
  if (t2 - t1 > 100) {
    /*O estado do jogo será alterado de seu estado inicial para o próximo, usando a função "next()"
    que está definida em "snake.js", essa função faz um update no movimento da cobra,
    a posição da maçã e da cobra em si e recebe como parametro o estado anterior do jogo.*/
    state = next(state)
    draw() // Após o estado do jogo ser atualizado, tudo será desenhado na tela
    window.requestAnimationFrame(step(t2)) // Uma nova animação será feita, dessa vez o tempo inicial usado será o t2(tempo final da ultima atualização)
    /*Caso o tempo decorrido desde a ultima atualização seja menor que 100 milisegundos, nenhuma atualização 
    no estado do jogo deverá ser feita e o método "window.requestAnimationFrame" deverá ser chamado novamente*/
  } else {
    window.requestAnimationFrame(step(t1))
  }
}
//*Inicia todo o processo*//

// Desenha os abjetos na tela
draw(); /* O método "window.requestAnimationFrame" diz ao navegador que você quer fazer uma animação e pede ao navegador para chamar a 
função step(), já que é ela que irá controlar se deve ser desenhado um novo quadro ou não.*/
window.requestAnimationFrame(step(0))