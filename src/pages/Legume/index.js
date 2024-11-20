// src/page/Legumes.js
import React, { useEffect, useState } from 'react';
import { fetchLegumes } from '../../api'; // Importa a função para buscar produtos de Legumes
import { Link } from 'react-router-dom';

function Legumes() {
    const [legumes, setLegumes] = useState([]); // Estado para armazenar os legumes
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadLegumes = async () => {
            setLoading(true);
            try {
                const data = await fetchLegumes(); // Chama a API para obter os produtos de legumes
                if (Array.isArray(data)) {
                    setLegumes(data); // Atualiza o estado com os produtos de legumes
                } else {
                    throw new Error('Dados inválidos recebidos da API');
                }
            } catch (err) {
                console.error('Erro ao buscar produtos de Legumes:', err);
                setError('Não foi possível carregar os produtos de legumes. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        loadLegumes(); 
    }, []); // O array vazio faz com que o useEffect execute apenas uma vez após o carregamento

    if (loading) return <p>Carregando produtos de legumes...</p>; // Mostra enquanto carrega
    if (error) return <p className="text-danger">{error}</p>; // Exibe erro se houver

    return (
        <main className="row produto-page">
            <div className="col-12">
                <h1 className="categoria-titulo">Legumes</h1>
                <div className="row">
                    {legumes.length === 0 ? (
                        <p>Nenhum produto de legumes disponível no momento.</p> // Caso não haja produtos
                    ) : (
                        legumes.map(legume => (
                            <div key={legume._id || legume.id} className="produto-container-principal col-md-4">
                                <div className="produto-principal">
                                    <Link to={`/products/${legume.id || legume._id}`}>
                                        {/* Verifique se imageUrl está correto */}
                                        <img src={legume.imageUrl || '/default-image.jpg'} alt={legume.name} className="img-fluid" />
                                    </Link>
                                    <span>{legume.name}</span>
                                    <span>
                                        R$ <span className="price">{legume.price.toFixed(2)}</span> <span className="unit">{legume.unit || 'Unidade'}</span>
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

export default Legumes;
