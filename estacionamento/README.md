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
├── modelo/
│   ├── cliente.js           # Definição das classes Cliente, Professor, Estudante, Empresa e Avulso
│   └── estacionamento.js    # Definição das classes Veiculo, RegistroEstacionamento e Estacionamento
│   └── desconto.js          # Definição das classes desconto e clienteFrequente
├── app.js                   # Script principal com a demonstração e testes do sistema
├── Diagrama_de_Classe.png   #imagem contendo diagrama de classes
└── README.md                # Documentação do projeto