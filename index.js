let botoes = document.querySelectorAll(".botao");
let historico = document.querySelector(".historico")
let resultado = document.querySelector("#resultado")
let display = document.querySelector("#display")

let input = "";
let calculo = ""

/* funcoes */

function filtraCalculo(calculo) {
    // Remover zeros à esquerda dos números inteiros
    calculo = calculo.replace(/(^|[^0-9.])0+([0-9])/g, '$1$2');
    // Remover operadores aritméticos juntos, mantendo o primeiro
    calculo = calculo.replace(/([\+\-\*\/])([\+\-\*\/]+)/g, '$1');
    // Remover pontos juntos, mantendo o primeiro
    calculo = calculo.replace(/(\.)(\.)+/g, '$1');
    // Remover pontos ao lado de operadores aritméticos
    calculo = calculo.replace(/([\+\-\*\/])\.|\.(?=[\+\-\*\/])/g, '$1');

    
    return calculo;
}

function adicionaCaracter(caracter){
    input = calculo
    if (!input) {
        input = caracter;
    }else{
        input = input + caracter;
    }
    let inputFiltrado = filtraCalculo(input)
    console.log(inputFiltrado);
    atualizaDisplay(inputFiltrado)
    calculo = inputFiltrado;
}

function atualizaDisplay(valor) {
    display.innerHTML = `<p>${valor}</p>`
}

function mostraResultado(calculo) {
    if(calculo.length > 0){
        atualizaDisplay(eval(calculo));
        console.log(resultado
            );
        resultado.innerHTML = `${calculo}`
    }
}

botoes.forEach(botaoAtual => {
    botaoAtual.addEventListener("click", (e) =>{
        console.log(e.target.value);
        switch(e.target.value){
            case "=":
                mostraResultado(input)
                input = eval(calculo).toString();
                calculo = eval(calculo).toString();
                break;
            case "c":
                input = "0";
                calculo = "0";
                resultado.innerHTML = `0`
                atualizaDisplay("0")
                break;
            case "%":
                input = (Number(input) / 100).toString();
                calculo = input;
                atualizaDisplay(input)
                break;
            case "backspace":
                if(input.length > 1){
                    input = input.slice(0, -1)
                    calculo = calculo.slice(0, -1)
                    atualizaDisplay(input)
                }else{
                    input = "0"
                    calculo = "0"
                    atualizaDisplay("0")
                }
                break;
            default:
                adicionaCaracter(e.target.value)
        }
    })
})