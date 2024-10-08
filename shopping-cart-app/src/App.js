import React, { useState, useEffect } from 'react';

function App() {
  const [productID, setProductID] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [products, setProducts] = useState([]);

  // Load products from local storage when the component mounts
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(storedProducts);
  }, []);

  // Update local storage whenever the products state changes
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Add a product to local storage
  const addProduct = () => {
    if (productID && productName && productPrice) {
      const newProduct = { productID, productName, productPrice };
      setProducts([...products, newProduct]);

      // Clear input fields
      setProductID('');
      setProductName('');
      setProductPrice('');
    } else {
      alert('Please fill in all fields');
    }
  };

  // Finish shopping, send data to the backend, and clear local storage
  const finishShopping = async () => {
    if (products.length > 0) {
      try {
        const response = await fetch('http://localhost:5000/add-to-cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ products }),
        });

        if (response.ok) {
          alert('Products added to cart successfully!');
          setProducts([]);
          localStorage.clear();  // Clear local storage
        } else {
          alert('Failed to add products to cart');
        }
      } catch (error) {
        console.error('Error adding products:', error);
      }
    } else {
      alert('No products in the cart');
    }
  };

  return (
    <div className="App">
      <h1>Add Products to Cart</h1>
      <input
        type="text"
        placeholder="Product ID"
        value={productID}
        onChange={(e) => setProductID(e.target.value)}
      />
      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Product Price"
        value={productPrice}
        onChange={(e) => setProductPrice(e.target.value)}
      />
      <button onClick={addProduct}>Add Product</button>
      <button onClick={finishShopping}>Finish Shopping</button>

      <h2>Products in Cart</h2>
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            {product.productID} - {product.productName} - ${product.productPrice}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
