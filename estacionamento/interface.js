import readline from 'readline';
import { Professor, Estudante, Empresa } from './modelo/cliente.js';
import { GeradorRelatorios } from './servicos/relatorios.js';

// Classe para gerenciar a interface com o usuário
export class InterfaceUsuario {
    constructor(estacionamento, persistencia) {
        this.estacionamento = estacionamento;
        this.persistencia = persistencia;
        this.relatorios = new GeradorRelatorios(estacionamento);
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    // Método para iniciar a interface

    iniciar() {
        console.log("\n==========================================");
        console.log("   SISTEMA DE ESTACIONAMENTO EstACME");
        console.log("==========================================");
        console.log("1. Cadastrar Cliente");
        console.log("2. Registrar Entrada de Veículo");
        console.log("3. Registrar Saída de Veículo");
        console.log("4. Consultas e Relatórios Gerenciais");
        console.log("0. Salvar e Sair");

        this.rl.question("\nEscolha uma opção: ", (opcao) => {
            switch (opcao.trim()) {
                case '1': this.menuCadastro(); break;
                case '2': this.menuEntrada(); break;
                case '3': this.menuSaida(); break;
                case '4': this.menuRelatorios(); break;
                case '0': 
                    this.persistencia.salvarClientes(this.estacionamento);
                    this.persistencia.salvarRegistros(this.estacionamento);
                    console.log("💾 Dados salvos com sucesso. Encerrando...");
                    this.rl.close();
                    break;
                default:
                    console.log("❌ Opção inválida.");
                    this.iniciar();
            }
        });
    }

    // Menu para cadastro de clientes

    menuCadastro() {
        this.rl.question("\nTipo (1-Prof, 2-Estudante, 3-Empresa): ", (tipo) => {
            this.rl.question("ID/CPF/CNPJ: ", (id) => {
                this.rl.question("Nome: ", (nome) => {
                    this.rl.question("Placa inicial: ", (placa) => {
                        try {
                            let cliente;
                            if (tipo === '1') cliente = new Professor(id, nome);
                            else if (tipo === '2') cliente = new Estudante(id, nome, 20.00); // R$ 20 inicial
                            else if (tipo === '3') cliente = new Empresa(id, nome);

                            if (cliente) {
                                cliente.adicionarPlaca(placa);
                                this.estacionamento.registrarCliente(cliente);
                                console.log("✅ Cliente cadastrado com sucesso!");
                            }
                        } catch (e) {
                            console.log(`❌ Erro: ${e.message}`);
                        }
                        this.iniciar();
                    });
                });
            });
        });
    }

    // Menu para registrar entrada de veículo

    menuEntrada() {
        this.rl.question("\nInforme a placa do veículo: ", (placa) => {
            try {
                this.estacionamento.entrada(placa);
                console.log(`🟢 Entrada autorizada para o veículo ${placa}`);
            } catch (e) {
                console.log(`❌ Entrada Recusada: ${e.message}`);
            }
            this.iniciar();
        });
    }
    
    // Menu para registrar saída de veículo

    menuSaida() {
        this.rl.question("\nInforme a placa do veículo: ", (placa) => {
            try {
                const reg = this.estacionamento.saida(placa);
                console.log(`🔴 Saída confirmada. Total a pagar: R$ ${reg.valorPago.toFixed(2)}`);
            } catch (e) {
                console.log(`❌ Erro ao processar saída: ${e.message}`);
            }
            this.iniciar();
        });
    }

    // Menu para relatórios gerenciais
    
    menuRelatorios() {
        console.log("\n--- RELATÓRIOS GERENCIAIS ---");
        console.log("1. Arrecadação por Categoria");
        console.log("2. Situação de um Cliente");
        console.log("3. Relação de Clientes Impedidos");
        console.log("4. Top 10 Clientes Frequentes do Ano");
        console.log("0. Voltar");

        this.rl.question("Escolha o relatório: ", (op) => {
            if (op === '1') this.relatorios.arrecadacaoPorCategoria();
            else if (op === '2') {
                this.rl.question("Informe o ID/CPF do cliente: ", (id) => {
                    this.relatorios.situacaoCliente(id);
                    this.iniciar();
                });
                return;
            }
            else if (op === '3') this.relatorios.clientesImpedidos();
            else if (op === '4') this.relatorios.top10ClientesMaisFrequentes(new Date().getFullYear());

            this.iniciar();
        });
    }
}