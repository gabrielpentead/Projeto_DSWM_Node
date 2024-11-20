import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddressForm = ({ userEmail }) => {
    // Estado do formulário
    const [data, setData] = useState({
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
    });
    
    // Estado para o endereço salvo
    const [savedAddress, setSavedAddress] = useState(null);
    
    // Estado para controlar modo de edição
    const [isEditing, setIsEditing] = useState(false); 
    
    // Estado para controlar o loading do formulário
    const [isLoading, setIsLoading] = useState(false);

    // UseEffect para buscar o endereço salvo do usuário
    useEffect(() => {
        const fetchAddress = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`https://us-central1-SEU-PROJETO.cloudfunctions.net/getEndereco/${userEmail}`);
                setSavedAddress(response.data);
                setData(response.data);  // Preenche o formulário com o endereço salvo
                setIsEditing(false);  // Se o endereço existir, ele não está em modo de edição
            } catch (error) {
                console.error('Erro ao buscar o endereço:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddress();
    }, [userEmail]);

    // Função para atualizar os dados no estado
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
   
    // Função para lidar com a mudança do CEP (busca automática dos dados)
    const handleCepChange = async (e) => {
        const cep = e.target.value;
        setData({ ...data, cep });

        if (cep.length === 8) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                const { logradouro, bairro, localidade, uf } = response.data;

                setData(prevData => ({
                    ...prevData,
                    rua: logradouro || '',
                    bairro: bairro || '',
                    cidade: localidade || '',
                    estado: uf || ''
                }));
            } catch (error) {
                console.error('Erro ao buscar o CEP:', error);
                alert('CEP inválido ou não encontrado. Verifique e tente novamente.');
            }
        }
    };

    // Função de envio do formulário (POST ou PUT dependendo do estado de edição)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let response;
            if (isEditing) {
                // Atualiza o endereço
                response = await axios.put(`https://us-central1-SEU-PROJETO.cloudfunctions.net/createEndereco/${savedAddress.id}`, data);
                alert('Endereço atualizado com sucesso!');
            } else {
                // Cadastra um novo endereço
                response = await axios.post('https://us-central1-SEU-PROJETO.cloudfunctions.net/createEndereco', { ...data, userEmail });
                alert('Endereço cadastrado com sucesso!');
            }

            setSavedAddress(response.data);  // Atualiza o endereço salvo
            setIsEditing(false);  // Sai do modo de edição
        } catch (error) {
            console.error('Erro ao salvar o endereço:', error);
            alert('Erro ao salvar o endereço. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>{isEditing ? 'Editar Endereço' : 'Cadastro de Endereço'}</h2>
            {isLoading ? (
                <p>Carregando...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="cep"
                        placeholder="CEP"
                        onChange={handleCepChange}
                        value={data.cep}
                        required
                    />
                    <input
                        type="text"
                        name="rua"
                        placeholder="Rua"
                        onChange={handleChange}
                        value={data.rua}
                        required
                    />
                    <input
                        type="text"
                        name="numero"
                        placeholder="Número"
                        onChange={handleChange}
                        value={data.numero}
                        required
                    />
                    <input
                        type="text"
                        name="bairro"
                        placeholder="Bairro"
                        onChange={handleChange}
                        value={data.bairro}
                        required
                    />
                    <input
                        type="text"
                        name="cidade"
                        placeholder="Cidade"
                        onChange={handleChange}
                        value={data.cidade}
                        required
                    />
                    <input
                        type="text"
                        name="estado"
                        placeholder="Estado"
                        onChange={handleChange}
                        value={data.estado}
                        required
                    />
                    <button type="submit">
                        {isEditing ? 'Atualizar Endereço' : 'Cadastrar Endereço'}
                    </button>
                </form>
            )}

            {savedAddress && !isEditing && (  // Exibe o endereço salvo
                <div>
                    <h3>Endereço Cadastrado:</h3>
                    <p>Rua: {savedAddress.rua}</p>
                    <p>Número: {savedAddress.numero}</p>
                    <p>Bairro: {savedAddress.bairro}</p>
                    <p>Cidade: {savedAddress.cidade}</p>
                    <p>Estado: {savedAddress.estado}</p>
                    <p>CEP: {savedAddress.cep}</p>
                    <button onClick={() => setIsEditing(true)}>Editar Endereço</button>
                </div>
            )}
        </div>
    );
};

export default AddressForm;
