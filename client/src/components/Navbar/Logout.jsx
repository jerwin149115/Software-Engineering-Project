import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Logout({setIsAuthenticated}) {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
    }, [navigate])

    return null;
}

export default Logout;