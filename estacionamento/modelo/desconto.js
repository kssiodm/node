// modelo/desconto.js
class Desconto {
    calcular(valor) {
        throw new Error("Método abstrato.");
    }
}

class SemDesconto extends Desconto {
    calcular(valor) {
        return valor;
    }
}

class DescontoPercentual extends Desconto {
    constructor(porcentagem) {
        super();
        this.porcentagem = porcentagem; // ex: 0.20 para 20%
    }

    calcular(valor) {
        return valor - (valor * this.porcentagem);
    }
}

export { Desconto, SemDesconto, DescontoPercentual };