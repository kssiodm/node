// Classe base para descontos
class Desconto {
    calcular(valor) {
        throw new Error("Método abstrato.");
    }
}

// Classe para desconto de 0% (sem desconto)
class SemDesconto extends Desconto {
    calcular(valor) {
        return valor;
    }
}


// Classe para desconto percentual
class DescontoPercentual extends Desconto {
    constructor(porcentagem) {
        super();
        this.porcentagem = porcentagem; // ex: 0.20 para 20%
    }

    calcular(valor) {
        return valor - (valor * this.porcentagem);
    }
}

// Exportando as classes para uso em outros módulos
export { Desconto, SemDesconto, DescontoPercentual };