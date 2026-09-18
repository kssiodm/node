import { Estacionamento } from './modelo/estacionamento.js';
import { PersistenciaCSV } from './servicos/persistencia.js';
import { InterfaceUsuario } from './interface.js';

const estacionamento = new Estacionamento();
const persistencia = new PersistenciaCSV();

// Carrega os dados existentes do estacionamento a partir dos arquivos CSV
persistencia.carregarTudo(estacionamento);

// Inicia a interface CLI
const gui = new InterfaceUsuario(estacionamento, persistencia);
gui.iniciar();