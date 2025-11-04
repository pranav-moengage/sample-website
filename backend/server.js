// // backend/server.js

// const express = require('express');
// const bodyParser = require('body-parser');
// const axios = require('axios');
// const cors = require('cors');
// // dotenv is for local use; Render loads environment variables automatically
// require('dotenv').config();

// // --- EXPRESS SETUP ---
// // Render provides the PORT variable; we use 5000 as a fallback for local testing
// const PORT = process.env.PORT || process.env.SERVER_PORT || 5000;
// const app = express();

// // --- MOENGAGE CONFIGURATION ---
// // Using the exact environment variable names from your .env
// const MOE_WORKSPACE_ID = process.env.MOENGAGE_APP_ID;
// const MOE_DATA_API_KEY = process.env.MOENGAGE_API_KEY;
// // We'll use the base MoEngage Data API URL structure, as the endpoint provided 
// // is for Customer API, not the Track API. The Track API URL is simpler.
// const MOE_API_URL = 'https://api-01.moengage.com/v1/customer/DNBVW45PTD67QO7I1Q7ORLZD';

// // --- CORS Configuration (CRITICAL for Render deployment) ---
// // You MUST replace 'https://your-frontend-url.onrender.com' 
// // with the actual URL of your deployed React frontend.
// const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
// const corsOptions = {
//     origin: FRONTEND_URL,
//     optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));
// app.use(bodyParser.json());

// // --- MOENGAGE TRACKING SERVICE ---
// async function trackUserActivity(email, name, phoneNumber) {
//     if (!MOE_WORKSPACE_ID || !MOE_DATA_API_KEY) {
//         console.error("MoEngage API keys are missing or invalid in environment.");
//         throw new Error("Server config error: Missing API Keys.");
//     }

//     // Base64 encoding for Basic Auth: "WorkspaceID:DataAPIKey"
//     const authString = Buffer.from(`${MOE_WORKSPACE_ID}:${MOE_DATA_API_KEY}`).toString('base64');

//     // 1. Prepare MoEngage Payload (Batch Request)
//     // const payload = {
//     //     app_id: MOE_WORKSPACE_ID,
//     //     data: [
//     //         { // Payload 1: Set/Update User Attributes
//     //             type: "user",
//     //             action: "set_attribute",
//     //             attributes: [
//     //                 { name: "USER_ATTRIBUTE_UNIQUE_ID", value: email, type: "string" },
//     //                 { name: "First Name", value: name.split(' ')[0] || name, type: "string" },
//     //                 { name: "Contact Phone", value: phoneNumber, type: "string" }
//     //             ]
//     //         },
//     //         { // Payload 2: Track Event
//     //             type: "event",
//     //             action: "track_event",
//     //             attributes: [
//     //                 { name: "USER_ATTRIBUTE_UNIQUE_ID", value: email, type: "string" },
//     //                 { name: "event_name", value: 'Lead Generated', type: "string" },
//     //                 { name: "event_time", value: new Date().toISOString(), type: "date" },
//     //                 { name: "attributes", value: { 'lead_source': 'Landing Page Form', 'form_version': 1.0 }, type: "object" }
//     //             ]
//     //         }
//     //     ]
//     // };

//     const payload = {
//         app_id: MOE_WORKSPACE_ID,
//         data: [
//             { // Payload 1: Set/Update User Attributes
//                 type: "user",
//                 action: "set_attribute",

//                 // 🚨 FIX 1: Use 'u_id' (Generic User ID) at the root level for identification
//                 u_id: email, // Setting the unique ID to the email address

//                 attributes: [
//                     { name: "u_em", value: email, type: "string" }, // Keep u_em for email standard attribute
//                     // ... other attributes (u_fn, u_n, Contact Phone)
//                 ]
//             },
//             { // Payload 2: Track Event
//                 type: "event",
//                 action: "track_event",

//                 // 🚨 FIX 2: Use 'u_id' (Generic User ID) for event association
//                 u_id: email, // Associate the event with this user ID

//                 attributes: [
//                     // ... event attributes
//                 ]
//             }
//         ]
//     };

//     try {
//         const response = await axios.post(MOE_API_URL, payload, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Basic ${authString}` // Secure Auth Header
//             }
//         });

//         if (response.status === 200 && response.data.status === 'SUCCESS') {
//             return { success: true, message: "MoEngage data updated." };
//         } else {
//             console.error("MoEngage API response error:", response.data);
//             throw new Error(response.data.error || "External API call failed.");
//         }
//     } catch (error) {
//         // Log the detailed error from MoEngage (e.g., 401 Unauthorized)
//         console.error("Error communicating with MoEngage API:", error.message, error.response?.data);
//         throw new Error("Failed to process request due to external service error.");
//     }
// }


