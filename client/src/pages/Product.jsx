import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { addProduct, deleteProduct, updateProduct, getProduct } from '../api/ProductAPI';
import './Product.css';

function Product() {
  const navigate = useNavigate();

  const columns = [
    {
      name: 'Product Image',
      selector: row => {
        const imageUrl = `http://192.168.103.183:5000/${row.image}`;
        return (
          row.image
            ? <img src={imageUrl} alt="Product" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            : 'No Image'
        );
      },
      sortable: false,
    },    
    { name: 'Product Name', selector: row => row.name, sortable: true },
    { name: 'Product Description', selector: row => row.description, sortable: true },
    { name: 'Product Price', selector: row => row.price, sortable: true },
    { name: 'Product In Stock', selector: row => (row.inStock ? 'Yes' : 'No'), sortable: true },
    { name: 'Product Status', selector: row => row.status, sortable: true, },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <button onClick={() => handleEdit(row)} className="btn btn-sm btn-primary me-2">Edit</button>
          <button onClick={() => handleDelete(row._id)} className="btn btn-sm btn-danger me-2">Delete</button>
          <button onClick={() => handleViewProfile(row._id)} className="btn btn-sm btn-info me-2">View Profile</button>
        </div>
      ),
      ignoreRowClick: true,
    }
  ];

  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
    quantity: '',
    image: null,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const products = await getProduct();
        const expandedProducts = expandProductStatuses(products);
        setRecords(expandedProducts);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    }

    fetchData();
  }, []);

  function expandProductStatuses(products) {
    let expanded = [];
    products.forEach(product => {
        if (typeof product.status === 'string') {
            expanded.push({
                ...product,
                status: product.status,
            });
        } else if (Array.isArray(product.status)) {
            product.status.forEach(status => {
                expanded.push({
                    ...product,
                    status: status, 
                });
            });
        } else {
            expanded.push({
                ...product,
                status: 'No Status',
            });
        }
    });
    return expanded;
}


  async function handleFilter(event) {
    const searchText = event.target.value.toLowerCase();
    try {
      const filteredProducts = await getProduct(searchText);
      setRecords(filteredProducts);
    } catch (error) {
      console.error('Error filtering products:', error);
    }
  }

  const handleFileChange = (event) => {
    setNewProduct({ ...newProduct, image: event.target.files[0] }); 
  };

  async function handleAddProduct() {
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('quantity', newProduct.quantity);
    if (newProduct.image) {
        formData.append('image', newProduct.image);
    }
  
    try {
        if (isEditing) {
            await updateProduct(newProduct.id, formData);
        } else {
            await addProduct(formData);
        }
        setShowModal(false);
        setNewProduct({
            id: '',
            name: '',
            description: '',
            price: 0,
            quantity: '',
            image: null
        });
        window.location.reload();
    } catch (error) {
        console.error('Error adding/updating product:', error);
    }
  }


  function handleEdit(product) {
    setNewProduct({
        ...product,
        id: product._id 
    });
    setIsEditing(true);
    setShowModal(true);
  }

  const handleViewProfile = (id) => {
    navigate(`/dashboard/product/pages/${id}`);
  };

  async function handleDelete(id) {
    if (!id) {
      console.error('Invalid product ID:', id); 
      return;
    }

    try {
      await deleteProduct(id); 
      const newRecords = records.filter(record => record._id !== id);
      setRecords(newRecords);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  const customStyles = {
    table: {
      style: {
        backgroundColor: '#1a1a1a',
      },
    },
    head: {
      style: {
        backgroundColor: '#1a1a1a',
        color: '#FFD700',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#1a1a1a',
      },
    },
    headCells: {
      style: {
        backgroundColor: '#1a1a1a',
        color: '#FFD700',
        fontWeight: 'bold',
      },
    },
    rows: {
      style: {
        backgroundColor: '#1a1a1a',
        color: '#FFD700',
        '&:nth-child(odd)': {
          backgroundColor: '#333',
        },
      },
    },
    cells: {
      style: {
        backgroundColor: '#1a1a1a',
        color: '#FFD700',
        padding: '8px',
        fontSize: '14px',
        borderBottom: '1px solid #333',
      },
    },
    pagination: {
      style: {
        backgroundColor: '#1a1a1a',
        color: '#FFD700',
      },
      pageButtonsStyle: {
        backgroundColor: '#FFD700',
        color: '#FFD700',
        border: '1px solid #1a1a1a',
        '&:hover': {
          backgroundColor: '#333',
          color: '#FFD700',
          svg: {
            color: '#FFD700',
          },
        },
      },
    },
    noData: {
      style: {
        backgroundColor: '#1a1a1a', 
        color: '#FFD700', 
        padding: '20px',
        fontSize: '16px',
      },
    },
  };

  return (
    <div className="container mt-5">
      <div className="table-box">
        <div className="text-end mb-3">
          <input type="text" onChange={handleFilter} className="search-function" placeholder="Search by name" />
          <button className="btn-add btn-success ms-2" onClick={() => { setIsEditing(false); setShowModal(true); }}>Add Product</button>
        </div>

        <DataTable
          columns={columns}
          data={records}
          className="data-table"
          fixedHeader
          pagination
          customStyles={customStyles}
        />
      </div>

      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h5 className="modal-title">{isEditing ? 'Edit Product' : 'Add New Product'}</h5>
            <form>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  value={newProduct.name}
                  placeholder="Product Name"
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}/>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  value={newProduct.description}
                  placeholder="Description"
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}/>
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Product Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}/>
              </div>
              <div className='mb-3'>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Product Quantity"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value, 10) })} 
                  />
                </div>
                <div className="mb-3">
                     <input
                        type="file"
                        onChange={handleFileChange}
                      />
                  </div>
            </form>
            <div className="modal-footer mt-3">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleAddProduct}>
                {isEditing ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Product;
