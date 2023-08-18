const botoes = document.querySelectorAll(".botao")
const display = document.getElementById("display")

let numeroAtual = null
let numeroAntigo = null
let operadorAtual = null
let resultado = null

botoes.forEach(botaoAtual => {
    botaoAtual.addEventListener("click", verificaValores)
})

function reset() {
    numeroAtual = null
    numeroAntigo = null
    operadorAtual = null
    resultado = null
    alteraDisplay("0");
}

function verificaValores(e) {
    let valorAtual = e.target.value;
    if(valorAtual >= "0" && valorAtual <= "9"){
        adicionaNumero(valorAtual)
    }

    switch(valorAtual){
        case "-":
        case "/":
        case "*":
        case "+":
            if(!numeroAtual || !numeroAntigo){
                operadorAtual = valorAtual;
                if(!numeroAntigo){
                    numeroAntigo = numeroAtual
                }
                numeroAtual = null
                alteraDisplay("0")
            }
            break;
        case ".":
            if(!numeroAtual.includes(".")){
                numeroAtual = numeroAtual + valorAtual;
                alteraDisplay(numeroAtual)
            }
            break
        case "c":
            numeroAtual = null
            alteraDisplay("0")
            break
        case "ce":
            reset()
            break
        case "%":
            numeroAtual = numeroAtual / 100
            alteraDisplay(numeroAtual)
            break
        case "=":
            executaOperacao()
            break
    }
}

function adicionaNumero(numero) {
    if(!numeroAtual){
        numeroAtual = numero;
        alteraDisplay(numeroAtual)
    }else{
        numeroAtual += numero
        alteraDisplay(numeroAtual)
    }
}

function executaOperacao() {
    if(numeroAntigo && numeroAtual && operadorAtual){
        switch(operadorAtual){
            case "-":
            case "/":
            case "*":
            case "+":
                if(!resultado){
                    let preCalculo = eval(`${numeroAntigo}${operadorAtual}${numeroAtual}`)
                    resultado = preCalculo;
                    numeroAntigo = numeroAtual;
                    numeroAtual = ""
                    alteraDisplay(resultado)
                }else{
                    let preCalculo = eval(`${resultado}${operadorAtual}${numeroAtual}`)
                    resultado = preCalculo;
                    numeroAntigo = numeroAtual;
                    numeroAtual = ""
                    alteraDisplay(resultado)
                }
                break;
        }
    }else if(resultado && !numeroAtual){
        let preCalculo = eval(`${resultado}${operadorAtual}${numeroAntigo}`)
        resultado = preCalculo;
        numeroAtual = ""
        alteraDisplay(resultado)
    }
}

function alteraDisplay(valor) {
    display.textContent = valor;
}