import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { getProduct } from '../api/ProductAPI'; 
import './Product.css';

function Quantity() {
  const columns = [
    { name: 'Product Name', selector: row => row.name, sortable: true },
    { name: 'Product Price', selector: row => row.price, sortable: true },
    { name: 'Product Quantity', selector: row => row.quantity, sortable: true },
    { name: 'Product In Stock', selector: row => (row.inStock ? 'Yes' : 'No'), sortable: true },
    { name: 'Product Status', selector: row => row.status, sortable: true },
    { name: 'Total Price', selector: row => row.totalPrice, sortable: true },
    { name: 'Sold', selector: row => row.quantity_sold, sortable: true },
    { name: 'Defective', selector: row => row.quantity_defective, sortable: true },
  ];

  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const products = await getProduct();
        setRecords(products);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    }

    fetchData();
  }, []);

  async function handleFilter(event) {
    const searchText = event.target.value.toLowerCase();
    try {
      const filteredProducts = await getProduct(searchText);
      setRecords(filteredProducts);
    } catch (error) {
      console.error('Error filtering products:', error);
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

      {showModal && selectedProduct && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h5 className="modal-title">Set Quantity for {selectedProduct.name}</h5>
            <form>
              <div className="mb-3">
                <label className="form-label">Product Price: </label>
                <span className="ms-2">{selectedProduct.price}</span>
              </div>
              <div className="mb-3">
                <label className="form-label">Product Status: </label>
                <span className="ms-2">{selectedProduct.defect ? 'Defect' : 'Not Defect'}</span>
              </div>
              <div className="mb-3">
                <label htmlFor="quantity" className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  value={quantity}
                  min="0"
                  onChange={handleQuantityChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Total Price: </label>
                <span className="ms-2">{totalPrice}</span>
              </div>
            </form>
            <div className="modal-footer mt-3">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleSaveQuantity}>
                Save Quantity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quantity;
