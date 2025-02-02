// uploadProducts.js
const express = require('express');
const { collection, addDoc } = require('firebase/firestore');
const router = express.Router();
const db = require('../config/firebase.js'); // Certifique-se de que este arquivo exporta a instância do Firestore

const products = [
    {
        "id": 1,
        "imageUrl": "http://localhost:5000/imagens/abacaxi.jpg",
        "name": "Abacaxi",
        "price": 10.99,
        "unit": "Unidade",
        "type": "fruta"
        
    },
    {
        "id": 2,
        "imageUrl": "http://localhost:5000/imagens/amora.jpg",
        "name": "Amora",
        "price": 44.99,
        "unit": "Kg",
        "type": "fruta"
    },
    {
        "id": 3,
        "imageUrl": "http://localhost:5000/imagens/banana.jpg",
        "name": "Banana",
        "price": 1.99,
        "unit": "kg",
        "type": "fruta"
    },
    {
        "id": 4,
        "imageUrl": "http://localhost:5000/imagens/figo.jpg",
        "name": "Figo",
        "price": 64.99,
        "unit": "Kg",
        "type": "fruta"
    },
    {
        "id": 5,
        "imageUrl": "http://localhost:5000/imagens/kiwi.jpg",
        "name": "Kiwi",
        "price": 5.99,
        "unit": "Kg",
        "type": "fruta"
    },
    {
        "id": 6,
        "imageUrl": "http://localhost:5000/imagens/laranja.jpg",
        "name": "Laranja",
        "price": 7.99,
        "unit": "Unidade",
        "type": "fruta"
    },
    {
        "id": 7,
        "imageUrl": "http://localhost:5000/imagens/limão.jpg",
        "name": "Limão",
        "price": 6.98,
        "unit": "Kg",
        "type": "fruta"
    },
    {
        "id": 8,
        "imageUrl": "http://localhost:5000/imagens/mamão.jpg",
        "name": "Mamão",
        "price": 4.99,
        "unit": "Kg",
        "type": "fruta"
    },
    {
        "id": 9,
        "imageUrl": "http://localhost:5000/imagens/manga.jpg",
        "name": "Manga",
        "price": 6.85,
        "unit": "250g",
        "type": "fruta"
    },
    {
        "id": 10,
        "imageUrl": "http://localhost:5000/imagens/melancia.jpg",
        "name": "Melancia",
        "price": 8.79,
        "unit": "Kg",
        "type": "fruta"
    },
    {
        "id": 11,
        "imageUrl": "http://localhost:5000/imagens/morango.png",
        "name": "Morango",
        "price": 14.99,
        "unit": "kg",
        "type": "fruta"
    },
    {
        "id": 12,
        "imageUrl": "http://localhost:5000/imagens/uva.jpg",
        "name": "Uva",
        "price": 7.99,
        "unit": "kg",
        "type": "fruta"
    },
    {
        "id": 13,
        "imageUrl": "http://localhost:5000/imagens/uva.jpg",
        "name": "Uva Thompson",
        "price": 14.97,
        "unit": "500g",
        "type": "fruta"
    },
    {
        "id": 14,
        "imageUrl": "http://localhost:5000/imagens/alface.png",
        "name": "Alface",
        "price": 2.59,
        "unit": "Unidade",
        "type": "verdura"
    },
    {
        "id": 15,
        "imageUrl": "http://localhost:5000/imagens/berinjela.jpg",
        "name": "Berinjela",
        "price": 4.69,
        "unit": "Kg",
        "type": "hortalica"
    },
    {
        "id": 16,
        "imageUrl": "http://localhost:5000/imagens/brocolis.jpg",
        "name": "Brócolis",
        "price": 11.7,
        "unit": "Kg",
        "type": "hortalica"
    },
    {
        "id": 17,
        "imageUrl": "http://localhost:5000/imagens/couve flor.jpg",
        "name": "Couve Flor",
        "price": 14.9,
        "unit": "250g",
        "type": "hortalica"
    },
    {
        "id": 18,
        "imageUrl": "http://localhost:5000/imagens/cebola roxa.jpg",
        "name": "Cebola Roxa",
        "price": 6.99,
        "unit": "kg",
        "type": "verdura"
    },
    {
        "id": 19,
        "imageUrl": "http://localhost:5000/imagens/ervilha.jpg",
        "name": "Ervilha",
        "price": 4.99,
        "unit": "kg",
        "type": "hortalica"
    },
    {
        "id": 20,
        "imageUrl": "http://localhost:5000/imagens/espinafre.jpg",
        "name": "Espinafre",
        "price": 9.95,
        "unit": "250g",
        "type": "hortalica"
    },
    {
        "id": 21,
        "imageUrl": "http://localhost:5000/imagens/hortela.jpg",
        "name": "Hortelã",
        "price": 3.49,
        "unit": "100g",
        "type": "verdura"
    },
    {
        "id": 22,
        "imageUrl": "http://localhost:5000/imagens/milho.jpg",
        "name": "Milho",
        "price": 0.5,
        "unit": "Unidade",
        "type": "hortalica"
    },
    {
        "id": 23,
        "imageUrl": "http://localhost:5000/imagens/pimentão.jpg",
        "name": "Pimentão",
        "price": 15.89,
        "unit": "Kg",
        "type": "hortalica"
    },
    {
        "id": 24,
        "imageUrl": "http://localhost:5000/imagens/pepino.jpg",
        "name": "Pepino",
        "price": 15.9,
        "unit": "Kg",
        "type": "hortalica"
    },
    {
        "id": 25,
        "imageUrl": "http://localhost:5000/imagens/repolho.jpg",
        "name": "Repolho",
        "price": 5.49,
        "unit": "Kg",
        "type": "hortalica"
    },
    {
        "id": 26,
        "imageUrl": "http://localhost:5000/imagens/rabanete.jpg",
        "name": "Rabanete",
        "price": 3.5,
        "unit": "250g",
        "type": "hortalica"
    },
    {
        "id": 27,
        "imageUrl": "http://localhost:5000/imagens/tomate.jpg",
        "name": "Tomate",
        "price": 6.99,
        "unit": "kg",
        "type": "hortalica"
    },
    {
        "id": 28,
        "imageUrl": "http://localhost:5000/imagens/abobora.jpg",
        "name": "Abobora",
        "price": 9.99,
        "unit": "Unidade",
        "type": "legume"
    },
    {
        "id": 29,
        "imageUrl": "http://localhost:5000/imagens/pao.jpg",
        "name": "Pão Caseiro",
        "price": 9.99,
        "unit": "Unidade",
        "type": "outro"
    },
    {
        "id": 30,
        "imageUrl": "http://localhost:5000/imagens/bolacha.jpg",
        "name": "Bolacha Caseira",
        "price": 21.69,
        "unit": "Kg",
        "type": "outro"
    },
    {
        "id": 31,
        "imageUrl": "http://localhost:5000/imagens/queijo.jpg",
        "name": "Queijo Artesanal",
        "price": 27.9,
        "unit": "Kg",
        "type": "outro"
    },
    {
        "id": 32,
        "imageUrl": "http://localhost:5000/imagens/geleia artesanal.jpg",
        "name": "Geleia Artesanal",
        "price": 17.99,
        "unit": "500g",
        "type": "outro"
    },
    {
        "id": 33,
        "imageUrl": "http://localhost:5000/imagens/Mel de abelha.jpg",
        "name": "Mel de Abelha",
        "price": 27.89,
        "unit": "Kg",
        "type": "outro"
    }
];

const uploadProducts = async (req, res) => {
    const productsCollection = collection(db, 'products'); // Nome da coleção onde os produtos serão armazenados

    for (const product of products) {
        try {
            // Adiciona o produto à coleção no Firestore
            await addDoc(productsCollection, product);
            console.log(`Produto ${product.name} adicionado com sucesso!`);
        } catch (error) {
            console.error(`Erro ao adicionar o produto ${product.name}:`, error);
            return res.status(500).json({ message: `Erro ao adicionar o produto ${product.name}` });
        }
    }

    res.status(200).json({ message: 'Todos os produtos foram adicionados com sucesso!' });
};


// Chama a função para realizar o upload dos produtos
router.post('/', uploadProducts);

module.exports = router;