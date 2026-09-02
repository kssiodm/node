import fs from 'fs';
import path from 'path';
import { Professor, Estudante, Empresa } from '../modelo/cliente.js';
import { RegistroEstacionamento } from '../modelo/estacionamento.js';


// Classe para persistência de dados em CSV
export class PersistenciaCSV {
    constructor(caminhoClientes = './dados/clientes.csv', caminhoRegistros = './dados/registros.csv') {
        this.caminhoClientes = caminhoClientes;
        this.caminhoRegistros = caminhoRegistros;
    }

    carregarClientes(estacionamento) {
        if (!fs.existsSync(this.caminhoClientes)) return;

        const conteudo = fs.readFileSync(this.caminhoClientes, 'utf-8');
        const linhas = conteudo.split('\n').filter(l => l.trim() !== '');

        // Pula o cabeçalho
        for (let i = 1; i < linhas.length; i++) {
            const [id, nome, tipo, placasStr, saldo, debito, inadimplente] = linhas[i].split(';');
            let cliente;

            if (tipo === 'Professor') cliente = new Professor(id, nome);
            else if (tipo === 'Estudante') cliente = new Estudante(id, nome, parseFloat(saldo));
            else if (tipo === 'Empresa') {
                cliente = new Empresa(id, nome);
                cliente.debito = parseFloat(debito);
                cliente.inadimplente = inadimplente === 'true';
            }

            if (cliente && placasStr) {
                placasStr.split(',').forEach(p => p && cliente.adicionarPlaca(p.trim()));
                estacionamento.registrarCliente(cliente);
            }
        }
    }
    // Método para salvar clientes em CSV
    salvarClientes(estacionamento) {
        let conteudo = 'id;nome;tipo;placas;saldo;debito;inadimplente\n';
        
        for (const cliente of estacionamento.clientes.values()) {
            const tipo = cliente.constructor.name;
            const placas = Array.from(cliente.placas).join(',');
            const saldo = cliente.saldo || 0;
            const debito = cliente.debito || 0;
            const inadimplente = cliente.inadimplente || false;

            conteudo += `${cliente.id};${cliente.nome};${tipo};${placas};${saldo};${debito};${inadimplente}\n`;
        }

        fs.writeFileSync(this.caminhoClientes, conteudo, 'utf-8');
    }
    
    // Método para carregar registros de estacionamento em CSV
    salvarRegistros(estacionamento) {
        let conteudo = 'placa;clienteId;entrada;saida;valor;desconto;valorPago\n';

        for (const reg of estacionamento.historicoRegistros) {
            const clienteId = reg.cliente ? reg.cliente.id : 'AVULSO';
            const entradaStr = reg.entrada ? reg.entrada.toISOString() : '';
            const saidaStr = reg.saida ? reg.saida.toISOString() : '';

            conteudo += `${reg.placa};${clienteId};${entradaStr};${saidaStr};${reg.valor};${reg.desconto};${reg.valorPago}\n`;
        }

        fs.writeFileSync(this.caminhoRegistros, conteudo, 'utf-8');
    }
}