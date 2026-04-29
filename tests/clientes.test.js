import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';

let token = '';
let clienteId = '';

beforeAll(async () => {
    // 1. Criamos um usuário de teste para obter o token
    // Usamos um e-mail aleatório para não dar erro de "e-mail já cadastrado"
    const emailTeste = `admin_${Date.now()}@hada.com`;

    await request(app)
        .post('/auth/registro')
        .send({ email: emailTeste, senha: "123" });

    const login = await request(app)
        .post('/auth/login')
        .send({ email: emailTeste, senha: "123" });

    token = login.body.token;
});

afterAll(async () => {
    // Limpeza final: desconecta o banco
    await mongoose.connection.close();
});

describe('Suíte de Testes da Distribuidora Hada', () => {

    // ==========================================
    // 🔴 TESTES DE BLOQUEIO (SEM TOKEN)
    // ==========================================
    it('Deve bloquear (Status 401) a criação de cliente sem Token JWT', async () => {
        const resposta = await request(app)
            .post('/clientes')
            .send({
                nome: "Mercadinho teste sem token",
                email: "teste@hada.com",
                telefone: "92999998888",
                endereco: "Av. das Torres, 1000"
            });

        // Como não mandamos o Header 'Authorization', o middleware auth.js DEVE barrar!
        expect(resposta.status).toBe(401);
        expect(resposta.body.erro).toBeDefined(); // Espera que exista uma mensagem de erro
    });
    it('Deve bloquear PUT /clientes/:id sem token', async () => {
        const res = await request(app).put('/clientes/123').send({ nome: "Erro" });
        expect(res.status).toBe(401);
    });

    it('Deve bloquear DELETE /clientes/:id sem token', async () => {
        const res = await request(app).delete('/clientes/123');
        expect(res.status).toBe(401);
    });

    // ==========================================
    // 🟢 TESTES DE SUCESSO (COM TOKEN)
    // ==========================================

    // 1. CREATE
    it('Deve criar um cliente com sucesso usando token', async () => {
        const res = await request(app)
            .post('/clientes')
            .set('Authorization', `Bearer ${token}`) // Passando o crachá!
            .send({
                nome: "Mercadinho teste com token",
                email: "contato@saojose.com",
                telefone: "92999998888",
                endereco: "Av. das Torres, 1000"
            });

        expect(res.status).toBe(201);
        expect(res.body._id).toBeDefined();
        clienteId = res.body._id; // Guardamos o ID para os próximos testes
    });

    // 2. READ
    it('Deve listar os clientes', async () => {
        const res = await request(app).get('/clientes');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // 3. UPDATE 
    it('Deve atualizar o cliente criado anteriormente', async () => {
        const textoAtualizado = "Mercadinho teste com token atualizado";
        
        const res = await request(app)
            .put(`/clientes/${clienteId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: textoAtualizado,
                email: "contato@saojose.com",
                telefone: "92999998888",
                endereco: "Av. das Torres, 1000"
            });

        // Caso o teste falhe de novo, isso vai imprimir no terminal exatamente o que sua API respondeu!
        // console.log("RESPOSTA DO PUT:", res.body);

        expect(res.status).toBe(200);
        
        // Ajustamos para pegar o nome dependendo de como sua API devolve o JSON
        const nomeRetornado = res.body.cliente ? res.body.cliente.nome : res.body.nome;
        expect(nomeRetornado).toBe(textoAtualizado);
    });

    // 4. DELETE
    it('Deve deletar o cliente criado anteriormente', async () => {
        const res = await request(app)
            .delete(`/clientes/${clienteId}`)
            .set('Authorization', `Bearer ${token}`);

        // console.log("RESPOSTA DO DELETE:", res.body);

        // O mais importante do DELETE é garantir que o Status 200 (OK) retornou!
        expect(res.status).toBe(200);
    });
});