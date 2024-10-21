import { Routes, Route } from 'react-router-dom';
import './Dashboard.css';
import Home from '../pages/Home';
import ProductProfile from '../Product/ProductProfile';

function Dashboard({ setIsAuthenticated }) {
    return (
        <>
            <Routes>
                <Route path='/' element={<Home setIsAuthenticated={setIsAuthenticated} />} />
                <Route path='/product/pages/:id' element={<ProductProfile />} />
            </Routes>
        </>
    );
}

export default Dashboard;
