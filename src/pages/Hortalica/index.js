// src/page/Hortalicas.js
import React, { useEffect, useState } from 'react';
import { fetchHortalica } from '../../api'; // Importa a função para buscar produtos de Hortalicas
import { Link } from 'react-router-dom';

function Hortalicas() {
    const [hortalicas, setHortalicas] = useState([]); // Corrigido de setFrutas para setHortalicas
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadHortalicas = async () => {
            setLoading(true); 
            try {
                const data = await fetchHortalica();  // Chama a API para obter os produtos
                console.log("Hortalicas recebidas:", data); // Verifique os dados aqui
                if (Array.isArray(data)) {
                    setHortalicas(data); // Atualiza o estado com os produtos de hortaliças
                } else {
                    throw new Error('Dados inválidos recebidos da API');
                }
            } catch (err) {
                console.error('Erro ao buscar produtos de Hortalicas:', err);
                setError('Não foi possível carregar os produtos de hortaliças. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        loadHortalicas(); 
    }, []); // O array vazio faz com que o useEffect execute apenas uma vez após o carregamento

    if (loading) return <p>Carregando produtos de hortaliças...</p>; // Mostra enquanto carrega
    if (error) return <p className="text-danger">{error}</p>; // Exibe erro se houver

    return (
        <main className="row produto-page">
            <div className="col-12">
                <h1 className="categoria-titulo">Hortaliças</h1>
                <div className="row">
                    {hortalicas.length === 0 ? (
                        <p>Nenhum produto de hortaliças disponível no momento.</p> // Caso não haja produtos
                    ) : (
                        hortalicas.map(hortalica => (
                            <div key={hortalica.id || hortalica._id} className="produto-container-principal col-md-4">
                                <div className="produto-principal">
                                    <Link to={`/products/${hortalica.id || hortalica._id}`}>
                                        {/* Verifique se imageUrl está correto */}
                                        <img src={hortalica.imageUrl || '/default-image.jpg'} alt={hortalica.name} className="img-fluid" />
                                    </Link>
                                    <span>{hortalica.name}</span>
                                    <span>
                                        R$ <span className="price">{hortalica.price.toFixed(2)}</span> <span className="unit">{hortalica.unit || 'Unidade'}</span>
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

export default Hortalicas;
