import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
    nome: { 
        type: String,   
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    telefone: {
        type: String,
        required: true
    },
    endereco: {
        type: String,
        required: true
    },
    registradoEm:{
        type: Date,
        default: Date.now

    }
});
export default mongoose.model('Cliente', clienteSchema); // O nome do modelo é "Cliente", e ele segue a estrutura do clienteSchema