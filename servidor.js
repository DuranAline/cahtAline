const socket = require('net');
const readline = require('readline');
const PORTA = 3001;


// Retorna data e hora atual para colocar no log
function getTimeStamp () {
  const d = new Date();
  return "("+d.getDate() + "/" +d.getMonth() + "/"+d.getFullYear()+") - " +d.getHours() + ":" + d.getMinutes()
}

function log(message){
  console.log(`[${getTimeStamp()}] - ${message}`)
}

// Criar um servidor de socket
const server = socket.createServer((socket) => {
  log(' - Cliente conectado')

  // Configura a interface para a leitura do terminal
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  // Pergunta ao cliente e espera a mensagem
  function writeMessage() {
    rl.question(`[${getTimeStamp()}] Digite sua mensagem: `, (mensagem) => {

      if(mensagem.trim().toLowerCase() == 'sair') {
        // Fecha a conexão com o cliente
        socket.end()
      } else {
        pushMessage(mensagem)
      }
    })
  }

  // Enviar uma mensagem para o cliente
  function pushMessage(mensagem) {
    socket.write(mensagem)
    pullMessage();
  }

  // Evento ao receber mensagem do cliente
function pullMessage() {
    socket.on('data', (mensagem) => {
      log('-> Cliente:' + mensagem.toString('utf8'))
      writeMessage()
    });
  }

  // Quando o cliente se desconecta ...
  socket.on('close', () => {
    log('Conexão fechada');
  });

  writeMessage();
});

//Recebe conexões de novos clientes
server.listen(PORTA, () => {
  log(`Servidor executando na porta ${PORTA}`)
});
