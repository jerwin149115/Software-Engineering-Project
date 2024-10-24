const API_URL = `http://192.168.103.183:5000/api/reports`

export const getReportLogs = async (username = '') => {
    const response = await fetch(`${API_URL}/getReportLogs?username=${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }

    return await response.json();
};