// src/page/Home/ProductList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products/'); // URL da API
                if (!response.ok) {
                    throw new Error('Erro ao buscar produtos: ' + response.statusText);
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div>Carregando produtos...</div>; // Mensagem de carregamento
    }

    if (error) {
        return <div>Erro: {error}</div>; // Mensagem de erro
    }

    if (!products || products.length === 0) {
        return <div>Nenhum produto disponível.</div>; // Mensagem caso não haja produtos
    }

    return (
        <main className="row produto-page">
            <div className="col-12">
                <div className="row">
                    {products.map((product) => (
                        <div key={product._id} className="produto-container-principal">
                            <div className="produto-principal">
                                    <Link to={`/products/${product.id}`}>
                                        <img src={product.imageUrl} 
                                        alt={product.name} 
                                        className="img-fluid" 
                                        />
                                    </Link>
                                <span>{product.name}</span>
                                <span>
                                    R$ <span className="price">{product.price.toFixed(2)}</span> <span className="unit">{product.unit}</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default ProductList;