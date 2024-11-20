// src/page/Verduras.js
import React, { useEffect, useState } from 'react';
import { fetchVerduras } from '../../api'; // Importa a função para buscar Verduras produtos
import { Link } from 'react-router-dom';

function Verduras() {
    const [verduras, setVerduras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadVerduras = async () => {
            setLoading(true); 
            try {
                const data = await fetchVerduras();
                if (Array.isArray(data)) {
                    setVerduras(data); 
                } else {
                    throw new Error('Dados inválidos recebidos da API');
                }
            } catch (err) {
                console.error('Erro ao buscar Verduras produtos:', err);
                setError('Não foi possível carregar os Verduras produtos. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        loadVerduras(); 
    }, []);

    if (loading) return <p>Carregando Verduras produtos...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <main className="row produto-page">
            <div className="col-12">
                <h1 className="categoria-titulo">Verduras</h1>
                <div className="row">
                    {verduras.length === 0 ? (
                        <p>Nenhum Verdura produto disponível no momento.</p>
                    ) : (
                        verduras.map(verdura => (
                            <div key={verdura.id || verdura._id} className="produto-container-principal col-md-4">
                                <div className="produto-principal">
                                    <Link to={`/products/${verdura.id || verdura._id}`}>
                                        <img src={verdura.imageUrl || '/default-image.jpg'} alt={verdura.name} className="img-fluid" />
                                    </Link>
                                    <span>{verdura.name}</span>
                                    <span>
                                        R$ <span className="price">{verdura.price.toFixed(2)}</span> <span className="unit">{verdura.unit || 'Unidade'}</span>
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

export default Verduras;
