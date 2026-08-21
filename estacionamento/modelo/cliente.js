//classe base para todos os tipos de clientes

class Cliente {
    constructor(id, nome) {
        this.id = id;
        this.nome = nome;
        this.placas = new Set();
    }

    adicionarPlaca(placa) {
        this.placas.add(placa);
    }

    removerPlaca(placa) {
        this.placas.delete(placa);
    }

    possuiPlaca(placa) {
        return this.placas.has(placa);
    }

    // Agora aceita horas
    calcularCobranca(horas) {
        throw new Error("Método abstrato.");
    }
}

// Subclasses para tipos específicos de clientes
//classe cliente avulso, que paga por hora ou diária
class ClienteAvulso extends Cliente {
    constructor(placa) {
        super(placa, "Cliente Avulso");
        this.adicionarPlaca(placa); // Adiciona a própria placa como identificador
        this.bloqueado = false;
    }

    calcularCobranca(horas = 1) {
        const VALOR_HORA = 5;
        const DIARIA = 20;

        if (horas > 6) {
            return DIARIA;
        }

        return horas * VALOR_HORA;
    }
}

//classe professor, que pode cadastrar até dois veículos e não paga estacionamento
class Professor extends Cliente {
    constructor(cpf, nome) {
        super(cpf, nome);
    }

    adicionarPlaca(placa) {
        if (this.placas.size >= 2) {
            throw new Error("Um professor pode cadastrar apenas dois veículos.");
        }
        super.adicionarPlaca(placa);
    }

    calcularCobranca(horas) {
        return 0; // Professores são isentos
    }
}

//classe estudante, que pode cadastrar apenas um veículo e paga uma taxa fixa de R$ 10,00 por entrada
class Estudante extends Cliente {
    constructor(cpf, nome, saldo = 0) {
        super(cpf, nome);
        this.saldo = saldo;
    }

    adicionarPlaca(placa) {
        if (this.placas.size >= 1) {
            throw new Error("O estudante pode cadastrar apenas um veículo.");
        }
        super.adicionarPlaca(placa);
    }

    carregarSaldo(valor) {
        this.saldo += valor;
    }

    calcularCobranca(horas) {
        const INGRESSO = 10;
        
        if (this.saldo < INGRESSO) {
            throw new Error(`Saldo insuficiente para o estudante ${this.nome}. Saldo atual: R$ ${this.saldo}`);
        }

        this.saldo -= INGRESSO;
        return INGRESSO;
    }
}

//classe empresa, que pode cadastrar até cinco veículos e paga uma taxa fixa de R$ 20,00 por entrada
class Empresa extends Cliente {
    constructor(cnpj, nome) {
        super(cnpj, nome);
        this.debito = 0;
        this.inadimplente = false;
    }

    calcularCobranca(horas) {
        const DIARIA = 20;
        this.debito += DIARIA;
        return DIARIA;
    }

    emitirBoleto() {
        return this.debito;
    }
}

// Exportando as classes para uso em outros módulos

export {
    Cliente,
    ClienteAvulso,
    Professor,
    Estudante,
    Empresa
};