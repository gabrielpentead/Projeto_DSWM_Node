const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

module.exports = (db) => {
    // Rota para listar endereços com paginação
    router.get('/', async (req, res) => {
        const { limit, offset } = req.query;
        const pageSize = parseInt(limit) || 10; // Definir o tamanho da página
        let startAfterDoc = null;

        if (offset) {
            try {
                startAfterDoc = await db.collection('enderecos').doc(offset).get();
                if (!startAfterDoc.exists) {
                    return res.status(400).json({ error: 'Offset inválido.' });
                }
            } catch (error) {
                return res.status(500).json({ error: 'Erro ao buscar o offset.' });
            }
        }

        try {
            let query = db.collection('enderecos').limit(pageSize);
            if (startAfterDoc) {
                query = query.startAfter(startAfterDoc);
            }

            const snapshot = await query.get();
            const enderecos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            res.status(200).json(enderecos);
        } catch (error) {
            console.error('Erro ao obter endereços:', error);
            res.status(500).json({ error: 'Erro ao obter endereços.' });
        }
    });

    // Rota para buscar um endereço por ID
    router.get('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const enderecoRef = db.collection('enderecos').doc(id);
            const endereco = await enderecoRef.get();

            if (!endereco.exists) {
                return res.status(404).json({ msg: 'Endereço não encontrado' });
            }

            res.status(200).json({ id: endereco.id, ...endereco.data() });
        } catch (error) {
            console.error('Erro ao buscar endereço:', error);
            res.status(500).json({ msg: 'Erro ao buscar endereço.' });
        }
    });

    // Rota para cadastrar um novo endereço
    router.post('/', async (req, res) => {
        const { rua, numero, bairro, cidade, estado, cep, userEmail } = req.body;

        // Validação dos campos
        if (!rua || !numero || !bairro || !cidade || !estado || !cep || !userEmail) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        try {
            // Salvar o endereço no Firestore
            const enderecoRef = await db.collection('enderecos').add({
                rua,
                numero,
                bairro,
                cidade,
                estado,
                cep,
                userEmail,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            // Retornar a resposta com sucesso
            res.status(201).json({
                message: 'Endereço cadastrado com sucesso!',
                id: enderecoRef.id,
            });
        } catch (error) {
            console.error('Erro ao salvar endereço:', error);
            res.status(500).json({ error: 'Erro ao salvar o endereço. Tente novamente.' });
        }
    });

    // Função para buscar o endereço de um usuário por email
    router.get('/user/:userEmail', async (req, res) => {
        const userEmail = req.params.userEmail;  // Obtém o email do usuário da URL

        try {
            // Busca os endereços na coleção
            const snapshot = await db.collection('enderecos').where('userEmail', '==', userEmail).get();

            if (snapshot.empty) {
                return res.status(404).json({ message: 'Endereço não encontrado.' });
            }

            // Pegando o primeiro endereço (supondo que cada usuário tenha apenas um endereço)
            const endereco = snapshot.docs[0].data();
            return res.status(200).json({ id: snapshot.docs[0].id, ...endereco });
        } catch (error) {
            console.error('Erro ao buscar o endereço:', error);
            return res.status(500).json({ message: 'Erro ao buscar o endereço' });
        }
    });

    // Função para atualizar um endereço existente
    router.put('/:id', async (req, res) => {
        const { id } = req.params; // ID do endereço a ser atualizado
        const { rua, numero, bairro, cidade, estado, cep } = req.body;

        try {
            // Atualiza os dados do endereço no Firestore
            const enderecoRef = db.collection('enderecos').doc(id);
            await enderecoRef.update({
                rua,
                numero,
                bairro,
                cidade,
                estado,
                cep,
            });

            // Retorna o endereço atualizado
            const updatedEndereco = await enderecoRef.get();
            return res.status(200).json({ id, ...updatedEndereco.data() });
        } catch (error) {
            console.error('Erro ao atualizar o endereço:', error);
            return res.status(500).json({ message: 'Erro ao atualizar o endereço' });
        }
    });

    // Função para excluir um endereço
    router.delete('/:id', async (req, res) => {
        const { id } = req.params; // ID do endereço a ser excluído

        try {
            // Deleta o endereço do Firestore
            await db.collection('enderecos').doc(id).delete();
            return res.status(200).json({ message: 'Endereço excluído com sucesso.' });
        } catch (error) {
            console.error('Erro ao excluir o endereço:', error);
            return res.status(500).json({ message: 'Erro ao excluir o endereço' });
        }
    });

    return router;
};
