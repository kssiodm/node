// estacionamento/modelo/estacionamento.js

import { ClienteAvulso } from './cliente.js';


// Classe para representar um veículo
class Veiculo {
    constructor(placa) {
        this.placa = placa;
    }
}

// Classe para representar um registro de estacionamento

class RegistroEstacionamento {
    constructor(placa, cliente, entrada) {
        this.placa = placa;
        this.cliente = cliente;
        this.entrada = entrada;
        this.saida = null;
        this.valor = 0.00;
        this.desconto = 0.00;
        this.valorPago = 0.00;
    }

    encerrar(saida, valor, desconto = 0) {
        this.saida = saida;
        this.valor = valor;
        this.desconto = desconto;
        this.valorPago = Math.max(0, valor - desconto);
    }
}

// Classe principal do estacionamento

class Estacionamento {
    constructor() {
        this.capacidade = 9000;
        this.veiculosAtivos = new Map();
        this.clientes = new Map();
        this.historicoRegistros = []; // Guarda todos os registros finalizados
        this.veiculosBloqueados = new Set();
    }

    registrarCliente(cliente) {
        this.clientes.set(cliente.id, cliente);
    }

    bloquearVeiculo(placa) {
        this.veiculosBloqueados.add(placa);
    }

    desbloquearVeiculo(placa) {
        this.veiculosBloqueados.delete(placa);
    }

    buscarClientePorPlaca(placa) {
        for (const cliente of this.clientes.values()) {
            if (cliente.possuiPlaca(placa)) {
                return cliente;
            }
        }
        return null;
    }

    entrada(placa) {
        // 1. Checagem de Lotação
        if (this.veiculosAtivos.size >= this.capacidade) {
            throw new Error("Estacionamento lotado (9.000 vagas ocupadas).");
        }

        // 2. Checagem se já está no estacionamento
        if (this.veiculosAtivos.has(placa)) {
            throw new Error(`Veículo ${placa} já se encontra estacionado.`);
        }

        // 3. Checagem de Veículo Bloqueado
        if (this.veiculosBloqueados.has(placa)) {
            throw new Error(`Acesso negado: O veículo ${placa} está na lista de bloqueados.`);
        }

        // 4. Identificação do Cliente
        let cliente = this.buscarClientePorPlaca(placa);
        if (!cliente) {
            cliente = new ClienteAvulso(placa);
        }

        // 5. Checagem de Inadimplência da Empresa
        if (cliente.inadimplente) {
            throw new Error(`Acesso negado: Cliente ${cliente.nome} possui pendências financeiras.`);
        }

        const registro = new RegistroEstacionamento(placa, cliente, new Date());
        this.veiculosAtivos.set(placa, registro);
        return registro;
    }

    saida(placa) {
        const registro = this.veiculosAtivos.get(placa);

        if (!registro) {
            throw new Error(`Veículo ${placa} não encontrado entre os veículos ativos.`);
        }

        const dataSaida = new Date();
        const diferencaMs = dataSaida.getTime() - registro.entrada.getTime();
        
        // Calcula horas (mínimo de 1 hora)
        const horasPermanencia = Math.max(1, Math.ceil(diferencaMs / (1000 * 60 * 60)));

        // Processa a cobrança de acordo com o tipo de cliente
        const valorCalculado = registro.cliente.calcularCobranca(horasPermanencia);

        registro.encerrar(dataSaida, valorCalculado);

        // Remove dos ativos e insere no histórico
        this.veiculosAtivos.delete(placa);
        this.historicoRegistros.push(registro);

        return registro;
    }
}

// Exportando as classes para uso em outros módulos

export {
    Veiculo,
    RegistroEstacionamento,
    Estacionamento
};