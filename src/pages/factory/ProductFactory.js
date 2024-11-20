// src/page/factory/ProductFactory.js
import axios from 'axios';

// URL da API (pode ser movida para variáveis de ambiente)
const API_URL = process.env.API_URL || 'http://localhost:5000/api/products';

// Cria uma instância do Axios com a URL base
const apiClient = axios.create({
    baseURL: API_URL,
});

class ProductFactory {
    constructor() {
        // Implementa o padrão Singleton
        if (!ProductFactory.instance) {
            ProductFactory.instance = this;
        }
        return ProductFactory.instance;
    }

    /**
     * Método para buscar todos os produtos da API.
     * @returns {Promise<Array>} - Lista de produtos.
     * @throws {Error} - Se ocorrer um erro ao buscar os produtos.
     */
    async fetchProductsFromAPI() {
        return this.fetchData(''); // Chama fetchData com endpoint vazio para buscar todos os produtos
    }

    /**
     * Método para buscar produtos por tipo.
     * @param {string} type - Tipo de produto a ser buscado.
     * @returns {Promise<Array>} - Lista de produtos filtrados pelo tipo.
     * @throws {Error} - Se o tipo for inválido ou ocorrer um erro ao buscar os produtos.
     */
    async fetchProductsByType(type) {
        const validTypes = ['fruta', 'verdura', 'legume', 'hortalica', 'outro'];

        // Valida o tipo
        if (!validTypes.includes(type)) {
            throw new Error(`Tipo inválido: ${type}. Tipos válidos são: ${validTypes.join(', ')}`);
        }

        return this.fetchData(type); // Chama fetchData com o tipo como endpoint
    }

    /**
     * Método auxiliar para buscar dados da API.
     * @param {string} endpoint - Endpoint adicional para a requisição.
     * @returns {Promise<Array>} - Dados retornados da API.
     * @throws {Error} - Se ocorrer um erro ao buscar os dados.
     */
    async fetchData(endpoint) {
        if (!endpoint) {
            throw new Error('Endpoint não pode ser vazio.'); // Verifica se o endpoint é vazio
        }

        const url = `${API_URL}/${endpoint}`; // Monta a URL completa
        console.log('Chamando URL:', url); // Log da URL chamada

        try {
            const response = await apiClient.get(endpoint);
            return response.data; // Retorna os dados
        } catch (error) {
            console.error('Erro ao buscar dados da API:', error);
            throw new Error('Erro ao buscar dados da API: ' + (error.response ? `${error.response.status} - ${error.response.data.message || error.message}` : error.message));
        }
    }
}

// Congela a instância para evitar modificações
const instance = new ProductFactory();
Object.freeze(instance);

export default instance;