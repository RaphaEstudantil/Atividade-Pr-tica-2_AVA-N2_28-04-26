// Importa o módulo nativo de servidor de rede
import http from 'http';

// Importa o "Gerente" que você criou no app.js
import app from '../app.js'; 

// Define a porta onde a distribuidora vai operar
const porta = 3000;
app.set('port', porta);

// Aqui acontece a mágica: O Express (app) é passado para dentro do servidor HTTP!
const server = http.createServer(app);

// Liga o motor!
server.listen(porta, () => {
    console.log(`🚚 Sistema da Distribuidora Hada rodando a todo vapor na porta ${porta}!\n acesse:http://localhost:3000`);
});