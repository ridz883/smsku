const fetch = require('node-fetch');

const BASE_URL = "https://smsku.zelapi.eu.cc";

module.exports = async (req, res) => {
    // Aktifkan CORS agar frontend bisa mengaksesnya
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Ambil path endpoint dari query atau URL asli
    let endpoint = req.query.endpoint || '';
    if (!endpoint.startsWith('/')) {
        endpoint = '/' + endpoint;
    }

    const targetUrl = `${BASE_URL}${endpoint}`;

    try {
        let fetchOptions = {
            method: req.method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        // Jika metode POST, teruskan body datanya
        if (req.method === 'POST') {
            fetchOptions.body = JSON.stringify(req.body || {});
        }

        // Teruskan parameter query (selain 'endpoint') jika ada
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = new URLSearchParams();
        urlObj.searchParams.forEach((val, key) => {
            if (key !== 'endpoint') searchParams.append(key, val);
        });

        const finalTarget = searchParams.toString() ? `${targetUrl}?${searchParams.toString()}` : targetUrl;

        const response = await fetch(finalTarget, fetchOptions);
        const data = await response.json();

        return res.status(response.status).json(data);
    } catch (error) {
        console.error("Proxy Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
