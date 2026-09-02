export class GeradorRelatorios {
    constructor(estacionamento) {
        this.estacionamento = estacionamento;
    }

    // Relatório 1: Valor total arrecadado por categoria
    arrecadacaoPorCategoria() {
        const totais = { Professor: 0, Estudante: 0, Empresa: 0, ClienteAvulso: 0 };

        for (const reg of this.estacionamento.historicoRegistros) {
            const categoria = reg.cliente.constructor.name;
            totais[categoria] = (totais[categoria] || 0) + reg.valorPago;
        }

        console.log("\n📊 --- ARRECADAÇÃO POR CATEGORIA DE CLIENTE ---");
        Object.entries(totais).forEach(([cat, valor]) => {
            console.log(`${cat}: R$ ${valor.toFixed(2)}`);
        });
    }

    // Relatório 2: Situação de um cliente cadastrado
    situacaoCliente(idOuCpf) {
        const cliente = this.estacionamento.clientes.get(idOuCpf);
        if (!cliente) {
            console.log("❌ Cliente não localizado.");
            return;
        }

        console.log(`\n📋 --- SITUAÇÃO DO CLIENTE: ${cliente.nome} ---`);
        console.log(`ID/CPF/CNPJ: ${cliente.id}`);
        console.log(`Tipo: ${cliente.constructor.name}`);
        console.log(`Placas: ${Array.from(cliente.placas).join(', ')}`);
        if (cliente.saldo !== undefined) console.log(`Saldo Atual: R$ ${cliente.saldo.toFixed(2)}`);
        if (cliente.debito !== undefined) console.log(`Débito Atual: R$ ${cliente.debito.toFixed(2)}`);
        if (cliente.inadimplente !== undefined) console.log(`Inadimplente: ${cliente.inadimplente ? 'SIM' : 'NÃO'}`);
    }

    // Relatório 3: Registros de cliente cadastrado por período
    registrosClienteCadastrado(id, dataInicio, dataFim) {
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);

        const filtrados = this.estacionamento.historicoRegistros.filter(reg => 
            reg.cliente && reg.cliente.id === id && reg.entrada >= inicio && reg.entrada <= fim
        );

        console.log(`\n📅 --- REGISTROS DO CLIENTE ${id} NO PERÍODO ---`);
        filtrados.forEach(r => console.log(`Placa: ${r.placa} | Entrada: ${r.entrada.toLocaleString()} | Valor: R$ ${r.valorPago.toFixed(2)}`));
    }

    // Relatório 4: Registros de clientes não cadastrados (Avulsos) por período
    registrosClientesAvulsos(dataInicio, dataFim) {
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);

        const filtrados = this.estacionamento.historicoRegistros.filter(reg => 
            reg.cliente.constructor.name === 'ClienteAvulso' && reg.entrada >= inicio && reg.entrada <= fim
        );

        console.log(`\n🚗 --- REGISTROS DE CLIENTES AVULSOS NO PERÍODO ---`);
        filtrados.forEach(r => console.log(`Placa: ${r.placa} | Entrada: ${r.entrada.toLocaleString()} | Valor: R$ ${r.valorPago.toFixed(2)}`));
    }

    // Relatório 5: Clientes impedidos de entrar no estacionamento
    clientesImpedidos() {
        console.log("\n🚫 --- RELAÇÃO DE CLIENTES/VEÍCULOS IMPEDIDOS ---");
        
        console.log("Empresas Inadimplentes:");
        for (const cliente of this.estacionamento.clientes.values()) {
            if (cliente.inadimplente) console.log(`- ${cliente.nome} (CNPJ: ${cliente.id})`);
        }

        console.log("\nPlacas Bloqueadas:");
        this.estacionamento.veiculosBloqueados.forEach(placa => console.log(`- Placa: ${placa}`));
    }

    // Relatório 6: Top 10 clientes mais frequentes do ano
    top10ClientesMaisFrequentes(ano) {
        const contagem = new Map();

        for (const reg of this.estacionamento.historicoRegistros) {
            if (reg.entrada.getFullYear() === ano && reg.cliente.id !== 'AVULSO') {
                const id = reg.cliente.id;
                contagem.set(id, (contagem.get(id) || 0) + 1);
            }
        }

        const ordenados = [...contagem.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        console.log(`\n🏆 --- TOP 10 CLIENTES MAIS FREQUENTES DE ${ano} ---`);
        ordenados.forEach(([id, freq], index) => {
            const cliente = this.estacionamento.clientes.get(id);
            console.log(`${index + 1}º - ${cliente ? cliente.nome : id}: ${freq} acessos`);
        });
    }
}