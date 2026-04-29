import express from 'express';
import { getProdutos } from '../controllers/index.js';
const router = express.Router();

router.get('/', async (req, res) => {
    const produtos = await getProdutos();
    res.json(produtos);
});

export default router;