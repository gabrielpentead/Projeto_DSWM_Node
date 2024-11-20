const errorHandler = (err, req, res, next) => {
    console.error(err.stack); 
    // Resposta JSON com status 500
    res.status(500).json({ message: 'Ocorreu um erro no servidor.' }); 
};

module.exports = errorHandler;  