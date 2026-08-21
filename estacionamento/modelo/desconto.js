//classe abstrata para descontos

class Desconto {
    calcular() {
        throw new Error("Método abstrato.");
    }
}

//classe cliente frequente, que recebe 20% de desconto no valor da cobrança
class ClienteFrequente extends Desconto {
    calcular(valor) {
        return valor * 0.2;
    }
}

// Exportando as classes para uso em outros módulos

export {
    Desconto,
    ClienteFrequente
};