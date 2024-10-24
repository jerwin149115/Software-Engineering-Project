import { useState, useEffect } from "react";
import { getProduct } from "../../api/productAPI";
import { useNavigate } from "react-router-dom";
import './Home.css';
import { logout } from '../../api/teamAPI'

function Home({ setIsAuthenticated }) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const products = await getProduct();
                setRecords(products);
            } catch (error) {
                console.error('Error fetching the data', error);
                setError('Failed to fetch the products');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="loading">Loading products...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
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

    const handleViewProduct = (id) => {
        navigate(`/dashboard/product/pages/${id}`);
    };

    async function handleLogout() {
        try {
            await logout();
            localStorage.removeItem('token'); 
            setIsAuthenticated(false);
            navigate('/login'); 
        } catch (error) {
            console.error('Error logout', error)
        }
    };

    return (
        <>
            <div className="dashboard">
                <input 
                    type="text" 
                    onChange={handleFilter} 
                    className="search-function" 
                    placeholder="Search by name" 
                />
                    <button type="button" className="add-btn" onClick={() => handleLogout()}>
                        Logout
                    </button>
                <div className="product-list">
                    {records.length > 0 ? (
                        records.map((product) => (
                            <div key={product._id} className="product-card">   
                                <div className="product-details">
                                    <img src={`http://192.168.103.183:5000/${product.image}`} alt={product.name} />
                                    <h3>{product.name}</h3>
                                    <p className="price">${product.price}</p>
                                    <button 
                                        type="button" 
                                        className="add-btn" 
                                        onClick={() => handleViewProduct(product._id)}
                                    >
                                        View more details
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-products">No products available</div>
                    )}
                </div>
                <div>
                </div>
            </div>
        </>
    );
}

export default Home;
