
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
    if (!placa) return false;
    const placaLimpa = placa.trim().toUpperCase();
    return Array.from(this.placas).some(p => p.trim().toUpperCase() === placaLimpa);
    }

    calcularCobranca(horas) {
        throw new Error("Método abstrato deve ser implementado nas subclasses.");
    }
}

// Subclasses para tipos específicos de clientes
class ClienteAvulso extends Cliente {
    constructor(placa) {
        super(placa, "Cliente Avulso");
        this.adicionarPlaca(placa);
        this.bloqueado = false;
    }

    calcularCobranca(horas = 1) {
        const VALOR_HORA = 5.00;
        const VALOR_DIARIA = 20.00;

        // Se passar de 4 horas, cobra o valor fixo da diária
        if (horas >= 4) {
            return VALOR_DIARIA;
        }
        return horas * VALOR_HORA;
    }
}

// Subclasse para Professor

class Professor extends Cliente {
    constructor(cpf, nome) {
        super(cpf, nome);
    }

    adicionarPlaca(placa) {
        if (this.placas.size >= 2) {
            throw new Error("Professores podem cadastrar no máximo 2 veículos.");
        }
        super.adicionarPlaca(placa);
    }

    calcularCobranca(horas) {
        return 0.00; // Isento conforme regra de negócio
    }
}

// Subclasse para Estudante
class Estudante extends Cliente {
    constructor(cpf, nome, saldo = 0) {
        super(cpf, nome);
        this.saldo = saldo;
    }

    adicionarPlaca(placa) {
        if (this.placas.size >= 1) {
            throw new Error("Estudantes podem cadastrar no máximo 1 veículo.");
        }
        super.adicionarPlaca(placa);
    }

    carregarSaldo(valor) {
        if (valor <= 0) throw new Error("Valor de recarga deve ser positivo.");
        this.saldo += valor;
    }

    calcularCobranca(horas) {
        const TARIFA_ESTUDANTE = 10.00;

        if (this.saldo < TARIFA_ESTUDANTE) {
            throw new Error(`Saldo insuficiente (R$ ${this.saldo.toFixed(2)}). Necessário R$ ${TARIFA_ESTUDANTE.toFixed(2)}.`);
        }

        this.saldo -= TARIFA_ESTUDANTE;
        return TARIFA_ESTUDANTE;
    }
}

// Subclasse para Empresa
class Empresa extends Cliente {
    constructor(cnpj, nome) {
        super(cnpj, nome);
        this.debito = 0.00;
        this.inadimplente = false;
    }

    calcularCobranca(horas) {
        if (this.inadimplente) {
            throw new Error(`Empresa ${this.nome} está inadimplente. Cobrança bloqueada.`);
        }

        const VALOR_DIARIA = 20.00;
        this.debito += VALOR_DIARIA;
        return VALOR_DIARIA;
    }

    pagarFatura(valor) {
        this.debito -= valor;
        if (this.debito <= 0) {
            this.debito = 0;
            this.inadimplente = false;
        }
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