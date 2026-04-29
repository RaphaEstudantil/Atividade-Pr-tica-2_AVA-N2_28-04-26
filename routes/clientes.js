import express from 'express';
import { getClientes, postCliente, putCliente, deleteCliente } from '../controllers/index.js';
import { verificarToken } from '../middlewares/auth.js';
// Cria o mini-roteador para este setor
const router = express.Router();

// Repare que a rota é só '/', porque o app.js já avisou que estamos dentro de '/clientes'
router.get('/', async (req, res) => {
    const clientes = await getClientes(req.query.bairro);
    res.json(clientes);
});

router.post('/', verificarToken, async (req, res) => {
    const novoCliente = await postCliente(req.body);
    res.status(201).json(novoCliente);
});

router.put('/:id', verificarToken, async (req, res) => {
    const id = req.params.id;
    const dadosAtualizados = req.body;
    const clienteAtualizado = await putCliente(id, dadosAtualizados);
    if(!clienteAtualizado) {
        res.status(404).json({ message: `Cliente de ID ${id} não encontrado para atualização.` });
    }
    res.status(200).json(clienteAtualizado);
    
});

router.delete('/:id', verificarToken, async (req, res) => {
    const id = req.params.id;
    const sucesso = await deleteCliente(id);
    if (sucesso) {
        res.json({ message: `Cliente de ID ${id} deletado com sucesso.` });
        res.status(200);
    } else {
        res.status(404).json({ message: `Cliente de ID ${id} não encontrado para deleção.` });
    }
});
// Exporta o mini-roteador para o app.js usar
export default router;