// app.get('/', (req, res) => {
//     res.status(200).send('MoEngage Tracker API is running!');
// });

// // --- EXPRESS ROUTE ---
// app.post('/api/track-lead', async (req, res) => {
//     const { name, email, phoneNumber } = req.body;

//     // Basic validation
//     if (!email || !name || !phoneNumber) {
//         return res.status(400).json({ error: 'Missing required form fields.' });
//     }

//     try {
//         await trackUserActivity(email, name, phoneNumber);
//         res.status(200).json({ message: 'Lead tracked successfully.' });
//     } catch (error) {
//         // Return a generic error to the frontend, but log the specific details
//         res.status(500).json({ error: 'Internal server error while processing request.' });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Backend server running on port ${PORT}. Ready for deployment.`);
// });

// backend/server.js

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors'); 
require('dotenv').config(); 

// --- EXPRESS SETUP ---
const PORT = process.env.PORT || process.env.SERVER_PORT || 5000; 
const app = express();

// --- MOENGAGE CONFIGURATION ---
// Using the exact environment variable names from your .env
const MOE_WORKSPACE_ID = process.env.MOENGAGE_APP_ID;
const MOE_DATA_API_KEY = process.env.MOENGAGE_API_KEY;

// 🚨 CRITICAL CHANGE: Using the Customer API Endpoint URL (api-01)
const MOE_API_URL = `https://api-01.moengage.com/v1/customer/${MOE_WORKSPACE_ID}`; 

// --- CORS Configuration ---
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'; 
const corsOptions = {
    origin: FRONTEND_URL, 
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// --- MOENGAGE TRACKING SERVICE (Customer API Model) ---
async function updateMoEngageUser(email, name, phoneNumber) {
    if (!MOE_WORKSPACE_ID || !MOE_DATA_API_KEY) {
        console.error("MoEngage API keys are missing or invalid in environment.");
        throw new Error("Server config error: Missing API Keys.");
    }
    
    // Base64 encoding for Basic Auth: "WorkspaceID:DataAPIKey"
    const authString = Buffer.from(`${MOE_WORKSPACE_ID}:${MOE_DATA_API_KEY}`).toString('base64');
    
    const firstName = name.split(' ')[0] || name;

    // 1. Build Payload for Customer API (Simple structure, not batch)
    const payload = {
        // Required Field: type must be "customer"
        type: "customer", 
        
        // Required Identifier Field: customer_id is the unique key (set to email)
        customer_id: email, 
        
        // Optional: Ensure new users are created if they don't exist
        update_existing_only: "false", 
        
        // Attributes object
        attributes: {
            // Standard attributes confirmed in your documentation (u_em, u_fn, u_n)
            "u_em": email, 
            "u_fn": firstName,
            "u_n": name,
            
            // Custom attribute
            "u_mb": phoneNumber
        },
    };

    try {
        const response = await axios.post(MOE_API_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authString}` // Secure Auth Header
            }
        });

        if (response.status === 200 && response.data.status === 'SUCCESS') {
            return { success: true, message: "MoEngage user profile updated." };
        } else {
            console.error("MoEngage API response error:", response.data);
            throw new Error(response.data.error || "External API call failed.");
        }
    } catch (error) {
        // Log the detailed error from MoEngage 
        console.error("Error communicating with MoEngage Customer API:", error.message, error.response?.data);
        throw new Error("Failed to process request due to external service error.");
    }
}


// 💡 NOTE: The Customer API only handles ATTRIBUTES. 
// Event tracking needs a separate API call or a dedicated Event Tracking API endpoint.
// For now, we will focus on making the Profile Update (attributes) work.
// The "Lead Generated" event will NOT be tracked with this function.
// If you want event tracking, we need to create a second endpoint/function for the Events API.


// --- EXPRESS ROUTE ---
app.post('/api/track-lead', async (req, res) => {
    const { name, email, phoneNumber } = req.body; 
    
    // Basic validation
    if (!email || !name || !phoneNumber) {
        return res.status(400).json({ error: 'Missing required form fields.' });
    }
    
    try {
        await updateMoEngageUser(email, name, phoneNumber); 
        res.status(200).json({ message: 'Lead tracked successfully.' });
    } catch (error) {
        // Return a generic error to the frontend, but log the specific details
        res.status(500).json({ error: 'Internal server error while processing request.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}. Ready for deployment.`);
});