import React, { useEffect, useState } from 'react';
import { fetchFrutas } from '../../api'; // Importa a função para buscar produtos de Frutas
import { Link } from 'react-router-dom';

function Frutas() {
    const [frutas, setFrutas] = useState([]); // Corrigido de setHortalicas para setFrutas
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadFrutas = async () => {
            setLoading(true);
            try {
                const data = await fetchFrutas();  // Chama a API para obter os produtos de frutas
                console.log("Frutas recebidas:", data); // Verifique os dados aqui
                if (Array.isArray(data)) {
                    setFrutas(data); // Atualiza o estado com os produtos de frutas
                } else {
                    throw new Error('Dados inválidos recebidos da API');
                }
            } catch (err) {
                console.error('Erro ao buscar produtos de Frutas:', err);
                setError('Não foi possível carregar os produtos de frutas. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        loadFrutas(); 
    }, []); // O array vazio faz com que o useEffect execute apenas uma vez após o carregamento

    if (loading) return <p>Carregando produtos de frutas...</p>; // Mostra enquanto carrega
    if (error) return <p className="text-danger">{error}</p>; // Exibe erro se houver

    return (
        <main className="row produto-page">
            <div className="col-12">
                <h1 className="categoria-titulo">Frutas</h1>
                <div className="row">
                    {frutas.length === 0 ? (
                        <p>Nenhum produto de frutas disponível no momento.</p> // Caso não haja produtos
                    ) : (
                        frutas.map(fruta => (
                            <div key={fruta.id || fruta._id} className="produto-container-principal col-md-4">
                                <div className="produto-principal">
                                    <Link to={`/products/${fruta.id || fruta._id}`}>
                                        {/* Verifique se imageUrl está correto */}
                                        <img src={fruta.imageUrl || '/default-image.jpg'} alt={fruta.name} className="img-fluid" />
                                    </Link>
                                    <span>{fruta.name}</span>
                                    <span>
                                        R$ <span className="price">{fruta.price.toFixed(2)}</span> <span className="unit">{fruta.unit || 'Unidade'}</span>
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

export default Frutas;
