class Desconto {
    calcular() {
        throw new Error("Método abstrato.");
    }
}

class ClienteFrequente extends Desconto {
    calcular(valor) {
        return valor * 0.2;
    }
}

export {
    Desconto,
    ClienteFrequente
};