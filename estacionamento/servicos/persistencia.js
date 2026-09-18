import fs from 'fs';
import { Professor, Estudante, Empresa, ClienteAvulso } from '../modelo/cliente.js';
import { RegistroEstacionamento } from '../modelo/estacionamento.js';

export class PersistenciaCSV {
    constructor(
        caminhoClientes = './dados/clientes.csv',
        caminhoRegistros = './dados/registros.csv',
        caminhoBloqueados = './dados/bloqueados.csv'
    ) {
        this.caminhoClientes = caminhoClientes;
        this.caminhoRegistros = caminhoRegistros;
        this.caminhoBloqueados = caminhoBloqueados;
    }

    carregarTudo(estacionamento) {
        this.carregarClientes(estacionamento);
        this.carregarBloqueados(estacionamento);
        this.carregarRegistros(estacionamento);
    }

    carregarClientes(estacionamento) {
        if (!fs.existsSync(this.caminhoClientes)) return;
        const conteudo = fs.readFileSync(this.caminhoClientes, 'utf-8');
        const linhas = conteudo.split('\n').filter(l => l.trim() !== '');

        for (let i = 1; i < linhas.length; i++) {
            const [id, nome, tipo, placasStr, saldo, debito, inadimplente] = linhas[i].split(';');
            let cliente;

            if (tipo === 'Professor') cliente = new Professor(id, nome);
            else if (tipo === 'Estudante') cliente = new Estudante(id, nome, parseFloat(saldo) || 0);
            else if (tipo === 'Empresa') {
                cliente = new Empresa(id, nome);
                cliente.debito = parseFloat(debito) || 0;
                cliente.inadimplente = inadimplente === 'true';
            }

            if (cliente) {
                if (placasStr) {
                    placasStr.split(',').forEach(p => p.trim() && cliente.adicionarPlaca(p.trim()));
                }
                estacionamento.registrarCliente(cliente);
            }
        }
    }

    carregarBloqueados(estacionamento) {
        if (!fs.existsSync(this.caminhoBloqueados)) return;
        const conteudo = fs.readFileSync(this.caminhoBloqueados, 'utf-8');
        const linhas = conteudo.split('\n').filter(l => l.trim() !== '');

        for (let i = 1; i < linhas.length; i++) {
            const placa = linhas[i].trim();
            if (placa) estacionamento.bloquearVeiculo(placa);
        }
    }

    carregarRegistros(estacionamento) {
        if (!fs.existsSync(this.caminhoRegistros)) return;
        const conteudo = fs.readFileSync(this.caminhoRegistros, 'utf-8');
        const linhas = conteudo.split('\n').filter(l => l.trim() !== '');

        for (let i = 1; i < linhas.length; i++) {
            const [placa, clienteId, entradaStr, saidaStr, valor, desconto, valorPago, status] = linhas[i].split(';');
            
            if (!placa) continue;

            let cliente = estacionamento.clientes.get(clienteId);
            if (!cliente) {
                cliente = new ClienteAvulso(placa);
            }

            const registro = new RegistroEstacionamento(placa, cliente, new Date(entradaStr));
            registro.valor = parseFloat(valor) || 0;
            registro.desconto = parseFloat(desconto) || 0;
            registro.valorPago = parseFloat(valorPago) || 0;

            if (saidaStr && status === 'CONCLUIDO') {
                registro.saida = new Date(saidaStr);
                estacionamento.historicoRegistros.push(registro);
            } else if (status === 'ATIVO') {
                // Reconstrução dos veículos que ainda estão estacionados na memória
                estacionamento.veiculosAtivos.set(placa, registro);
            }
        }
    }

    salvarTudo(estacionamento) {
        this.salvarClientes(estacionamento);
        this.salvarBloqueados(estacionamento);
        this.salvarRegistros(estacionamento);
    }

    salvarClientes(estacionamento) {
        let conteudo = 'id;nome;tipo;placas;saldo;debito;inadimplente\n';
        for (const cliente of estacionamento.clientes.values()) {
            const tipo = cliente.constructor.name;
            const placas = Array.from(cliente.placas).join(',');
            conteudo += `${cliente.id};${cliente.nome};${tipo};${placas};${cliente.saldo || 0};${cliente.debito || 0};${cliente.inadimplente || false}\n`;
        }
        fs.writeFileSync(this.caminhoClientes, conteudo, 'utf-8');
    }

    salvarBloqueados(estacionamento) {
        let conteudo = 'placa\n';
        for (const placa of estacionamento.veiculosBloqueados) {
            conteudo += `${placa}\n`;
        }
        fs.writeFileSync(this.caminhoBloqueados, conteudo, 'utf-8');
    }

    salvarRegistros(estacionamento) {
        let conteudo = 'placa;clienteId;entrada;saida;valor;desconto;valorPago;status\n';

        // 1. Salva Veículos Ativos (estacionados no momento)
        for (const reg of estacionamento.veiculosAtivos.values()) {
            const clienteId = reg.cliente ? reg.cliente.id : reg.placa;
            const entradaStr = reg.entrada ? reg.entrada.toISOString() : '';
            conteudo += `${reg.placa};${clienteId};${entradaStr};;;;ATIVO\n`;
        }

        // 2. Salva Histórico de Finalizados
        for (const reg of estacionamento.historicoRegistros) {
            const clienteId = reg.cliente ? reg.cliente.id : reg.placa;
            const entradaStr = reg.entrada ? reg.entrada.toISOString() : '';
            const saidaStr = reg.saida ? reg.saida.toISOString() : '';
            conteudo += `${reg.placa};${clienteId};${entradaStr};${saidaStr};${reg.valor};${reg.desconto};${reg.valorPago};CONCLUIDO\n`;
        }

        fs.writeFileSync(this.caminhoRegistros, conteudo, 'utf-8');
    }
}