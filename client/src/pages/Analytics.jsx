import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getProduct } from '../api/ProductAPI';
import './Analytics.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [products, setProducts] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [filter, setFilter] = useState('thisWeek');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await getProduct();
        setProducts(fetchedProducts); 
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchData();
  }, []);

  const getDateRange = (filter) => {
    const now = new Date();
    let startDate;

    if (filter === 'thisWeek') {
      const startOfWeek = now.getDate() - now.getDay();
      startDate = new Date(now.setDate(startOfWeek));
    } else if (filter === 'thisMonth') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (filter === 'thisYear') {
      startDate = new Date(now.getFullYear(), 0, 1); 
    }

    return startDate;
  };

  const filterByDateRange = (data, filter) => {
    const startDate = getDateRange(filter);
    const now = new Date();

    return data.filter(product => {
      const createdAt = new Date(product.createdAt);
      return createdAt >= startDate && createdAt <= now;
    });
  };

  useEffect(() => {
    const filteredProducts = filterByDateRange(products, filter);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const labels = currentProducts.map(product => product.name);
    const productQuantity = currentProducts.map(product => product.quantity);
    const productSold = currentProducts.map(product => product.quantity_sold);
    const productDefective = currentProducts.map(product => product.quantity_defective);

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
  }, [filter, products, currentPage]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(products.length / itemsPerPage)) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Product Analytics Chart',
      },
    },
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="analytics-container">
      <h2>Product Analytics</h2>
      <div className="filter-buttons">
        <button onClick={() => handleFilterChange('thisWeek')}>This Week</button>
        <button onClick={() => handleFilterChange('thisMonth')}>This Month</button>
        <button onClick={() => handleFilterChange('thisYear')}>This Year</button>
      </div>
      
      <div className="chart-wrapper">
        <Bar data={chartData} options={options} />
      </div>

      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(products.length / itemsPerPage)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Analytics;
