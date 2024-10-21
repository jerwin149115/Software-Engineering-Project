import { Routes, Route } from 'react-router-dom';
import '../Dashboard/Dashboard.css';
import Home from '../../pages/Home'
import Navbar from '../Navbar/Navbar'
import Product from '../../pages/Product';
import Reports from '../../pages/Reports';
import Quantity from '../../pages/Quantity';
import Team from '../../pages/Team';
import ProductProfile from '../Product/ProductProfile';
import Analytics from '../../pages/Analytics';

function Dashboard() {
    return (
        <>
            <Navbar />
            <div className="dashboard-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path='/product/pages' element={<Product />} />
                    <Route path="/product/pages/:id" element={<ProductProfile />} />
                    <Route path='/reports/pages' element={<Reports />} />
                    <Route path='/quantity/pages' element={<Quantity />}/>
                    <Route path='/team/pages' element={<Team />}/>
                    <Route path='/analytics/pages' element={<Analytics />}/> 
                </Routes>
            </div>
        </>
    );
}

export default Dashboard;
