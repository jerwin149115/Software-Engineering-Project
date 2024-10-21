import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout({ setIsAuthenticated }) {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');  
        setIsAuthenticated(false);
        navigate('/login'); 
    }, [navigate, setIsAuthenticated]);

    return null;
}

export default Logout;
