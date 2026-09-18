import readline from 'readline';
import { Professor, Estudante, Empresa } from './modelo/cliente.js';
import { GeradorRelatorios } from './servicos/relatorios.js';

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

    iniciar() {
        console.log("\n==========================================");
        console.log("   SISTEMA DE ESTACIONAMENTO EstACME");
        console.log("==========================================");
        console.log("1. Cadastrar Cliente");
        console.log("2. Registrar Entrada de Veículo");
        console.log("3. Registrar Saída de Veículo");
        console.log("4. Bloquear / Desbloquear Veículo");
        console.log("5. Relatórios Gerenciais e Consultas");
        console.log("0. Salvar e Sair");

        this.rl.question("\nEscolha uma opção: ", (opcao) => {
            switch (opcao.trim()) {
                case '1': this.menuCadastro(); break;
                case '2': this.menuEntrada(); break;
                case '3': this.menuSaida(); break;
                case '4': this.menuBloqueio(); break;
                case '5': this.menuRelatorios(); break;
                case '0': 
                    this.persistencia.salvarTudo(this.estacionamento);
                    console.log("💾 Todos os dados e registros foram salvos em CSV com sucesso. Encerrando...");
                    this.rl.close();
                    break;
                default:
                    console.log("❌ Opção inválida.");
                    this.iniciar();
            }
        });
    }

    menuCadastro() {
        this.rl.question("\nTipo (1-Prof, 2-Estudante, 3-Empresa): ", (tipo) => {
            this.rl.question("ID/CPF/CNPJ: ", (id) => {
                this.rl.question("Nome: ", (nome) => {
                    this.rl.question("Placa inicial: ", (placa) => {
                        try {
                            let cliente;
                            if (tipo === '1') cliente = new Professor(id, nome);
                            else if (tipo === '2') cliente = new Estudante(id, nome, 20.00);
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

    menuBloqueio() {
        this.rl.question("\nInforme a placa do veículo: ", (placa) => {
            this.rl.question("Ação (1-Bloquear, 2-Desbloquear): ", (acao) => {
                if (acao === '1') {
                    this.estacionamento.bloquearVeiculo(placa);
                    console.log(`🚫 Placa ${placa} bloqueada com sucesso.`);
                } else if (acao === '2') {
                    this.estacionamento.desbloquearVeiculo(placa);
                    console.log(`✅ Placa ${placa} desbloqueada com sucesso.`);
                }
                this.iniciar();
            });
        });
    }

    menuRelatorios() {
        console.log("\n==========================================");
        console.log("       RELATÓRIOS GERENCIAIS (6/6)");
        console.log("==========================================");
        console.log("1. Arrecadação por Categoria de Cliente");
        console.log("2. Consultar Situação de Cliente Cadastrado");
        console.log("3. Registros de Cliente Cadastrado por Período");
        console.log("4. Registros de Clientes Avulsos por Período");
        console.log("5. Relação de Clientes e Veículos Impedidos");
        console.log("6. Top 10 Clientes Mais Frequentes do Ano");
        console.log("0. Voltar ao Menu Principal");

        this.rl.question("\nEscolha a opção desejada: ", (op) => {
            switch (op.trim()) {
                case '1':
                    this.relatorios.arrecadacaoPorCategoria();
                    this.iniciar();
                    break;
                case '2':
                    this.rl.question("Informe o ID/CPF/CNPJ do cliente: ", (id) => {
                        this.relatorios.situacaoCliente(id);
                        this.iniciar();
                    });
                    break;
                case '3':
                    this.rl.question("ID/CPF do cliente: ", (id) => {
                        this.rl.question("Data Inicial (AAAA-MM-DD): ", (dtIni) => {
                            this.rl.question("Data Final (AAAA-MM-DD): ", (dtFim) => {
                                this.relatorios.registrosClienteCadastrado(id, dtIni, dtFim);
                                this.iniciar();
                            });
                        });
                    });
                    break;
                case '4':
                    this.rl.question("Data Inicial (AAAA-MM-DD): ", (dtIni) => {
                        this.rl.question("Data Final (AAAA-MM-DD): ", (dtFim) => {
                            this.relatorios.registrosClientesAvulsos(dtIni, dtFim);
                            this.iniciar();
                        });
                    });
                    break;
                case '5':
                    this.relatorios.clientesImpedidos();
                    this.iniciar();
                    break;
                case '6':
                    this.rl.question("Informe o Ano (ex: 2026): ", (ano) => {
                        this.relatorios.top10ClientesMaisFrequentes(parseInt(ano) || new Date().getFullYear());
                        this.iniciar();
                    });
                    break;
                case '0':
                    this.iniciar();
                    break;
                default:
                    console.log("❌ Opção inválida.");
                    this.iniciar();
            }
        });
    }
}