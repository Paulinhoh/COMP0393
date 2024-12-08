//Funções de apoio

/* O principal papel da programação FUNCIONAL é a construção de funções
utilizando o formalismo matemático. As funções de apoio utilizam da notação arrow,
 que permite construir uma função em apenas uma linha ( ou mais se preferir ) 
 de forma mais legível e ágil. */

 /* Aqui vemos o uso da função de alta ordem e também função como argumento, 
 onde uma função é passada dentro de outra função para ser executada, 
 retornando novas definições de função. */

 /*A constante de ajuste recebe um valor "n", uma função "f" e uma lista "xs"
  como argumentos e, em seguida, ele chama a função mapi, que então 
  toma como seu primeiro argumento uma condição sob a qual se o argumento "i" 
  é igual ao argumento "n" devolve a função "f(x)", caso contrário devolve x.
  e como a segunda lista de argumentos "xs" */
const adjust    = n => f => xs => mapi(x => i => i == n ? f(x) : x)(xs)

/* O uso da função .slice(), que permite "cortar" a lista fornecida. */
/*A constante dropFirst recebe um parâmetro "xs" que é uma lista, 
após o qual retorna uma cópia desta lista com seu primeiro elemento removido. */
const dropFirst = xs => xs.slice(1)

/*A constante dropLast recebe uma lista como argumento "xs" 
e retorna uma cópia da lista original sem seu último elemento */
const dropLast  = xs => xs.slice(0, xs.length - 1)

/*A constante id recebe um parâmetro "x" e retorna o mesmo parâmetro que o resultado, 
então Reforça o princípio da imutabilidade, pois as constantes funcionarão como 
cópias A partir de uma lista ou valor primitivo, pode ser alterado sem risco. */
const id        = x => x

/*Retorna uma cópia do primeiro argumento a partir de dois outros argumentos: "x" e "y". */
const k         = x => y => x

/* Um exemplo da utilização da função predefinida .map(), 
que permite acessar e modificar uma lista que não possui o princípio da imutabilidade*/
/*A constante map é projetada para receber dois argumentos, o primeiro é outra função
 e o segundo é uma lista, após a qual map aplica esta função "f", passando cada valor 
 da lista "xs", e retorna uma função com o resultado a nova lista. */
const map       = f => xs => xs.map(f)

/*A constante mapi, recebe uma função "f" e uma lista "xs" como parâmetros,
 e aplica a cada valor desta lista, função anônima dentro de .map, que inclui 
 inserir o valor x e i dentro dos respectivos parâmetros da função "f" , 
 e retorna o resultado dessa função com esses novos parâmetros. */
const mapi      = f => xs => xs.map((x, i) => f(x)(i))

/*A constante merge recebe dois parâmetros "o1" e "o2" e passa a função Object.assign, 
Ele copiará o elemento e seus atributos do objeto vazio para "o1" para "o2".
 Como esta função também copia as propriedades do objeto passado como parâmetro, 
 Ao copiar propriedades de um objeto vazio, ele eventualmente cria uma cópia do princípio 
 de garantia Invariância no resto do processo. */
const merge     = o1 => o2 => Object.assign({}, o1, o2)

/*A constante mod recebe um valor "x" e um valor "y" como argumentos e executa
 a divisão e obtenha o restante de "y" e "x" por meio do operador "porcentagem" e adicione 
 o restante ao valor de x Por fim, divida essa soma pelo valor de x e retorne 
 o restante dessa divisão como resultado final por meio do operador "porcentagem".*/
const mod       = x => y => ((y % x) + x) % x

/*A constante objOf recebe o valor "k" d e o valor "v" como parâmetros, 
e retorna Um objeto que converte o valor "k" em uma lista e a associa ao valor "v".*/
const objOf     = k => v => ({ [k]: v })

/*O pipe, ou Pipeline, utilizado para compor funções. 
A composição promove organização de codificação e ajuda na 
promoção da legibilidade da solução de sub-problemas.*/
/*A constante pipe integra duas ou mais funções 
baseado em sua precendencia da esquerda para direita*/
const pipe      = (...fns) => x => [...fns].reduce((acc, f) => f(acc), x)

/*prop constante, destinada a receber um valor "k" e uma lista "o", 
após O valor "k" será usado como índice de busca para o valor da lista "o" 
e a função retornará o resultado é o valor da lista correspondente a esse índice.*/
/* Uma definição simples de função como retorno */
const prop      = k => o => o[k]

/*Se dois valores forem passados, ele retornará uma
 lista de números que diferem uma unidade entre eles. */
const range     = n => m => Array.apply(null, Array(m - n)).map((_, i) => n + i)

/*Como resultado final, a aplicação da função “c” a 
cada elemento da lista gerada por “range(o)(n)”. */
const rep       = c => n => map(k(c))(range(0)(n))

/* Passa dois valores ele retorna um número "x" >= "min" e aproxima "max".*/
/* Essa função utiliza da função predefinida .random, que vem da biblioteca math,
que por sua vez não é pura, pois ela gera um valor aleatório toda vez que executada, 
indo contra o princípio de pureza, que necessita que a constante seja colocada dentro da própria função. */
const rnd       = min => max => Math.floor(Math.random() * max) + min

const spec      = o => x => Object.keys(o)
  .map(k => objOf(k)(o[k](x)))
  /* Um exemplo da utilização da função predefinida .reduce(), 
  que permite reduzir a lista até um único ( ou mais ) elementos. 
  Muitas vezes acompanha a função a ser executada e um acumulador "acc" para contagem.*/
  .reduce((acc, o) => Object.assign(acc, o))

module.exports = { adjust, dropFirst, dropLast, id, k, map, merge, mod, objOf, pipe, prop, range, rep, rnd, spec}
