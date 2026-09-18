# 🚗 Sistema de Controle de Estacionamento - EstACME (Fase 2)

Este projeto foi expandido para a **Fase 2**, adicionando persistência completa de dados, interface interativa CLI e relatórios gerenciais avançados.

---

## 🚀 Novidades e Implementações da Fase 2

### 1. Persistência de Dados Completa (CSV)
- **Carregamento Automático:** O sistema inicializa reconstruindo o estado completo em memória a partir dos arquivos CSV (`clientes.csv`, `registros.csv` e `bloqueados.csv`).
- **Recuperação de Veículos Ativos e Histórico:** Restaura tanto os veículos que continuam estacionados (`status: ATIVO`) quanto o histórico de transações finalizadas (`status: CONCLUIDO`).
- **Persistência de Bloqueios:** Lista de veículos impedidos mantida de forma persistente.
- **Salvamento Unificado:** Opção de encerramento que grava todas as alterações feitas na sessão.

### 2. Interface Interativa com o Usuário (CLI)
- **Menu Centralizado (`interface.js`):** Classe independente que gerencia o fluxo de interações do terminal via `readline`.
- **Módulo de Bloqueios:** Opção explícita no menu para bloquear e desbloquear placas.
- **Formatação e Sanitização:** Normalização de placas (caixa alta e remoção de espaços) para evitar duplicidades acidentais.

### 3. Todos os 6 Relatórios Gerenciais Disponíveis
Disponíveis no submenu de relatórios (`GeradorRelatorios`), com suporte a filtros por período (datas):
1. **Arrecadação por Categoria:** Detalhamento dos valores pagos agrupados por tipo de cliente.
2. **Situação de Cliente Cadastrado:** Consulta de saldos, débitos, placas e status de inadimplência por CPF/CNPJ/ID.
3. **Registros de Cliente Cadastrado por Período:** Histórico de entradas e saídas filtrado por cliente e intervalo de datas.
4. **Registros de Clientes Avulsos por Período:** Consultas de movimentação de veículos não cadastrados por intervalo de datas.
5. **Relação de Clientes e Veículos Impedidos:** Listagem de empresas inadimplentes e placas bloqueadas.
6. **Top 10 Clientes Mais Frequentes:** Ranking dos clientes com maior volume de acessos no ano selecionado.

---

## 📂 Estrutura de Arquivos Atualizada

```text
estacionamento/
├── dados/
│   ├── bloqueados.csv       # Relação de placas bloqueadas
│   ├── clientes.csv         # Cadastro de clientes e saldos/débitos
│   └── registros.csv        # Histórico de registros ativos e concluídos
├── modelo/
│   ├── cliente.js           # Regras de cobrança e validação de placas
│   └── estacionamento.js    # Controle de vagas, entradas, saídas e bloqueios
├── servicos/
│   ├── persistencia.js      # Leitura e gravação de todos os CSVs
│   └── relatorios.js        # Lógica dos 6 relatórios gerenciais
├── interface.js             # Menu interativo CLI (Readline)
├── app.js                   # Inicialização do sistema
└── README.md