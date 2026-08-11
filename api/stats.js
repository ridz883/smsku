const fetch = require('node-fetch');

const BASE_URL = "https://smsku.zelapi.eu.cc";

module.exports = async (req, res) => {
    // Aktifkan CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Ambil parameter period dari query (default: daily)
        const period = req.query.period || 'daily';
        const targetUrl = `${BASE_URL}/api/stats/detailed?period=${period}`;

        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        console.error("Stats API Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
