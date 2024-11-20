import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/products',
});
 
// Função para tratar erros
const handleError = (error) => {
    const message = error.response 
        ? `Erro ${error.response.status}: ${error.response.data.message || error.response.data}`
        : error.message;
    console.error('Erro ao interagir com a API:', message);
    throw new Error(message); // Re lança o erro com uma mensagem mais clara
};

// Função para buscar todos os produtos com filtragem
export const fetchProducts = async (params = {}) => {
    try {
        const response = await api.get('/', { params });
        console.log('Dados recebidos:', response.data); // Log dos dados recebidos
        if (!Array.isArray(response.data)) {
            throw new Error('Dados inválidos recebidos da API');
        }
        const filteredProducts = response.data.filter(product => product.type === params.type);
        console.log('Produtos filtrados:', filteredProducts); // Log dos produtos filtrados
        return filteredProducts; 
    } catch (error) {
        handleError(error);
    }
};


// Funções para buscar produtos por tipo

export const fetchFrutas = () => fetchProducts({ type: 'fruta' });
export const fetchOutros = () => fetchProducts({ type: "outro" });
export const fetchHortalica = () => fetchProducts({ type: 'hortalica' });
export const fetchLegumes = () => fetchProducts({ type: 'legume' });
export const fetchVerduras = () => fetchProducts({ type: 'verdura' });

// Função para buscar produtos com base em critérios de filtragem
export const filterProducts = (filters) => fetchProducts(filters);

// Função para adicionar um novo produto
export const addProduct = async (product) => {
    try {
        const response = await api.post('/add', product);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};