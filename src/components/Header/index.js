import React, { useState, useCallback, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import Logo from './LogoFeiraGreen.png';
import Carrinho from './carrinho-carrinho.png';
import Pesquisa from './pesquisa.png';
import Usuario from './usuario.png';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { AuthContext } from '../../contexts/auth';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Usando o hook de navegação do react-router-dom

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      console.log('Pesquisando por:', searchQuery); 
      // Redireciona para a página de pesquisa corretamente com query string
      navigate(`/search?query=${searchQuery}`);
      event.preventDefault(); // Previne o comportamento padrão do formulário
    }
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container className="navbar navbar-expand-lg">
        <Link to="/home" className="navbar-brand">
          <img id="logo" src={Logo} alt="Logo" />
        </Link>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="nav-item nav-link navbar-collapse justify-content-center" id="nav-link">
            <Nav.Link href="/fruta" id="frutas-menu">Frutas</Nav.Link>
            <Nav.Link href="/verdura" id="verdura-menu">Verduras</Nav.Link>
            <Nav.Link href="/hortalica" id="hortalica-menu">Hortaliças</Nav.Link>
            <Nav.Link href="/legume" id="legums-menu">Legumes</Nav.Link>
            <Nav.Link href="/outro" id="outros-menu">Outros</Nav.Link>
          </Nav>

          <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
            <Form.Control
              value={searchQuery}
              onChange={handleSearch}
              onKeyPress={handleKeyPress} 
              placeholder="Pesquisar..."
            />
            <Link 
              to={`/search?query=${searchQuery}`} // Corrigido para passar o valor como query string
              className="nav-item nav-link btn btn-outline-success"
            >
              <img src={Pesquisa} alt="Pesquisa" width="20" />
            </Link>

            {user ? ( 
              <Link to="/profile">
                <img 
                  src={user.avatarUrl} 
                  alt="Foto de Perfil" 
                  className="profile-image" 
                  width="20" 
                />
              </Link>
            ) : (
              <Link to="/profile" className="nav-item nav-link btn btn-outline-success">
                <img src={Usuario} alt="User " width="20" />
              </Link>
            )}

            <Link 
              to="/carrinho" 
              className="nav-item nav-link btn btn-outline-success"
            >
              <img src={Carrinho} alt="Carrinho" width="20" />
            </Link>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
