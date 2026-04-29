import express from 'express';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
//import 'dotenv/config'; 
dotenv.config();
// O gerente importa os encarregados de cada setor (as rotas)
import rotasClientes from './routes/clientes.js';
import rotasProdutos from './routes/produtos.js';
import rotasAuth from './routes/auth.js';


const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf8'));
const app = express();
// 1. Configurações Globais (Recepcionista)
app.use(express.json());

// Conectar ao MongoDB 
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('📦 Banco de Dados MongoDB Conectado!'))
    .catch((erro) => console.log('❌ Erro ao conectar no Mongo:', erro));

// '/api-docs' é igual a '/docs', é só uma questão de escolha. O importante é ser consistente!
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// 2. Delegação de Tarefas (Encaminha para a pasta routes)
app.use('/clientes', rotasClientes); // "Tudo que vier para /clientes, o arquivo clientes.js resolve"
app.use('/produtos', rotasProdutos);
app.use('/auth', rotasAuth);
export default app; // O app.js não liga o servidor, ele só exporta as regras!