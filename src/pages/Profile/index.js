import { useContext, useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import avatar from '../../assets/avatar.png';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './profile.css';

export default function Profile() {
  const { user, storageUser, setUser, logout } = useContext(AuthContext);

  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || avatar);
  const [imageAvatar, setImageAvatar] = useState(null);
  const [nome, setNome] = useState(user?.nome || '');
  const [email] = useState(user?.email || '');

  const acceptedImageTypes = ['image/jpeg', 'image/png'];

  function handleFile(e) {
    const file = e.target.files[0];
    if (file) {
      if (acceptedImageTypes.includes(file.type)) {
        setImageAvatar(file);
        setAvatarUrl(URL.createObjectURL(file));
      } else {
        toast.error('Envie uma imagem do tipo PNG ou JPEG');
        setImageAvatar(null);
      }
    }
  }

  async function handleUpload() {
    const formData = new FormData();
    formData.append('image', imageAvatar);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.downloadURL; // Retorna a URL da imagem
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast.error('Erro ao fazer upload da imagem. Tente novamente mais tarde.');
      throw error;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!nome) {
      toast.error('O nome não pode estar vazio.');
      return;
    }

    try {
      let downloadURL;
      if (imageAvatar) {
        downloadURL = await handleUpload();
      }

      await axios.put(`http://localhost:5000/api/users/${user.uid}`, {
        nome,
        avatarUrl: downloadURL || user.avatarUrl,
      });

      const updatedUser = { ...user, nome, avatarUrl: downloadURL || user.avatarUrl };
      setUser(updatedUser);
      storageUser(updatedUser);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar o perfil:', error);
      toast.error('Erro ao atualizar o perfil. Tente novamente mais tarde.');
    }
  }

  return (
    <div className="content">
      <div className="container">
        <form className="form-profile" onSubmit={handleSubmit}>
          

          <label>Nome</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

          <label>Email</label>
          <input type="text" value={email} disabled />

          <button type="submit">Salvar</button>
        </form>
      </div>

      <div className="container">
        <form>
          <Link to="/endereco">
            <button className="minhas-vendas-btn">Endereço</button>
          </Link>

          <Link to="/minhas-vendas">
            <button className="minhas-vendas-btn">Gerenciar Vendas</button>
          </Link>

          <button className="logout-btn" onClick={logout}>
            Sair
          </button>
        </form>
      </div>
    </div>
  );
}
