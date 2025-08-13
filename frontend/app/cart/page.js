import React from "react";
import Link from "next/link";
import "../../styles/cart.css"; 
const CartPage = () => {
  const cartItems = [
    {
      id: 1,
      name: "Mechanical Gearbox",
      price: 1499,
      quantity: 1,
      image: "/images/gearbox.png",
    },
    {
      id: 2,
      name: "Engine Assembly",
      price: 2399,
      quantity: 2,
      image: "/images/engine.png",
    },
  ];

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-content">
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-image" />
                <div className="cart-details">
                  <h2>{item.name}</h2>
                  <p>₹{item.price} x {item.quantity}</p>
                  <p>Total: ₹{item.price * item.quantity}</p>
                  <button className="remove-btn">Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <h3>Cart Total: ₹{total}</h3>
            <Link href="/checkout">
              <button className="checkout-btn">Proceed to Checkout</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;