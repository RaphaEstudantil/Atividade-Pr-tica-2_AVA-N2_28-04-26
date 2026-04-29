import express from 'express';
import { registrarUsuario, loginUsuario } from '../controllers/auth.js';

const router = express.Router();

// Rota para cadastrar (POST /auth/registro)
router.post('/registro', registrarUsuario);

// Rota para logar (POST /auth/login)
router.post('/login', loginUsuario);

export default router;