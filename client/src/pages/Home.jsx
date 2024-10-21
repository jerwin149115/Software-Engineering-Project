import './Home.css';
import { useState, useEffect } from 'react';
import { getProduct } from '../api/ProductAPI';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import DataTable from 'react-data-table-component';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Home() {
  const [records, setRecords] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await getProduct();
        setRecords(products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product data:', error);
        setError('Failed to fetch product analytics');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (records.length > 0) {
      const topFiveProducts = records.slice(0, 3);
      const labels = topFiveProducts.map(product => product.name);
      const productQuantity = topFiveProducts.map(product => product.quantity);
      const productSold = topFiveProducts.map(product => product.quantity_sold);
      const productDefective = topFiveProducts.map(product => product.quantity_defective);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Quantity',
            data: productQuantity,
            backgroundColor: '#FFD700',
            borderColor: '#101010',
            borderWidth: 1,
          },
          {
            label: 'Sold',
            data: productSold,
            backgroundColor: '#FFD700',
            borderColor: '#101010',
            borderWidth: 1,
          },
          {
            label: 'Defective',
            data: productDefective,
            backgroundColor: '#FFD700',
            borderColor: '#101010',
            borderWidth: 1,
          },
        ],
      });
    }
  }, [records]);

  const getChartOptions = () => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#FFD700',
        },
      },
      title: {
        display: true,
        text: 'Product Analytics Chart',
        labels:{
          color: '#FFD700',
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: '#101010',
          borderColor: '#FFD700',
        },
        ticks: {
          color: '#FFD700',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#101010',
          borderColor: '#FFD700',
        },
        ticks: {
          color: '#FFD700',
        },
      },
    },
  });

  const columns = [
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Description', selector: row => row.description, sortable: true },
    { name: 'Price', selector: row => row.price, sortable: true },
    { name: 'In Stock', selector: row => (row.inStock ? 'Yes' : 'No'), sortable: true },
    { name: 'Status', selector: row => row.status, sortable: true },
  ];

  const customStyles = {
    table: {
      style: {
        backgroundColor: '#101010',
      },
    },
    head: {
      style: {
        backgroundColor: '#101010',
        color: '#FFD700',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#101010',
      },
    },
    headCells: {
      style: {
        backgroundColor: '#101010',
        color: '#FFD700',
        fontWeight: 'bold',
      },
    },
    rows: {
      style: {
        backgroundColor: '#101010',
        color: '#FFD700',
        '&:nth-child(odd)': {
          backgroundColor: '#101010',
        },
      },
    },
    cells: {
      style: {
        backgroundColor: '#101010',
        color: '#FFD700',
        padding: '8px',
        fontSize: '14px',
        borderBottom: '1px solid #101010',
      },
    },
    pagination: {
      style: {
        backgroundColor: '#101010',
        color: '#FFD700',
      },
      pageButtonsStyle: {
        backgroundColor: '#FFD700',
        color: '#FFD700',
        border: '1px solid #101010',
        '&:hover': {
          backgroundColor: '#101010',
          color: '#FFD700',
          svg: {
            color: '#FFD700',
          },
        },
      },
    },
    noData: {
      style: {
        backgroundColor: '#101010', 
        color: '#FFD700', 
        padding: '20px',
        fontSize: '16px',
      },
    },
  };

  const totalQuantitySold = records.reduce((total, product) => total + product.quantity_sold, 0);
  const totalAvailableQuantity = records.reduce((total, product) => total + product.quantity, 0);

  const quantitySoldProgress = totalAvailableQuantity > 0
    ? (totalQuantitySold / totalAvailableQuantity) * 100
    : 0;

  const totalQuantityDefective = records.reduce((total, product) => total + product.quantity_defective, 0);
  const totalAvailableQuantityDefective = records.reduce((total, product) => total + product.quantity, 0);

  const quantityDefectiveProgress = totalAvailableQuantityDefective > 0
    ? (totalQuantityDefective / totalAvailableQuantityDefective) * 100
    : 0;

  return (
    <>
      <div className="dashboard">
        <div className="box">
          <h3>Total Model Products</h3>
          <p>{records.length}</p>
          <progress value={totalAvailableQuantity}></progress>
        </div>
        <div className="box">
          <h3>Total Quantity Sold</h3>
          <p>{totalQuantitySold} / {totalAvailableQuantity}</p>
          <progress value={totalQuantitySold} max={totalAvailableQuantity}></progress>
        </div>
        <div className="box">
          <h3>Total Defective Product</h3>
          <p>{totalQuantityDefective} / {totalAvailableQuantity}</p>
          <progress value={totalQuantityDefective} max={totalAvailableQuantity}></progress>
        </div>
        <div className="box">
          <h3>Total Quantity Products</h3>
          <p>{totalAvailableQuantity}</p>
          <progress value={totalAvailableQuantity} max={totalAvailableQuantity}></progress>
        </div>
      </div>

      <div className="second-dashboard">
        <div className="second-box">
          {loading ? (
            <p>Loading chart...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <Bar data={chartData} options={getChartOptions()} />
          )}
        </div>
        <div className="third-box">
          <DataTable
            columns={columns}
            data={records}
            className="data-table"
            fixedHeader
            pagination
            customStyles={customStyles}
          />
        </div>
      </div>
    </>
  );
}

export default Home;
