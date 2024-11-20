import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

function Paginapd() {
  const [produto, setProduto] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const { id } = useParams();

    useEffect(() => {
      const fetchProductData = async () => {
          setLoading(true);
          setErrorMessage(null);
          try {
              
              const productResponse = await fetch(`http://localhost:5000/api/products/${id}`);
              const productData = await productResponse.json();
              setProduto(productData);

              const relatedResponse = await fetch(`http://localhost:5000/api/products?type=${productData.type}`);
              const relatedData = await relatedResponse.json(); 
              setRelatedProducts(relatedData.filter(product => product.id !== id));

          } catch (error) {
              setErrorMessage(error.message);
              console.error('Erro ao buscar dados do produto:', error);
          } finally {
              setLoading(false);
          }
      };

      if (id) {
          fetchProductData();
      }}, 
      [id]);


  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const addToCart = (product) => {
    const existingCart = getCartFromCookies();
    const updatedCart = [...existingCart, product];
    document.cookie = `cart=${JSON.stringify(updatedCart)}; path=/; max-age=3600`;
    alert(`${product.name} foi adicionado ao carrinho!`);
  };

  const getCartFromCookies = () => {
    const cookies = document.cookie.split('; ');
    const cartCookie = cookies.find(row => row.startsWith('cart='));
    return cartCookie ? JSON.parse(cartCookie.split('=')[1]) : [];
  };

  if (loading) {
    return <div className="text-center">Carregando...</div>;
  }

  if (errorMessage) {
    return <div className="text-center text-danger">{errorMessage}</div>;
  }

  if (!produto) {
    return <div className="text-center">Produto não encontrado.</div>;
  }

  const groupedProducts = [];
  for (let i = 0; i < relatedProducts.length; i += 3) {
    groupedProducts.push(relatedProducts.slice(i, i + 3));
  }

  return (
    <div>
      <div className="item-container">
        <div className="item-box">
          <div className="image-box">
          <img src={produto.imageUrl} alt={produto.name} className="img-fluid" />
          </div>
          <div className="text-container">
            <div className="category">{produto.type}</div>
            <div className="name">{produto.name}</div>
            <div className="price-porduto">R$ {produto.price} Unidade</div>
            <hr />
            <div className="button-container">
              <button className="buy-button">Comprar</button>
              <button className="add-button" onClick={() => addToCart(produto)}>Adicionar ao Carrinho</button>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="produto-page-product text-center">
        <div className="oucompre">
          <h3>Ou Compre Outros</h3>
        </div>
      </div>
      <section id="home" className="d-flex">
        <div className="container align-self-center">
          <div className="row justify-content-center">
            <div className="col-md-12 banner-container">
              <Carousel activeIndex={index} onSelect={handleSelect} indicators={false} controls={groupedProducts.length > 1}>
                {groupedProducts.length > 0 ? (
                  groupedProducts.map((group, idx) => (
                    <Carousel.Item key={idx}>
                      <div className="d-flex justify-content-center">
                        {group.map((product) => (
                          <div key={product.id} className="produto-product mx-2 text-center">
                            <Link to={`/products/${product.id || product._id}`}>
                                        <img src={product.imageUrl || '/default-image.jpg'} alt={product.name} className="img-fluid" />
                                    </Link>
                            <span>{product.name}</span>
                            <span>
                              R$ <span className="price">{product.price}</span> <span className="unit">{product.unit}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </Carousel.Item>
                  ))
                ) : (
                  <Carousel.Item>
                    <div className="d-flex justify-content-center">
                      <span>Não há produtos relacionados disponíveis.</span>
                    </div>
                  </Carousel.Item>
                )}
              </Carousel>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Paginapd;