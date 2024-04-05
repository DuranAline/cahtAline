const socket = require('net');
const readline = require('readline');

// Retorna data e hora atual para colocar no log
function getTimeStamp () {
  const d = new Date();
  return "("+d.getDate() + "/" +d.getMonth() + "/"+d.getFullYear()+") - " +d.getHours() + ":" + d.getMinutes()
}

function log(message){
  console.log(`[${getTimeStamp()}] - ${message}`)
}

// Criar um cliente de socket
const cliente = socket.createConnection({
  host: 'localhost',
  port: 3001
})

// Evento de desconexão do Servidor
cliente.on('close', () => {
  log('Conexão com o Servidor Finalizada');
})

// Configura a interface para leitura do terminal
const chat = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Solicita mensagem ao cliente e envia a mensagem ao servidor
function escreveChat(chatWindow, conexao) {
  chatWindow.question(`[${getTimeStamp()}] - Mensagem :`, (mensagem) => {   
    let clean = mensagem.trim().toLowerCase()
    
    if(clean == 'sair') {
      // Fecha a conexão com o servidor
      conexao.end();
    } else {
      enviaMensagem(mensagem, conexao);
    }
  });
}

// Recebe as mensagens do servidor e apresenta no log
function recebeMensagem() {
  cliente.on('data', (mensagem) => {
    log(' - Server):' + mensagem.toString('utf8'));
    escreveChat(chat, cliente);
  });
}

// Enviar uma mensagem para o servidor
function enviaMensagem(mensagem) {
  cliente.write(mensagem);
  recebeMensagem();
}

recebeMensagem();