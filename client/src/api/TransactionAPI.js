const API_URL = `http://10.0.10.125:5000/api/transaction`

export const sellProduct = async(id) => {
    const response = await fetch(`${API_URL}/sellProduct/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to sell the product');
    }

    return await response.json();
}

export const defectProduct = async(id) => {
    const response = await fetch(`${API_URL}/markAsDefect/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to set the product defect');
    }

    return await response.json();
}