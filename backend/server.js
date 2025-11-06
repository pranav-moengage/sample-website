// const express = require('express');
// const bodyParser = require('body-parser');
// const axios = require('axios');
// const cors = require('cors'); 
// require('dotenv').config(); 

// // --- EXPRESS SETUP ---
// const PORT = process.env.PORT || process.env.SERVER_PORT || 5000; 
// const app = express();

// // --- MOENGAGE CONFIGURATION ---
// // Using the exact environment variable names from your .env
// const MOE_WORKSPACE_ID = process.env.MOENGAGE_APP_ID;
// const MOE_DATA_API_KEY = process.env.MOENGAGE_API_KEY;

// // 🚨 CRITICAL CHANGE: Using the Customer API Endpoint URL (api-01)
// const MOE_API_URL = `https://api-01.moengage.com/v1/customer/${MOE_WORKSPACE_ID}`; 

// // --- CORS Configuration ---
// const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'; 
// const corsOptions = {
//     origin: FRONTEND_URL, 
//     optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));
// app.use(bodyParser.json());

// // --- MOENGAGE TRACKING SERVICE (Customer API Model) ---
// async function updateMoEngageUser(email, name, phoneNumber) {
//     if (!MOE_WORKSPACE_ID || !MOE_DATA_API_KEY) {
//         console.error("MoEngage API keys are missing or invalid in environment.");
//         throw new Error("Server config error: Missing API Keys.");
//     }
    
//     // Base64 encoding for Basic Auth: "WorkspaceID:DataAPIKey"
//     const authString = Buffer.from(`${MOE_WORKSPACE_ID}:${MOE_DATA_API_KEY}`).toString('base64');
    
//     const firstName = name.split(' ')[0] || name;

//     // 1. Build Payload for Customer API (Simple structure, not batch)
//     const payload = {
//         // Required Field: type must be "customer"
//         type: "customer", 
        
//         // Required Identifier Field: customer_id is the unique key (set to email)
//         customer_id: email, 
        
//         // Optional: Ensure new users are created if they don't exist
//         update_existing_only: "false", 
        
//         // Attributes object
//         attributes: {
//             // Standard attributes confirmed in your documentation (u_em, u_fn, u_n)
//             "u_em": email, 
//             "u_fn": firstName,
//             "u_n": name,
            
//             // Custom attribute
//             "u_mb": phoneNumber
//         },
//     };

//     try {
//         const response = await axios.post(MOE_API_URL, payload, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Basic ${authString}` // Secure Auth Header
//             }
//         });

//         if (response.status === 200 && response.data.status === 'SUCCESS') {
//             return { success: true, message: "MoEngage user profile updated." };
//         } else {
//             console.error("MoEngage API response error:", response.data);
//             throw new Error(response.data.error || "External API call failed.");
//         }
//     } catch (error) {
//         // Log the detailed error from MoEngage 
//         console.error("Error communicating with MoEngage Customer API:", error.message, error.response?.data);
//         throw new Error("Failed to process request due to external service error.");
//     }
// }


// // 💡 NOTE: The Customer API only handles ATTRIBUTES. 
// // Event tracking needs a separate API call or a dedicated Event Tracking API endpoint.
// // For now, we will focus on making the Profile Update (attributes) work.
// // The "Lead Generated" event will NOT be tracked with this function.
// // If you want event tracking, we need to create a second endpoint/function for the Events API.


// // --- EXPRESS ROUTE ---
// app.post('/api/track-lead', async (req, res) => {
//     const { name, email, phoneNumber } = req.body; 
    
//     // Basic validation
//     if (!email || !name || !phoneNumber) {
//         return res.status(400).json({ error: 'Missing required form fields.' });
//     }
    
//     try {
//         await updateMoEngageUser(email, name, phoneNumber); 
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

// const express = require('express');
// const bodyParser = require('body-parser');
// const axios = require('axios');
// const cors = require('cors'); 
// require('dotenv').config(); 

// // --- EXPRESS SETUP ---
// const PORT = process.env.PORT || process.env.SERVER_PORT || 5000; 
// const app = express();

// // --- MOENGAGE CONFIGURATION ---
// const MOE_WORKSPACE_ID = process.env.MOENGAGE_APP_ID;
// const MOE_DATA_API_KEY = process.env.MOENGAGE_API_KEY;

