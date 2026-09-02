
import { Estacionamento } from './modelo/estacionamento.js';
import { PersistenciaCSV } from './servicos/persistencia.js';
import { InterfaceUsuario } from './interface.js';

const estacionamento = new Estacionamento();
const persistencia = new PersistenciaCSV();

// 1. Carrega os dados iniciais dos CSVs
persistencia.carregarClientes(estacionamento);

// 2. Inicia o loop da interface com o usuário
const gui = new InterfaceUsuario(estacionamento, persistencia);
gui.iniciar();