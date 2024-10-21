import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { register, fetchNames, updateTeam, deleteTeam } from '../api/teamAPI'
import './Product.css';

function Team() {
  const columns = [
    { name: 'Team Username', selector: row => row.username, sortable: true },
    { name: 'Team Status', selector: row => row.status, sortable: true },
    { name: 'Team Roles', selector: row => row.roles, sortable: true },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <button onClick={() => handleEdit(row)} className="btn btn-sm btn-primary me-2">Edit</button>
          <button onClick={() => {handleDelete(row._id); }} className="btn btn-sm btn-danger">Delete</button>
        </div>
      ),
      ignoreRowClick: true,
    }
  ];

  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newStaff, setNewStaff] = useState({
    id: '',
    username: '',
    password: '',
    roles: '',
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const username = await fetchNames();
        setRecords(username);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    }

    fetchData();
  }, []);

  async function handleFilter(event) {
    const searchText = event.target.value.toLowerCase();
    try {
      const filteredTeam = await fetchNames(searchText);
      setRecords(filteredTeam);
    } catch (error) {
      console.error('Error filtering Team:', error);
    }
  }

  async function handleAddTeam() {
    try {
      if (isEditing) {
        await updateTeam(newStaff.id, newStaff);
        setRecords(records.map(item => (item.id === newStaff.id ? newStaff : item)));
        window.location.reload();
      } else {
        const addedTeam = await register(newStaff);
        setRecords([...records, addedTeam ]);
        window.location.reload();
      }
      setShowModal(false);
      setNewStaff({
        id: '',
        username: '',
        password: '',
        roles: '',
      });
    } catch (error) {
      console.error('Error adding/updating Team:', error);
    }
  }  


  function handleEdit(userData) {
    setNewStaff({
        ...userData,
        id: userData._id 
    });
    setIsEditing(true);
    setShowModal(true);
  }

  async function handleDelete(id) {
  if (!id) {
    console.error('Invalid staff ID:', id); 
    return;
  }

  try {
    await deleteTeam(id); 
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
                  value={newStaff.username}
                  placeholder="Team Userame"
                  onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  value={newStaff.password}
                  placeholder="Team Password"
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                />
              </div>
            </form>
            <div className="modal-footer mt-3">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleAddTeam}>
                {isEditing ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Team;
