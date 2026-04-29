import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true // Não podem existir dois usuários com o mesmo email
    },
    senha: {
        type: String,
        required: true
    }
});

export default mongoose.model('Usuario', usuarioSchema);