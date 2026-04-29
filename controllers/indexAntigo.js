import fs from 'fs/promises';
const DB_PATH = '../server5/database/database.json';
// Função interna para ler o arquivo (evita repetição de código)
async function lerBanco() {
    //console.log("Tentando ler o banco de dados...");
    try {
        //console.log("Lendo o arquivo do banco de dados...");
        const dadosBrutos = await fs.readFile(DB_PATH, 'utf-8');
        //console.log("Banco lido com sucesso!");
        return JSON.parse(dadosBrutos);
    } catch (erro) {
        //console.error("chgeuei no catch do lerBanco");
        // Se o arquivo não existir, criamos um banco inicial vazio
        const bancoInicial = { clientes: [], produtos: [] };
        //console.log("Criando um novo banco de dados vazio...");
        await fs.writeFile(DB_PATH, JSON.stringify(bancoInicial, null, 2));
        //console.log("Novo banco de dados criado com sucesso!");
        //console.log("Aviso: Arquivo não encontrado. Um novo banco de dados vazio foi criado.");
        return bancoInicial;
    }

}

// Exportando as funções de busca
export const getClientes = async (id, bairro) => {
    const banco = await lerBanco();
    // Procura a posição (índice) do cliente na lista

    if (id) {
        const index = banco.clientes.findIndex(c => c.id === parseInt(id));
        if (index === -1) {
            console.log(`Cliente de ID ${id} não encontrado.`);
            return banco.clientes; // Se não achar, retorna todos os clientes
        }
        if (index !== -1) {
            console.log(`Filtrando cliente pelo ID: ${id}`);
            return banco.clientes[index];
        }
    }
    if (bairro) {
        console.log(`Filtrando clientes pelo bairro: ${bairro}`);
        return banco.clientes.filter(c => c.bairro.toLowerCase() === bairro.toLowerCase());

    }
    console.log("Retornando todos os clientes");
    return banco.clientes;
};

export const getProdutos = async () => {
    const banco = await lerBanco();
    return banco.produtos;
};

// Exportando a função de gravação
export const postCliente = async (dadosCliente) => {
    const banco = await lerBanco();
    const novoCliente = {
        ...dadosCliente,
        id: banco.clientes.length + 1
    };
    banco.clientes.push(novoCliente);
    await fs.writeFile(DB_PATH, JSON.stringify(banco, null, 2));
    console.log("Novo cliente adicionado:", novoCliente);
    return novoCliente;
};

// 🟠 Função de Atualização (PUT)
export const putCliente = async (id, dadosAtualizados) => {
    const banco = await lerBanco();

    // Procura a posição (índice) do cliente na lista
    const index = banco.clientes.findIndex(c => c.id === parseInt(id));

    if (index === -1) {
        console.log(`Cliente de ID ${id} não encontrado para atualização de dados.`);
        return false; // Se não achar, retorna falso
    }
    console.log("Cliente encontrado para atualização:", banco.clientes[index]);
    // Pega o cliente antigo, mistura com os dados novos e garante que o ID não mude
    banco.clientes[index] = { ...banco.clientes[index], ...dadosAtualizados, id: parseInt(id) };

    await fs.writeFile(DB_PATH, JSON.stringify(banco, null, 2));
    console.log("Cliente atualizado:", banco.clientes[index]);
    return banco.clientes[index];
};

// 🔴 Função de Exclusão (DELETE)
export const deleteCliente = async (id) => {
    const banco = await lerBanco();
    const index = banco.clientes.findIndex(c => c.id === parseInt(id));

    if (index === -1) {
        console.log(`Cliente de ID ${id} não encontrado para exclusão.`);
        return false; // Se não achar, retorna falso
    }
    console.log("Cliente encontrado para exclusão:", banco.clientes[index]);
    // Remove 1 item a partir da posição encontrada
    banco.clientes.splice(index, 1);

    await fs.writeFile(DB_PATH, JSON.stringify(banco, null, 2));
    console.log("Cliente excluído");
    return true;
};