// // 🚨 API Endpoints: Using the cluster-specific host (api-01)
// const MOE_CUSTOMER_API_URL = `https://api-01.moengage.com/v1/customer/${MOE_WORKSPACE_ID}`; 
// const MOE_EVENT_API_URL = `https://api-01.moengage.com/v1/event/${MOE_WORKSPACE_ID}`; // New Event Endpoint

// // --- CORS Configuration ---
// const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'; 
// const corsOptions = {
//     origin: FRONTEND_URL, 
//     optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));
// app.use(bodyParser.json());

// // Helper function to generate Basic Auth header
// const getAuthHeader = () => {
//     const authString = Buffer.from(`${MOE_WORKSPACE_ID}:${MOE_DATA_API_KEY}`).toString('base64');
//     return {
//         'Content-Type': 'application/json',
//         'Authorization': `Basic ${authString}`
//     };
// };


// // --- 1. PROFILE UPDATE SERVICE (Uses Customer API) ---
// async function updateMoEngageProfile(email, name, phoneNumber) {
//     const firstName = name.split(' ')[0] || name;
    
//     const payload = {
//         type: "customer", 
//         customer_id: email, 
//         update_existing_only: "false", 
//         attributes: {
//             "u_em": email, 
//             "u_fn": firstName,
//             "u_n": name,
//             "u_mb": phoneNumber // Standard Mobile Number key
//         },
//     };

//     try {
//         const response = await axios.post(MOE_CUSTOMER_API_URL, payload, {
//             headers: getAuthHeader()
//         });

//         // 🚨 FIX: Check for lowercase 'success' status in the response data
//         if (response.status === 200 && response.data.status === 'success') {
//             return { success: true, message: "MoEngage profile updated." };
//         } else {
//             // This is for other 200-level codes that are not 'success'
//             console.error("MoEngage Customer API response unexpected status:", response.data);
//             throw new Error("Customer API call returned unexpected status.");
//         }
//     } catch (error) {
//         console.error("Error communicating with Customer API:", error.message, error.response?.data);
//         throw new Error("Failed to update profile.");
//     }
// }


// // --- 2. EVENT TRACKING SERVICE (Uses Event API) ---
// async function trackFormSubmissionEvent(email) {
    
//     // Payload structure based on your Event API documentation (Image 1/8)
//     const payload = {
//         type: "event", 
//         customer_id: email, // Identifies the user who performed the action
        
//         // Array of actions/events
//         actions: [{
//             action: "Form Submitted", // The name of your custom event
            
//             // Attributes associated with this specific event instance
//             attributes: {
//                 "source": "Landing Page",
//                 "timestamp": new Date().toISOString()
//             }
//         }]
//     };

//     try {
//         const response = await axios.post(MOE_EVENT_API_URL, payload, {
//             headers: getAuthHeader()
//         });

//         if (response.status === 200 && response.data.status === 'success') { // 🚨 FIX HERE TOO
//             return { success: true, message: "MoEngage event tracked." };
//         } else {
//             console.error("MoEngage Event API response error:", response.data);
//             throw new Error(response.data.error || "Event API call failed.");
//         }
//     } catch (error) {
//         console.error("Error communicating with Event API:", error.message, error.response?.data);
//         // Note: Event tracking failure should not stop the profile update, but we log it.
//         throw new Error("Failed to track event."); 
//     }
// }


// // --- EXPRESS ROUTE (Coordinates both calls) ---
// app.post('/api/track-lead', async (req, res) => {
//     const { name, email, phoneNumber } = req.body; 
    
//     if (!email || !name || !phoneNumber) {
//         return res.status(400).json({ error: 'Missing required form fields.' });
//     }
    
//     try {
//         // 1. Update Profile/Attributes (Customer API)
//         await updateMoEngageProfile(email, name, phoneNumber); 
        
//         // 2. Track the Event (Event API)
//         await trackFormSubmissionEvent(email);
        
//         // Both calls succeeded, return success to the frontend
//         res.status(200).json({ message: 'Lead profile updated and event tracked successfully.' });
//     } catch (error) {
//         // If either call fails, log the error and return a generic 500
//         console.error("Global API Route Failure:", error.message);
//         res.status(500).json({ error: 'Internal server error while processing request.' });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Backend server running on port ${PORT}. Ready for event tracking.`);
// }); const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors'); 
require('dotenv').config(); 

