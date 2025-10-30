// backend/server.js

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config({ path: '.env' }); // Load environment variables from .env

const app = express();
const PORT = 3001; // Choose a port for your backend

// Middleware
app.use(bodyParser.json());
// CORS setup (CRITICAL for connecting frontend to backend during development)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://inspiring-duckanoo-8069dc.netlify.app/'); // Allow requests from your React frontend port
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// --- MOENGAGE CONFIGURATION & SERVICE LOGIC ---
const MOE_WORKSPACE_ID = process.env.MOE_WORKSPACE_ID;
const MOE_DATA_API_KEY = process.env.MOE_DATA_API_KEY;
const MOE_API_URL = 'https://api.moengage.com/v1/track';

// Base64 encoding for Basic Auth: "WorkspaceID:DataAPIKey"
// This uses the Buffer object which is standard in Node.js
const authString = Buffer.from(`${MOE_WORKSPACE_ID}:${MOE_DATA_API_KEY}`).toString('base64');

// Service function that calls MoEngage API securely
async function trackUserActivity(email, name, phoneNumber) {
    if (!MOE_WORKSPACE_ID || !MOE_DATA_API_KEY) {
        console.error("MoEngage API keys are missing in .env file.");
        return { success: false, message: "Server configuration error." };
    }

    // 1. Prepare User Attributes
    const attributes = [
        // Standard email attribute for linking the user
        { name: "USER_ATTRIBUTE_EMAIL", value: email, type: "string" }, 
        { name: "First Name", value: name.split(' ')[0] || name, type: "string" },
        { name: "Contact Phone", value: phoneNumber, type: "string" }
    ];

    // 2. Prepare Event
    const eventName = 'Lead Generated';
    const eventAttributes = {
        'lead_source': 'Landing Page Form',
        'form_version': 1.0
    };

    // 3. Build MoEngage Payload (Batch Request)
    const payload = {
        app_id: MOE_WORKSPACE_ID,
        data: [
            // Payload 1: Set/Update User Attributes
            {
                type: "user",
                action: "set_attribute",
                attributes: [
                    { name: "USER_ATTRIBUTE_UNIQUE_ID", value: email, type: "string" }, // Use email as unique ID
                    ...attributes 
                ]
            },
            // Payload 2: Track Event
            {
                type: "event",
                action: "track_event",
                attributes: [
                    { name: "USER_ATTRIBUTE_UNIQUE_ID", value: email, type: "string" },
                    { name: "event_name", value: eventName, type: "string" },
                    { name: "event_time", value: new Date().toISOString(), type: "date" },
                    { name: "attributes", value: eventAttributes, type: "object" }
                ]
            }
        ]
    };

    try {
        const response = await axios.post(MOE_API_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authString}` // Secure Auth Header
            }
        });

        if (response.status === 200 && response.data.status === 'SUCCESS') {
            return { success: true, message: "MoEngage data updated." };
        } else {
            console.error("MoEngage API response error:", response.data);
            return { success: false, message: response.data.error || "API call failed." };
        }
    } catch (error) {
        console.error("Error communicating with MoEngage API:", error.message);
        return { success: false, message: "Internal server error." };
    }
}

// --- EXPRESS ROUTE ---
app.post('/api/track-lead', async (req, res) => {
    const { name, email, phoneNumber } = req.body; 

    if (!email || !name || !phoneNumber) {
        return res.status(400).json({ error: 'Missing required form fields.' });
    }
    
    try {
        const result = await trackUserActivity(email, name, phoneNumber); 

        if (result.success) {
            res.status(200).json({ message: result.message });
        } else {
            // Log the detailed error but send a generic 500 to the frontend
            res.status(500).json({ error: result.message || 'Failed to process lead due to external error.' });
        }
    } catch (error) {
        console.error("Backend error on /api/track-lead:", error);
        res.status(500).json({ error: 'Internal server error while processing request.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});