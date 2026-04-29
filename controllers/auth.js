import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// ==========================================
// 📝 REGISTRO DE USUÁRIO
// ==========================================
export const registrarUsuario = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // 1. Verifica se o email já existe no banco
        const usuarioExiste = await Usuario.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ erro: "Este email já está cadastrado!" });
        }

        // 2. Criptografa a senha (NUNCA salvamos a senha pura)
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        // 3. Salva no banco de dados com a senha protegida
        const novoUsuario = await Usuario.create({
            email,
            senha: senhaCriptografada
        });

        res.status(201).json({ mensagem: "Usuário registrado com sucesso!" });
    } catch (erro) {
        res.status(500).json({ erro: "Erro interno ao registrar usuário." });
    }
};

// ==========================================
// 🔐 LOGIN E GERAÇÃO DE TOKEN
// ==========================================
export const loginUsuario = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // 1. Procura o usuário pelo email
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ erro: "Email ou senha inválidos." });
        }

        // 2. Compara a senha digitada com a senha embaralhada do banco
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ erro: "Email ou senha inválidos." });
        }

        // 3. Se tudo estiver certo, gera o Crachá VIP (Token JWT)
        const token = jwt.sign(
            { id: usuario._id, email: usuario.email },
            process.env.CHAVE_JWT,
            { expiresIn: '1h' } // O token expira em 1 hora
        );

        res.status(200).json({
            mensagem: "Login bem-sucedido!",
            token: token
        });
    } catch (erro) {
        res.status(500).json({ erro: "Erro interno ao fazer login." });
    }
};