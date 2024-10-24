import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productProfile } from '../../api/productProfileAPI';
import { sellProduct, defectProduct } from '../../api/transactionAPI';
import './ProductProfile.css';
import { useNavigate } from 'react-router-dom';

function ProductProfile() {
  const navigate = useNavigate();
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
        case 'back':
          navigate(-1); 
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
    <div className='parent-container'>
        <div className='product-profile-container'>
            <img src={`http://192.168.103.183:5000/${product.image}`} alt={`${product.image}`} className='image-product'/>
            <h2>{product.name}</h2>
            <div className='product-form'>
                    <div className='product-form-group'>
                        <strong>Product Price: </strong>
                        <span>{product.price}</span>
                    </div>
                    <div className='product-form-group'>
                        <strong>Product Status: </strong>
                        <span>
                            {product.defect ? 'Defect' : product.inStock ? 'Available' : 'Out of Stock'}
                        </span>
                    </div>
                    <div className='product-form-group'>
                        <strong>Product Description: </strong>
                        <span>{product.description}</span>
                    </div>
                    <div className='product-form-group'>
                        <strong>In Stock: </strong>
                        <span>{product.inStock ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="product-form-group">
                        <strong>Quantity: </strong>
                        <span>{product.quantity ? `${product.quantity}` : `N/A`}</span>
                </div>
            </div>
            <div className="button-group">
                <button className="btn-action sell-button" onClick={() => handleAction('sell')}>Sell</button>
                <button className="btn-action defect-button" onClick={() => handleAction('defect')}>Defect</button>
                <button className='btn-action back-button' onClick={() => handleAction('back')}>Back</button>
            </div>
        </div>
    </div>    
  );
}

export default ProductProfile;
