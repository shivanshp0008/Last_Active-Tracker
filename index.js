// server.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json()); // Allow JSON body

const PORT = process.env.PORT || 3000;

// POST endpoint for Forge calls
app.post('/lookup', async (req, res) => {
  const { orgId, accountId, apiKey } = req.body;

  if (!orgId || !accountId || !apiKey) {
    return res.status(400).json({ error: 'Missing orgId, accountId, or apiKey' });
  }

  try {
    const url = `https://api.atlassian.com/admin/v1/orgs/${orgId}/directory/users/${accountId}/last-active-dates`;

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    res.json(response.data); // Send JSON back to Forge
  } catch (error) {
    console.error('Error fetching data from Atlassian API:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Error fetching data from Atlassian API'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});