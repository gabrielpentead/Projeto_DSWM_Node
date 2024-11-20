import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductList from '../../pages/Home/ProductList'; // Componente de listagem de produtos

const API_URL = '/api/products'; // URL da API que irá buscar os produtos

function SearchResults() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation(); // Usando o hook useLocation para pegar a URL

  // Quando a URL mudar, capturamos o parâmetro 'query'
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search); // Captura os parâmetros da URL
    const query = queryParams.get('query') || ''; // Obtém o valor do parâmetro 'query'
    setSearchQuery(query); // Atualiza o estado com o valor da busca
  }, [location]);

  // Quando o searchQuery mudar, busca os produtos no backend
  useEffect(() => {
    const fetchProducts = async () => {
      if (searchQuery) {
        setLoading(true);
        setError(null); // Limpa erros anteriores

        try {
          const response = await fetch(`${API_URL}?name=${searchQuery}`); // Faz a requisição para a API
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ao buscar produtos: ${errorText}`);
          }
          const data = await response.json();
          setFilteredData(data.products); // Atualiza a lista de produtos filtrados
        } catch (error) {
          console.error('Erro ao buscar produtos:', error);
          setError('Ocorreu um erro ao buscar os produtos. Tente novamente mais tarde.');
        } finally {
          setLoading(false); // Finaliza o carregamento
        }
      }
    };

    fetchProducts();
  }, [searchQuery]);

  return (
    <div className="container-carrinho">
      <div className="search-results-container">
        <h1>Resultados de busca para "{searchQuery}"</h1>

        {loading && <p>Carregando...</p>}
        {error && <p className="error">{error}</p>}

        {filteredData.length > 0 ? (
          <ProductList products={filteredData} /> // Exibe os produtos encontrados
        ) : (
          !loading && <p>Nenhum resultado encontrado para "{searchQuery}"</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
