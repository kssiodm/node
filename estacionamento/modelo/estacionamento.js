import { ClienteAvulso } from './cliente.js';

class Veiculo {
    constructor(placa) {
        this.placa = placa;
    }
}

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

    // Busca qual cliente cadastrado é dono da placa informada
    buscarClientePorPlaca(placa) {
        for (const cliente of this.clientes.values()) {
            if (cliente.possuiPlaca(placa)) {
                return cliente;
            }
        }
        return null; // Não encontrou pré-cadastro
    }

    entrada(placa, clienteManual = null) {
        // 1. Validação de capacidade
        if (this.veiculosAtivos.size >= this.capacidade) {
            throw new Error("Estacionamento lotado!");
        }

        // 2. Validação se o veículo já está dentro do estacionamento
        if (this.veiculosAtivos.has(placa)) {
            throw new Error(`O veículo de placa ${placa} já está no estacionamento.`);
        }

        // 3. Validação de placa bloqueada
        if (this.veiculosBloqueados.has(placa)) {
            throw new Error(`Veículo ${placa} está bloqueado de entrar.`);
        }

        // 4. Identificação do cliente (busca automática por placa se não for passado explicitamente)
        let cliente = clienteManual || this.buscarClientePorPlaca(placa);

        // Se não possui cadastro prévio, vira Cliente Avulso
        if (!cliente) {
            cliente = new ClienteAvulso(placa);
        }

        // 5. Validação de Inadimplência
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

        // Cálculo da permanência em horas (mínimo de 1 hora, arredondando para cima)
        const diferencaMs = dataSaida.getTime() - registro.entrada.getTime();
        const horasPermanencia = Math.max(1, Math.ceil(diferencaMs / (1000 * 60 * 60)));

        // Passa o tempo calculado para o método de cobrança do cliente
        const valor = registro.cliente.calcularCobranca(horasPermanencia);

        registro.encerrar(dataSaida, valor);

        // Remove dos veículos ativos
        this.veiculosAtivos.delete(placa);

        return registro;
    }
}

export {
    Veiculo,
    RegistroEstacionamento,
    Estacionamento
};