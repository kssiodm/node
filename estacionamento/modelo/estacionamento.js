// Importando a classe ClienteAvulso do módulo cliente.js

import { ClienteAvulso } from './cliente.js';

//classe Veiculo, que representa um veículo com uma placa
class Veiculo {
    constructor(placa) {
        this.placa = placa;
    }
}

//classe RegistroEstacionamento, que representa o registro de entrada e saída de um veículo no estacionamento
class RegistroEstacionamento {
    constructor(placa, cliente, entrada) {
        this.placa = placa;
        this.cliente = cliente;
        this.entrada = entrada;
        this.saida = null;
        this.valor = 0;
        this.desconto = 0;
        this.valorPago = 0;
    }

    encerrar(saida, valor) {
        this.saida = saida;
        this.valor = valor;
        this.valorPago = valor - this.desconto;
    }
}

//classe Estacionamento, que gerencia a entrada e saída de veículos, clientes e registros
class Estacionamento {
    constructor() {
        this.capacidade = 9000;
        this.veiculosAtivos = new Map();
        this.clientes = new Map();
        this.veiculosBloqueados = new Set();
    }

    registrarCliente(cliente) {
        this.clientes.set(cliente.id, cliente);
    }

    // Método para buscar um cliente pelo identificador (CPF, CNPJ ou placa)
    buscarClientePorPlaca(placa) {
        for (const cliente of this.clientes.values()) {
            if (cliente.possuiPlaca(placa)) {
                return cliente;
            }
        }
        return null; // Se não encontrar nenhum cliente com a placa fornecida
    }

    entrada(placa, clienteManual = null) {
        // 1. Validação de capacidade
        if (this.veiculosAtivos.size >= this.capacidade) {
            throw new Error("Estacionamento lotado!");
        }

        // 2. Validação de veículo já presente
        if (this.veiculosAtivos.has(placa)) {
            throw new Error(`O veículo de placa ${placa} já está no estacionamento.`);
        }

        // 3. Validação de bloqueio
        if (this.veiculosBloqueados.has(placa)) {
            throw new Error(`Veículo ${placa} está bloqueado de entrar.`);
        }

        // 4. Determinação do cliente
        let cliente = clienteManual || this.buscarClientePorPlaca(placa);

        // Se não encontrar um cliente, cria um ClienteAvulso
        if (!cliente) {
            cliente = new ClienteAvulso(placa);
        }

        // 5. Validação de inadimplência
        if (cliente.inadimplente) {
            throw new Error(`Entrada recusada: O cliente ${cliente.nome} possui pendências financeiras.`);
        }

        const registro = new RegistroEstacionamento(
            placa,
            cliente,
            new Date()
        );

        this.veiculosAtivos.set(placa, registro);
        return registro;
    }

    saida(placa) {
        const registro = this.veiculosAtivos.get(placa);

        if (!registro) {
            throw new Error(`Veículo de placa ${placa} não foi localizado no estacionamento.`);
        }

        const dataSaida = new Date();

        // Calcula a diferença em milissegundos e converte para horas, arredondando para cima
        const diferencaMs = dataSaida.getTime() - registro.entrada.getTime();
        const horasPermanencia = Math.max(1, Math.ceil(diferencaMs / (1000 * 60 * 60)));

        // Calcula o valor da cobrança com base no tipo de cliente
        const valor = registro.cliente.calcularCobranca(horasPermanencia);

        registro.encerrar(dataSaida, valor);

        // Remove o veículo da lista de ativos
        this.veiculosAtivos.delete(placa);

        return registro;
    }
}

// Exportando as classes para uso em outros módulos

export {
    Veiculo,
    RegistroEstacionamento,
    Estacionamento
};