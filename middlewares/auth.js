import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    // Procura o crachá no cabeçalho da requisição
    const tokenHeader = req.headers['authorization'];
    
    if (!tokenHeader) {
        return res.status(401).json({ erro: "Acesso negado. Crachá (Token) não fornecido!" });
    }

    // O padrão de mercado é enviar o token assim: "Bearer kjasdhkjashd..."
    // Então cortamos a palavra "Bearer " para pegar só o código
    const token = tokenHeader.split(' ')[1];

    try {
        // Verifica se o token é verdadeiro usando a mesma senha secreta do .env
        const decodificado = jwt.verify(token, process.env.CHAVE_JWT);
        
        // Se for verdadeiro, anota quem é o usuário e deixa ele passar (next)
        req.usuario = decodificado;
        next(); 
    } catch (erro) {
        res.status(403).json({ erro: "Crachá (Token) inválido ou expirado!" });
    }
};