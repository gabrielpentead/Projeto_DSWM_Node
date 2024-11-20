const express = require('express');
const multer = require('multer');
const admin = require('firebase-admin');
const router = express.Router();

// Configuração para upload de imagens
const storage = multer.memoryStorage();  // Armazena o arquivo na memória
const upload = multer({ storage: storage });

module.exports = (db) => {
    // Rota para buscar todos os produtos 
    router.get('/', async (req, res) => {
        const { limit, offset } = req.query;
        const pageSize = parseInt(limit) || 10;
        let startAfterDoc = null;

        if (offset) {
            try {
                startAfterDoc = await db.collection('products').doc(offset).get();
                if (!startAfterDoc.exists) {
                    return res.status(400).json({ error: 'Offset inválido.' });
                }
            } catch (error) {
                return res.status(500).json({ error: 'Erro ao buscar o offset.' });
            }
        }

        try {
            let query = db.collection('products').limit(pageSize);
            if (startAfterDoc) {
                query = query.startAfter(startAfterDoc);
            }

            const snapshot = await query.get();
            const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            res.status(200).json(products);
        } catch (error) {
            console.error('Erro ao obter produtos:', error);
            res.status(500).json({ error: 'Erro ao obter produtos.' });
        }
    });

    // Rota para buscar produto por ID
    router.get('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const productRef = db.collection('products').doc(id);
            const product = await productRef.get();

            if (!product.exists) {
                return res.status(404).json({ msg: 'Produto não encontrado' });
            }

            res.status(200).json({ id: product.id, ...product.data() });
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            res.status(500).json({ msg: 'Erro ao buscar produto.' });
        }
    });

    // Rota para adicionar um novo produto com upload de imagem
    router.post('/', upload.single('image'), async (req, res) => {
        const { name, price, type, userEmail } = req.body;
        const file = req.file; // Arquivo de imagem enviado

        // Validação dos campos
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ error: 'O campo "name" é obrigatório e deve ser uma string válida.' });
        }
        if (!price || isNaN(price) || parseFloat(price) < 0) {
            return res.status(400).json({ error: 'O campo "price" é obrigatório e deve ser um número não negativo.' });
        }
        if (!type || typeof type !== 'string' || type.trim() === '') {
            return res.status(400).json({ error: 'O campo "type" é obrigatório e deve ser uma string válida.' });
        }
        if (!userEmail || typeof userEmail !== 'string' || userEmail.trim() === '') {
            return res.status(400).json({ error: 'O campo "userEmail" é obrigatório e deve ser uma string válida.' });
        }

        try {
            let imageUrl = null;
            if (file) {
                // Upload da imagem para o Firebase Storage
                const bucket = admin.storage().bucket();
                const fileName = `${Date.now()}-${file.originalname}`;
                const fileUpload = bucket.file(fileName);

                // Envia o arquivo para o Storage
                await fileUpload.save(file.buffer, {
                    contentType: file.mimetype,
                    public: true,
                });

                // Obtém a URL pública da imagem
                imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            }

            // Salvar o produto no Firestore
            const newProduct = {
                name,
                price: parseFloat(price),
                type,
                userEmail,
                imageUrl, 
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            };

            const docRef = await db.collection('products').add(newProduct);
            res.status(201).json({ id: docRef.id, ...newProduct });
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            res.status(500).json({ error: 'Erro ao adicionar produto.' });
        }
    });

    // Rota para excluir um produto
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const productRef = db.collection('products').doc(id);
            const product = await productRef.get();

            if (!product.exists) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }

            await productRef.delete();
            res.status(204).send();
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            res.status(500).json({ error: 'Erro ao excluir produto.' });
        }
    });

  // Rota para atualizar um produto existente com suporte a upload de imagem
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, price, type, userEmail } = req.body;
    const file = req.file; // Arquivo de imagem enviado

    try {
        const productRef = db.collection('products').doc(id);
        const product = await productRef.get();

        if (!product.exists) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        const updatedProduct = {};

        // Atualizando campos do produto, se forem fornecidos
        if (name !== undefined) updatedProduct.name = name;
        if (price !== undefined) {
            const parsedPrice = parseFloat(price);
            if (isNaN(parsedPrice) || parsedPrice < 0) {
                return res.status(400).json({ error: 'O campo "price" deve ser um número não negativo.' });
            }
            updatedProduct.price = parsedPrice;
        }
        if (type !== undefined) updatedProduct.type = type;
        if (userEmail !== undefined) updatedProduct.userEmail = userEmail;
        
        // Se houver uma nova imagem, faz o upload
        if (file) {
            // Upload da nova imagem para o Firebase Storage
            const bucket = admin.storage().bucket();
            const fileName = `${Date.now()}-${file.originalname}`;
            const fileUpload = bucket.file(fileName);

            // Envia o arquivo para o Storage
            await fileUpload.save(file.buffer, {
                contentType: file.mimetype, 
                public: true,
            });

            updatedProduct.imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        }

        updatedProduct.updatedAt = admin.firestore.FieldValue.serverTimestamp();

        await productRef.update(updatedProduct);
        res.status(200).json({ id, ...updatedProduct });
    } catch (error) {
        console.error('Erro ao editar produto:', error);
        res.status(500).json({ error: 'Erro ao editar produto.' });
    }
});
    return router;
};
