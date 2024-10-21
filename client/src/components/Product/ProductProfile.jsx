import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productProfile } from '../../api/ProductProfileAPI';
import { sellProduct, defectProduct } from '../../api/TransactionAPI';
import './ProductProfile.css';

function ProductProfile() {
  const { id } = useParams();
  const [product, setProduct] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await productProfile(id);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product data:', error);
        setError('Failed to fetch product data.');
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAction = async (action) => {
    try {
      let response;
      switch (action) {
        case 'sell':
          response = await sellProduct(id);
          alert('Product sold successfully!');
          break;
        case 'defect':
          response = await defectProduct(id);
          alert('Product marked as defective.');
          break;
        case 'request':
          response = await requestProduct(id);
          alert('Product requested successfully.');
          break;
        default:
          return;
      }

      const updatedProduct = await productProfile(id);
      setProduct(updatedProduct);
    } catch (error) {
      console.error(`Error handling ${action} action:`, error);
      alert(`Failed to perform ${action} action.`);
    }
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!product) {
    return <div className="no-product">No product found.</div>;
  }

  return (
    <div className="product-profile-container">
      <div className="product-form">
        <h2 className="product-form-title">Product Profile</h2>
        <div className="product-form-group">
          <strong>Product Name:</strong>
          <span className="product-name">{product.name || 'N/A'}</span>
        </div>
        <div className="product-form-group">
          <strong>Product Description:</strong>
          <span className="product-description">{product.description || 'N/A'}</span>
        </div>
        <div className="product-form-group">
          <strong>Price:</strong>
          <span>{product.price ? `$${product.price}` : 'N/A'}</span>
        </div>
        <div className="product-form-group">
          <strong>In Stock:</strong>
          <span>{product.inStock ? 'Yes' : 'No'}</span>
        </div>
        <div className="product-form-group">
          <strong>Status:</strong>
          <span>{product.defect ? 'Defect' : 'Not Defect'}</span>
        </div>
        <div className="product-form-group">
          <strong>Quantity:</strong>
          <span>{product.quantity ? `${product.quantity}` : `N/A`}</span>
        </div>
        <div className="button-group">
          <button className="btn-action sell-button" onClick={() => handleAction('sell')}>Sell</button>
          <button className="btn-action defect-button" onClick={() => handleAction('defect')}>Defect</button>
          <button className="btn-action request-button" onClick={() => handleAction('request')}>Request</button>
        </div>
      </div>
    </div>
  );
}

export default ProductProfile;