// --- EXPRESS SETUP ---
const PORT = process.env.PORT || process.env.SERVER_PORT || 5000; 
const app = express();

// --- MOENGAGE CONFIGURATION ---
const MOE_WORKSPACE_ID = process.env.MOENGAGE_APP_ID;
const MOE_DATA_API_KEY = process.env.MOENGAGE_API_KEY;

const MOE_CUSTOMER_API_URL = `https://api-01.moengage.com/v1/customer/${MOE_WORKSPACE_ID}`; 
const MOE_EVENT_API_URL = `https://api-01.moengage.com/v1/event/${MOE_WORKSPACE_ID}`; 

// --- CORS Configuration ---
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'; 
const corsOptions = {
    origin: FRONTEND_URL, 
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Helper function to generate Basic Auth header
const getAuthHeader = () => {
    const authString = Buffer.from(`${MOE_WORKSPACE_ID}:${MOE_DATA_API_KEY}`).toString('base64');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
    };
};


// --- 1. PROFILE UPDATE SERVICE (Uses Customer API) ---
async function updateMoEngageProfile(email, name, phoneNumber) {
    const firstName = name.split(' ')[0] || name;
    
    const payload = {
        type: "customer", 
        customer_id: email, 
        update_existing_only: "false", 
        attributes: {
            "u_em": email, 
            "u_fn": firstName,
            "u_n": name,
            "u_mb": phoneNumber 
        },
    };

    try {
        const response = await axios.post(MOE_CUSTOMER_API_URL, payload, {
            headers: getAuthHeader()
        });

        if (response.status === 200 && response.data.status === 'success') {
            return { success: true, message: "MoEngage profile updated." };
        } else {
            console.error("MoEngage Customer API response unexpected status:", response.data);
            throw new Error("Customer API call returned unexpected status.");
        }
    } catch (error) {
        console.error("Error communicating with Customer API:", error.message, error.response?.data);
        throw new Error("Failed to update profile.");
    }
}


// --- 2. EVENT TRACKING SERVICE (Uses Event API) ---
// 🚨 UPDATE: Function now accepts time attributes
async function trackFormSubmissionEvent(email, userTime, currentTime, timezoneOffset) {
    
    const payload = {
        type: "event", 
        customer_id: email, 
        
        actions: [{
            action: "Form Submitted",
            
            // 🚨 NEW: Add the required attributes to the event details
            attributes: {
                "source": "Landing Page",
                "timestamp": new Date().toISOString(),
                "user_time": userTime,           // Epoch in seconds (Numeric)
                "current_time": currentTime,       // Epoch in seconds (Numeric)
                "user_timezone_offset": timezoneOffset // Offset in seconds (Numeric)
            }
        }]
    };

    try {
        const response = await axios.post(MOE_EVENT_API_URL, payload, {
            headers: getAuthHeader()
        });

        if (response.status === 200 && response.data.status === 'success') { 
            return { success: true, message: "MoEngage event tracked." };
        } else {
            console.error("MoEngage Event API response error:", response.data);
            throw new Error(response.data.error || "Event API call failed.");
        }
    } catch (error) {
        console.error("Error communicating with Event API:", error.message, error.response?.data);
        throw new Error("Failed to track event."); 
    }
}


// --- EXPRESS ROUTE (Coordinates both calls) ---
app.post('/api/track-lead', async (req, res) => {
    // 🚨 UPDATE: Destructure all fields, including the new time attributes
    const { 
        name, 
        email, 
        phoneNumber, 
        user_time, 
        current_time, 
        user_timezone_offset 
    } = req.body; 
    
    if (!email || !name || !phoneNumber) {
        return res.status(400).json({ error: 'Missing required form fields.' });
    }
    
    try {
        // 1. Update Profile/Attributes (Customer API)
        await updateMoEngageProfile(email, name, phoneNumber); 
        
        // 2. 🚨 UPDATE: Pass the time attributes to the event tracking function
        await trackFormSubmissionEvent(
            email, 
            user_time, 
            current_time, 
            user_timezone_offset
        );
        
        res.status(200).json({ message: 'Lead profile updated and event tracked successfully.' });
    } catch (error) {
        console.error("Global API Route Failure:", error.message);
        res.status(500).json({ error: 'Internal server error while processing request.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}. Ready for event tracking.`);
});

