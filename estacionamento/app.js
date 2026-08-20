import {
    Cliente,
    ClienteAvulso,
    Professor,
    Estudante,
    Empresa
} from "./modelo/cliente.js";

import {
    Veiculo,
    RegistroEstacionamento,
    Estacionamento
} from "./modelo/estacionamento.js";

import {
    Desconto,
    ClienteFrequente
} from "./modelo/desconto.js";

console.log("==================================================");
console.log(" 🚗 SISTEMA DE ESTACIONAMENTO EstACME - FASE 1 🏢");
console.log("==================================================\n");

const estacionamento = new Estacionamento();

// -----------------------------------------------------------------
// 1. CADASTRO DE CLIENTES
// -----------------------------------------------------------------
console.log(" 1.Cadastrando Clientes e Veículos...");

const prof = new Professor("12345678901", "Prof. Carlos");
prof.adicionarPlaca("ABC1D23");

const aluno = new Estudante("98765432100", "João Silva", 25.00); // Saldo de R$ 25
aluno.adicionarPlaca("DEF2E34");

const empresa = new Empresa("12345678000199", "Empresa Tech");
empresa.adicionarPlaca("GHI3F45");

estacionamento.registrarCliente(prof);
estacionamento.registrarCliente(aluno);
estacionamento.registrarCliente(empresa);

console.log("✅ Clientes e placas cadastrados com sucesso!\n");

// -----------------------------------------------------------------
// 2. ENTRADA DE VEÍCULOS
// -----------------------------------------------------------------
console.log(" 2.Registrando Entradas no Estacionamento...");

estacionamento.entrada("ABC1D23"); // Professor
estacionamento.entrada("DEF2E34"); // Estudante
estacionamento.entrada("GHI3F45"); // Empresa
estacionamento.entrada("XYZ9999"); // Cliente Avulso (sem cadastro prévio)

console.log(`✅ Veículos ativos no momento: ${estacionamento.veiculosAtivos.size} vagas ocupadas.\n`);

// -----------------------------------------------------------------
// 3. TESTANDO VALIDAÇÕES E REGRAS DE NEGÓCIO (Tratamento de Erros)
// -----------------------------------------------------------------
console.log(" 3.Testando Validações e Regras de Segurança:");

// Tentativa A: Entrar com o mesmo carro duas vezes
try {
    estacionamento.entrada("ABC1D23");
} catch (erro) {
    console.log(`⚠️ Validação OK (Veículo Duplicado): ${erro.message}`);
}

// Tentativa B: Professor cadastrar mais de 2 placas
try {
    prof.adicionarPlaca("AAA1111");
    prof.adicionarPlaca("BBB2222"); // 3ª placa -> Deve falhar
} catch (erro) {
    console.log(`⚠️ Validação OK (Limite do Professor): ${erro.message}`);
}

console.log("");

// -----------------------------------------------------------------
// 4. SAÍDA DE VEÍCULOS E COBRANÇAS
// -----------------------------------------------------------------
console.log(" 4.Processando Saídas e Cobranças...");

const regProf = estacionamento.saida("ABC1D23");
console.log(`🟢 [SAÍDA] Placa: ${regProf.placa} | Cliente: ${regProf.cliente.nome} | Total a Pagar: R$ ${regProf.valorPago.toFixed(2)} (Isento)`);

const regAluno = estacionamento.saida("DEF2E34");
console.log(`🟢 [SAÍDA] Placa: ${regAluno.placa} | Cliente: ${regAluno.cliente.nome} | Total a Pagar: R$ ${regAluno.valorPago.toFixed(2)} | Saldo Restante: R$ ${aluno.saldo.toFixed(2)}`);

const regEmpresa = estacionamento.saida("GHI3F45");
console.log(`🟢 [SAÍDA] Placa: ${regEmpresa.placa} | Cliente: ${regEmpresa.cliente.nome} | Diária Faturada: R$ ${regEmpresa.valorPago.toFixed(2)} | Débito Total Empresa: R$ ${empresa.debito.toFixed(2)}`);

const regAvulso = estacionamento.saida("XYZ9999");
console.log(`🟢 [SAÍDA] Placa: ${regAvulso.placa} | Cliente: ${regAvulso.cliente.nome} | Total a Pagar: R$ ${regAvulso.valorPago.toFixed(2)}`);

console.log("\n==================================================");
console.log("✅ TODAS AS OPERAÇÕES FORAM EXECUTADAS COM SUCESSO!");
console.log("==================================================");0