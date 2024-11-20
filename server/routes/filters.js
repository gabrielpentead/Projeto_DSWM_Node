const express = require('express');
const router = express.Router();

module.exports = (db) => {
    if (!db) {
        console.error('Banco de dados não está disponível.');
        throw new Error('Banco de dados não está disponível.');
    }

    // Rota para buscar produtos com base em filtros
    router.get('/', async (req, res) => {
        try {
            const { type } = req.query; // Obtém o tipo da query string

            let query = db.collection('products'); // Inicia a referência à coleção de produtos

            // Se houver um tipo especificado, filtra os produtos
            if (type) {
                query = query.where('type', '==', type); // Filtra pelo tipo de produto
            }

            // Executa a consulta no Firestore
            const snapshot = await query.get();

            if (snapshot.empty) {
                return res.status(404).json({ message: 'Nenhum produto encontrado.' });
            }

            // Converte os documentos em um array de produtos
            const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('Produtos filtrados:', products); // Log dos produtos retornados

            return res.status(200).json(products); // Retorna os produtos encontrados
        } catch (error) {
            console.error('Erro ao obter produtos:', error);
            res.status(500).json({ error: 'Erro interno ao buscar produtos. Tente novamente mais tarde.' });
        }
    });

    return router;
};
