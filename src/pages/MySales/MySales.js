import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const API_URL = 'http://localhost:5000/api/products';

function ProductManagement() {
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [unit, setUnit] = useState('');
    const [type, setType] = useState('');
    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser ;
        if (user) {
            setUserEmail(user.email);
            loadProducts(user.email); // Carregar produtos após autenticação
        }
    }, []);

    const getAuthToken = async () => {
        const auth = getAuth();
        const user = auth.currentUser ;
        if (user) {
            return await user.getIdToken(); // Obtendo o token do usuário
        }
        throw new Error('Usuário não autenticado');
    };

    const loadProducts = async (email) => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            const filteredProducts = response.data.filter(product => product.userEmail === email);
            setProducts(filteredProducts);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            toast.error('Erro ao carregar produtos. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        if (!imageFile) {
            toast.error('Selecione uma imagem para enviar.');
            return false;
        }
        if (!name) {
            toast.error('O nome do produto é obrigatório.');
            return false;
        }
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            toast.error('O preço deve ser um número positivo.');
            return false;
        }
        if (!unit) {
            toast.error('Selecione uma unidade.');
            return false;
        }
        if (!type) {
            toast.error('Selecione um tipo de produto.');
            return false;
        }
        return true;
    };

    const addProduct = async () => {
        if (!validateForm()) {
            return; // Não prosseguir se a validação falhar
        }
    
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', parseFloat(price));
        formData.append('unit', unit);
        formData.append('type', type);
        formData.append('userEmail', userEmail);
        if (imageFile) {
            formData.append('image', imageFile); // Envia a imagem no FormData
        }
    
        try {
            const token = await getAuthToken();
            await axios.post(API_URL, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Autorização (se necessário)
                },
            });
            toast.success('Produto adicionado com sucesso!');
            resetForm();
            loadProducts(userEmail); // Recarregar produtos após adicionar
        } catch (error) {
            console.error('Erro ao adicionar o produto:', error);
            toast.error('Erro ao adicionar o produto. Tente novamente mais tarde.');
        }
    };

    const editProduct = (productId) => {
        const productToEdit = products.find(product => product.id === productId);
        if (productToEdit && productToEdit.userEmail === userEmail) {
            setImageFile(null);
            setImagePreview(null);
            setName(productToEdit.name);
            setPrice(productToEdit.price);
            setUnit(productToEdit.unit);
            setType(productToEdit.type);
            setCurrentProductId(productId);
            setIsEditing(true);
        } else {
            toast.error('Você não tem permissão para editar este produto.');
        }
    };

    const updateProduct = async () => {
        if (!currentProductId) {
            toast.error('ID do produto não encontrado.');
            return;
        }

        if (!validateForm()) {
            return; // Não prosseguir se a validação falhar
        }

        const formData = new FormData();
        if (imageFile) {
            formData.append('image', imageFile);
        }
        formData.append('name', name);
        formData.append('price', parseFloat(price));
        formData.append('unit', unit);
        formData.append('type', type);
        formData.append('userEmail', userEmail);

        try {
            const token = await getAuthToken();
            const response = await axios.put(`${API_URL}/${currentProductId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                toast.success('Produto editado com sucesso!');
                resetForm();
                loadProducts(userEmail); // Recarregar produtos após editar
            } else {
                toast.error('Erro ao editar o produto. Tente novamente mais tarde.');
            }
        } catch (error) {
            console.error('Erro ao editar o produto:', error);
            toast.error('Erro ao editar o produto. Tente novamente mais tarde.');
        }
    };

    const deleteProduct = async (productId) => {
        if (!productId) {
            console.error('O ID do produto não pode ser undefined');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${productId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                toast.success('Produto excluído com sucesso');
                loadProducts(userEmail); 
            } else {
                console.error('Erro ao excluir produto:', response.statusText);
                toast.error('Erro ao excluir produto. Tente novamente mais tarde.');
            }
        } catch (error) {
            console.error('Erro ao fazer a requisição:', error);
            toast.error('Erro ao excluir produto. Tente novamente mais tarde.');
        }
    };

    const resetForm = () => {
        setImageFile(null);
        setImagePreview(null);
        setName('');
        setPrice('');
        setUnit('');
        setType('');
        setIsEditing(false);
        setCurrentProductId(null);
    };

    return (
        <main className="row produto-page">
        <div className="col-12">
            <h1>Gestão de produtos</h1>
            <div className="row">
                <div className='container'>
            <form>
                
                <h2>{isEditing ? 'Editar produto' : 'Novo produto'}</h2>
                <label htmlFor="image">Imagem:</label>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={(e) => {
                        setImageFile(e.target.files[0]);
                        setImagePreview(URL.createObjectURL(e.target.files[0]));
                    }}
                />
                <div className="produto-principal">
                {imagePreview && <img src={imagePreview} alt="Preview" className="img-fluid" />}
                </div>
                <label htmlFor="name">Nome do produto:</label>
                <input
                    type="text"
                    id="name"
                    placeholder="produto"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="price">Valor:</label>
                <input
                    type="number"
                    id="price"
                    placeholder="valor"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                /> 
                <label htmlFor="unit">Unidade:</label>
                <select id="unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
                    <option value="">Selecione a unidade</option>
                    <option value="Kg">Kg</option>
                    <option value="Unidade">Unidade</option>
                </select>
                <label htmlFor="type">Tipo:</label>
                <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">Selecione o tipo </option>
                    <option value="fruta">fruta</option>
                    <option value="verdura">verdura</option>
                    <option value="hortalica">hortalica</option>
                    <option value="legume">legumes</option>
                    <option value="outro">outros</option>
                </select>
                <button type="button" onClick={isEditing ? updateProduct : addProduct}>
                    {isEditing ? 'Atualizar produto' : 'Adicionar produto'}
                </button>
                
            </form></div>
            {loading ? (
                <p>Carregando produtos...</p>
            ) : (
                <div className="col-12">
                    <h2>Produtos cadastrados</h2>
                    <div>
                        {products.map((product) => (
                            <div key={product.id} className="produto-container-principal">
                                <div className="produto-principal">
                                    <Link to={`/products/${product.id}`}>
                                        <img src={product.imageUrl} alt={product.name} className="img-fluid" />
                                    </Link>
                                    <span>{product.name}</span>
                                    <span>
                                        R$ <span className="price">{product.price}</span> <span className="unit">{product.unit}</span>
                                    </span>
                                    <button type="button" onClick={() => editProduct(product.id)}>
                                        Editar
                                    </button>
                                    <button type="button" onClick={() => deleteProduct(product.id)}>
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            </div>
        </div>
    </main>
    );
}

export default ProductManagement;