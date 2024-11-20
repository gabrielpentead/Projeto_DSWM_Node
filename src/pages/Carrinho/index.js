import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import carrinho from './carrinho-carrinho.png';

function Carrinho() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCartFromCookies();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const loadCartFromCookies = () => {
    const cookies = document.cookie.split('; ');
    const cartCookie = cookies.find(row => row.startsWith('cart='));
    const cart = cartCookie ? JSON.parse(cartCookie.split('=')[1]) : [];

    const cartWithQuantities = cart.map(item => ({
      ...item,
      quantity: item.quantity || 1,
      price: parseFloat(item.price) || 0,
    }));

    setCartItems(cartWithQuantities);
  };

  const calculateTotal = () => {
    const totalAmount = cartItems.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity;
      return sum + itemTotal;
    }, 0);
    setTotal(totalAmount);
  };

  const increaseQuantity = (itemId) => {
    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    updateCartCookie(updatedCart);
  };

  const decreaseQuantity = (itemId) => {
    const updatedCart = cartItems.map(item =>
      item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCartItems(updatedCart);
    updateCartCookie(updatedCart);
  };

  const updateCartCookie = (updatedCart) => {
    document.cookie = `cart=${JSON.stringify(updatedCart)}; path=/; max-age=3600`;
    calculateTotal();
  };

  const removeItemFromCart = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    updateCartCookie(updatedCart);
  };

  const checkout = () => {
    alert('Finalizando a compra...');
  };

  return (
    <div className="container-carrinho">
      <div className="box-carrinho">
        {cartItems.length === 0 ? (
          <div>
            <img src={carrinho} alt="Carrinho" width="150" />
            <div className="name-carrinho">Seu Carrinho de Compras está Vazio.</div>
            <div className="texto-estra-carrinho">
              Volte às compras e adicione ao seu carrinho.
            </div>
            <Link to="/home">Produtos</Link>
            <hr />
          </div>
        ) : (
          <>
            <h2>Seu Carrinho de Compras</h2>
            <ul>
              {cartItems.map(item => (
                <li key={item.id} className="cart-item">
                  <img src={item.imageUrl} alt={item.name} width="220" />
                  <span>{item.name}</span>
                  <span>R$ {item.price.toFixed(2)}</span>
                  <span>Quantidade: {item.quantity}</span>
                  <div className="quantity-controls">
                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <button
                      className="remove-button-small"
                      onClick={() => removeItemFromCart(item.id)}
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <h3>Total: R$ {total.toFixed(2)}</h3>
            <button className="finalize-button" onClick={checkout}>
              Finalizar Compra
            </button>
            <hr />
          </>
        )}
      </div>
    </div>
  );
}

export default Carrinho;
