Markdown
# 🚗 Sistema de Controle de Estacionamento - EstACME (Fase 1)

Este projeto consiste no núcleo funcional em JavaScript (Node.js) para o gerenciamento de estacionamento do complexo de três empreendimentos (Shopping, Edifício Corporativo e Universidade).

---

## 📐 Estrutura do Projeto e Arquitetura (POO)

O sistema foi modelado aplicando os princípios fundamentais da **Programação Orientada a Objetos (POO)**:

- **Encapsulamento e Herança:** A classe base `Cliente` gerencia as propriedades comuns (ID, nome e lista de placas). As classes derivadas (`Professor`, `Estudante`, `Empresa` e `ClienteAvulso`) implementam suas regras específicas de negócio e limites de veículos.
- **Polimorfismo:** Cada subclasse de `Cliente` implementa sua própria versão do método `calcularCobranca(horas)`, tratando isenções (Professores), desconto por saldo (Estudantes), faturamento por débito (Empresas) e tarifas por hora (Avulsos).
- **Mapeamento e Eficiência:** A classe `Estacionamento` utiliza a estrutura de dados `Map` para garantir buscas eficientes de veículos ativos e clientes cadastrados.
- **Identificação Automática:** A entrada de veículos busca automaticamente o cliente associado à placa. Caso não haja pré-cadastro, o sistema instancia um `ClienteAvulso`.

---

## 📂 Estrutura dos Arquivos

```text
estacionamento/
├── dados/
│   ├── clientes.csv
│   └── registros.csv
│   └── estacionamento.csv
├── modelo/
│   ├── cliente.js
│   └── estacionamento.js
├── servicos/
│   ├── persistencia.js
│   └── relatorios.js
├── interface.js
├── app.js
└── README.md