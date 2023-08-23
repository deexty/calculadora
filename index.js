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
    botaoAtual.addEventListener("click", (e) => {
        verificaValores(e.target.value)
    })
})

function handleKeyDown(event) {
    if (event.key) {
      verificaValores(event.key)
    }
  }
  
  // Adiciona um listener de evento de teclado ao documento
  document.addEventListener("keydown", handleKeyDown);

function reset() {
    numeroAtual = null
    numeroAntigo = null
    operadorAtual = null
    resultado = null
    alteraDisplay("0");
    historicoAtual = []
    localStorage.clear()
    atualizaHistorico()
    botoes.forEach(botaoAtual => botaoAtual.blur())
}

function verificaValores(e) {
    let valorAtual = e;
    if(valorAtual >= "0" && valorAtual <= "9"){
        adicionaNumero(valorAtual)
    }

    switch(valorAtual){
        case "-":
            /*
            if(!numeroAtual){
                numeroAtual = "-"
                alteraDisplay("-")
                break
            }
            */
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
            }else{
                if(operadorAtual){
                    executaOperacao()
                    operadorAtual = valorAtual;
                    console.log(resultado);
                }
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
            numeroAtual = (numeroAtual / 100).toFixed(2)
            alteraDisplay(numeroAtual)
            break
        case "=":
            executaOperacao()
            historicoAtual.push("=" + resultado.toString())
            atualizaHistorico()
            break
        case "#=":
            if(resultado && !numeroAtual){
                let preCalculo = eval(`${resultado}${operadorAtual}${numeroAntigo}`).toFixed(2)
                historicoAtual.push(operadorAtual+ numeroAntigo.toString())
                console.log(historicoAtual);
                atualizaHistorico()
                resultado = preCalculo;
                numeroAtual = ""
                alteraDisplay(resultado)}
                else{
                    executaOperacao()
                }
            break
        /* teclado */
        case "Enter":
            window.focus()
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
                    let preCalculo = eval(`${numeroAntigo}${operadorAtual}${numeroAtual}`).toFixed(2)
                    resultado = preCalculo;
                    
                    historicoAtual.push(numeroAntigo.toString(),operadorAtual + numeroAtual.toString())
                    atualizaHistorico()
                    console.log(historicoAtual);
                    
                    numeroAntigo = numeroAtual;
                    numeroAtual = ""
                    alteraDisplay(resultado)
                }else{
                    let preCalculo = eval(`${resultado}${operadorAtual}${numeroAtual}`)
                    
                    resultado = preCalculo.toFixed(2);
                    
                    historicoAtual.push(operadorAtual+ numeroAtual.toString())
                    atualizaHistorico()
                    numeroAntigo = numeroAtual
                    alteraDisplay(resultado)
                    numeroAtual = ""
                }
                break;
        }
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

    historicoListaElemento.scrollTop = historicoListaElemento.scrollHeight;
    
    localStorage.setItem("historicoLocal", JSON.stringify(historicoAtual))
}
