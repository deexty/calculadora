const botoes = document.querySelectorAll(".botao")
const display = document.getElementById("display")
const botaoImpressao = document.getElementById("botaoImpressao")

botaoImpressao.addEventListener("click", () => window.print())

let numeroAtual = null
let numeroAntigo = null
let operadorAtual = null
let resultado = null

let historicoLocal = JSON.parse(localStorage.getItem("historicoLocal"))
let historicoAtual = historicoLocal ? historicoLocal : [];

atualizaHistorico()

botoes.forEach(botaoAtual => {
    botaoAtual.addEventListener("click", (e) => verificaValores(e.target.value))
})


document.addEventListener("keydown", (e) => {
    console.log(e.key);
    verificaValores(e.key)
})

function reset() {
    numeroAtual = null
    numeroAntigo = null
    operadorAtual = null
    resultado = null
    alteraDisplay("0");
    historicoAtual = []
    localStorage.clear()
    atualizaHistorico()
}

function verificaValores(e) {
    let valorAtual = e;
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
        case "#=":
            historicoAtual.push("=" + resultado.toString())
            atualizaHistorico()
            break

        /* teclado */
        case "Enter":
            executaOperacao()
            break
        case " ":
            reset()
            break
        case ",":
            if(!numeroAtual.includes(".")){
                numeroAtual = numeroAtual + ".";
                alteraDisplay(numeroAtual)
            }
            break
        case "Backspace":
            if(numeroAtual && numeroAtual.length > 1){
                let novaString = numeroAtual.slice(0, -1);
                numeroAtual = novaString
                alteraDisplay(novaString)
            }else{
                numeroAtual = null
                alteraDisplay("0")
            }
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
                    
                    historicoAtual.push(numeroAntigo.toString(),operadorAtual + numeroAtual.toString())
                    atualizaHistorico()
                    console.log(historicoAtual);
                    
                    numeroAntigo = numeroAtual;
                    numeroAtual = ""
                    alteraDisplay(resultado)
                }else{
                    let preCalculo = eval(`${resultado}${operadorAtual}${numeroAtual}`)

                    historicoAtual.push(resultado.toString(),operadorAtual+ numeroAtual.toString())
                    console.log(historicoAtual);
                    atualizaHistorico()

                    resultado = preCalculo;
                    numeroAntigo = numeroAtual;
                    numeroAtual = ""
                    alteraDisplay(resultado)
                }
                break;
        }
    }else if(resultado && !numeroAtual){
        let preCalculo = eval(`${resultado}${operadorAtual}${numeroAntigo}`)
        historicoAtual.push(resultado.toString(),operadorAtual+ numeroAntigo.toString())
        console.log(historicoAtual);
        atualizaHistorico()
        resultado = preCalculo;
        numeroAtual = ""
        alteraDisplay(resultado)
    }
}

function alteraDisplay(valor) {
    display.textContent = valor;
}

function atualizaHistorico() {
    let historyContainer = document.querySelector(".historyContainer");
    let historicoListaElemento = historyContainer.querySelector("ul");
    
    historicoListaElemento.innerHTML = ""
    historicoAtual.forEach(itemHistorico => {
        historicoListaElemento.innerHTML += `
            <li>${itemHistorico}</li>
        `
    });
    
    localStorage.setItem("historicoLocal", JSON.stringify(historicoAtual))
}