// controllers/index.js
import Cliente from '../models/Cliente.js';

export const getClientes = async () => {
    // Busca TODOS os clientes no banco com 1 comando!
    return await Cliente.find(); 
};
export const getClienteById = async (id) => {
    // Busca um cliente específico por ID com 1 comando!
    return await Cliente.findById(id);
}
export const getProdutos = async () => {
    // Simulando uma busca no banco de dados, mas poderia ser um comando Mongoose também!
    return [
        { id: 1, nome: 'Yara', preco: 11.50 },
        { id: 2, nome: 'Agua crim', preco: 10.00 },
        { id: 3, nome: 'Toya', preco: 8.75 },
    ];
}   
export const postCliente = async (dadosDaRequisicao) => {
    // Cria e salva no banco de dados com 1 comando!
    const novoCliente = await Cliente.create(dadosDaRequisicao);
    return novoCliente;
};


export const putCliente = async (id, dadosAtualizados) => {
    // Comando Mongoose: "Ache por ID e atualize". 
    // O { new: true } é um truque para ele te devolver o cliente JÁ com as alterações salvas,
    // caso contrário, ele te devolve a versão antiga por padrão.
    const clienteAtualizado = await Cliente.findByIdAndUpdate(
        id, 
        dadosAtualizados, 
        { returnDocument: 'after' }
    );
    return clienteAtualizado;
};

export const deleteCliente = async (id) => {
    // Comando Mongoose: "Ache por ID e delete"
    const clienteDeletado = await Cliente.findByIdAndDelete(id);
    return clienteDeletado;
};
