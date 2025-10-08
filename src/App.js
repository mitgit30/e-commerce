import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// ----- Pure Function Example -----
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// ----- Functional Component: Product -----
function Product({ product, addToCart }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm border-0 product-card">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text text-muted mb-4">${product.price}</p>
          <button className="btn btn-primary mt-auto" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// ----- Functional Component: ProductList -----
function ProductList({ products, addToCart }) {
  return (
    <div className="row">
      {products.map((product) => (
        <Product key={product.id} product={product} addToCart={addToCart} />
      ))}
    </div>
  );
}

// ----- Functional Component: CartItem -----
function CartItem({ item, removeFromCart }) {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      {item.name} x {item.quantity}
      <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(item.id)}>
        Remove
      </button>
    </li>
  );
}

// ----- Functional Component: Cart -----
function Cart({ items, removeFromCart }) {
  const total = calculateTotal(items);

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-dark text-white">
        <strong>🛒 Cart</strong> ({items.length} items)
      </div>
      <ul className="list-group list-group-flush">
        {items.length === 0 ? (
          <li className="list-group-item text-muted text-center">Cart is empty</li>
        ) : (
          items.map((item) => (
            <CartItem key={item.id} item={item} removeFromCart={removeFromCart} />
          ))
        )}
        {items.length > 0 && (
          <li className="list-group-item text-end fw-bold">Total: ${total.toFixed(2)}</li>
        )}
      </ul>
    </div>
  );
}

// ----- Controlled Form: AddProductForm -----
function AddProductForm({ onAdd }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || price <= 0) return;
    onAdd({ name, price: parseFloat(price) });
    setName('');
    setPrice('');
  };

  return (
    <form className="mb-5" onSubmit={handleSubmit}>
      <h4 className="mb-3">➕ Add New Product</h4>
      <div className="row g-2">
        <div className="col-md-5">
          <input
            className="form-control"
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            className="form-control"
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button className="btn btn-success w-100" type="submit">
            Add Product
          </button>
        </div>
      </div>
    </form>
  );
}

// ----- Class Component: App -----
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [
        { id: 1, name: 'SkyBag', price: 999 },
        { id: 2, name: 'Washing Machine', price: 499 },
        { id: 3, name: 'Water Bottle', price: 199 },
      ],
      cart: []
    };
    console.log('Constructor');
  }

  componentDidMount() {
    console.log('App mounted');
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.cart.length !== this.state.cart.length) {
      console.log('Cart updated', this.state.cart);
    }
  }

  componentWillUnmount() {
    console.log('App will unmount');
  }

  addToCart = (product) => {
    this.setState((prevState) => {
      const existing = prevState.cart.find((item) => item.id === product.id);
      if (existing) {
        return {
          cart: prevState.cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        };
      } else {
        return {
          cart: [...prevState.cart, { ...product, quantity: 1 }]
        };
      }
    });
  };

  removeFromCart = (id) => {
    this.setState((prevState) => ({
      cart: prevState.cart.filter((item) => item.id !== id)
    }));
  };

  handleAddProduct = (product) => {
    const newProduct = {
      id: Date.now(),
      ...product
    };
    this.setState((prevState) => ({
      products: [...prevState.products, newProduct]
    }));
  };

  render() {
    const { products, cart } = this.state;

    return (
      <div className="container py-5">
        <h1 className="text-center mb-4">💻 React E-commerce Store</h1>
        <AddProductForm onAdd={this.handleAddProduct} />

        <div className="row">
          <div className="col-lg-8">
            <h4 className="mb-3">🛍️ Products</h4>
            <ProductList products={products} addToCart={this.addToCart} />
          </div>
          <div className="col-lg-4 mt-5 mt-lg-0">
            <Cart items={cart} removeFromCart={this.removeFromCart} />
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

// ----- Functional Component with useEffect as lifecycle -----
function Footer() {
  useEffect(() => {
    console.log('Footer mounted');
    return () => {
      console.log('Footer unmounted');
    };
  }, []);

  return (
    <footer className="mt-5 text-center text-muted">
      <hr />
      <small>Made with ❤️ using React & Bootstrap — © 2025</small>
    </footer>
  );
}
export default App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
