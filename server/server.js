const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Verificar se as variáveis de ambiente necessárias estão definidas
if (!process.env.DATABASE_URL || !process.env.STORAGE_BUCKET) {
    console.error('As variáveis de ambiente DATABASE_URL e STORAGE_BUCKET devem ser definidas.');
    process.exit(1);
}

// Inicializar o Firebase Admin
const initializeFirebase = () => {
    const serviceAccount = require(process.env.DATABASE_URL);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.STORAGE_BUCKET
    });
};

initializeFirebase();
const db = admin.firestore();
const app = express();

// Função para configurar middlewares
function setupMiddlewares(app) {
    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(morgan('dev'));
    app.use(cookieParser());
    app.use(cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    
    app.use((req, res, next) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        next();
    });
    
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
}

// Configurar middlewares
setupMiddlewares(app);

// Importar rotas após a inicialização do Firebase
const productsRouter = require('./routes/products')(db);
const filtersRouter = require('./routes/filters')(db);
const enderecoRouter = require('./routes/endereco')(db);

// Rota de teste
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'O servidor está funcionando!' });
});

// Configurar rotas
app.use('/api/products', productsRouter);
app.use('/api/filters', filtersRouter);
app.use('/api/endereco', enderecoRouter);


// Middleware para tratamento de rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ msg: 'Rota não encontrada' });
});

app.use(errorHandler);

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});