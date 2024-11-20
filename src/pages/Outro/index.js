// src/page/Outros.js
import React, { useEffect, useState } from 'react';
import { fetchOutros } from '../../api'; // Importa a função para buscar produtos de Outros
import { Link } from 'react-router-dom';

function Outros() {
    const [outros, setOutros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadOutros = async () => {
            setLoading(true);
            try {
                const data = await fetchOutros(); // Chama a API para obter os produtos de outros
                if (Array.isArray(data)) {
                    setOutros(data); // Atualiza o estado com os produtos de outros
                } else {
                    throw new Error('Dados inválidos recebidos da API');
                }
            } catch (err) {
                console.error('Erro ao buscar produtos de Outros:', err);
                setError('Não foi possível carregar os produtos de outros. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        loadOutros();
    }, []); // O array vazio faz com que o useEffect execute apenas uma vez após o carregamento

    if (loading) return <p>Carregando produtos de outros...</p>; // Mostra enquanto carrega
    if (error) return <p className="text-danger">{error}</p>; // Exibe erro se houver

    return (
        <main className="row produto-page">
            <div className="col-12">
                <h1 className="categoria-titulo">Outros</h1>
                <div className="row">
                    {outros.length === 0 ? (
                        <p>Nenhum produto de outros disponível no momento.</p> // Caso não haja produtos
                    ) : (
                        outros.map(outro => (
                            <div key={outro._id || outro.id} className="produto-container-principal col-md-4">
                                <div className="produto-principal">
                                    <Link to={`/products/${outro.id || outro._id}`}>
                                        {/* Verifique se imageUrl está correto */}
                                        <img src={outro.imageUrl || '/default-image.jpg'} alt={outro.name} className="img-fluid" />
                                    </Link>
                                    <span>{outro.name}</span>
                                    <span>
                                        R$ <span className="price">{outro.price.toFixed(2)}</span> <span className="unit">{outro.unit || 'Unidade'}</span>
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}

export default Outros;
