// functions/track-lead.js

// We need to use 'require' for dependencies in Netlify Functions
const axios = require('axios'); 
// dotenv is often handled automatically by Netlify's build process, 
// but including the config setup is a good practice if you run locally.
//require('dotenv').config({ path: '../backend/.env' }); 

// --- MOENGAGE CONFIGURATION & SERVICE LOGIC ---
// Netlify automatically exposes environment variables set in its UI or .env
const MOE_WORKSPACE_ID = process.env.MOE_WORKSPACE_ID;
const MOE_DATA_API_KEY = process.env.MOE_DATA_API_KEY;
const MOE_API_URL = 'https://api.moengage.com/v1/track';

// Base64 encoding for Basic Auth: "WorkspaceID:DataAPIKey"
// We only generate this once at the top level
const authString = Buffer.from(`${MOE_WORKSPACE_ID}:${MOE_DATA_API_KEY}`).toString('base64');


// The main handler function required by Netlify Serverless Functions
exports.handler = async (event, context) => {
    // 1. Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed. Use POST.' }),
        };
    }

    try {
        // 2. Parse the body from the frontend request (it comes as a string)
        const { name, email, phoneNumber } = JSON.parse(event.body);

        if (!email || !name || !phoneNumber) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required form fields.' }),
            };
        }

        // 3. Check for API keys (for local testing sanity)
        if (!MOE_WORKSPACE_ID || !MOE_DATA_API_KEY) {
            console.error("MoEngage API keys are missing in environment.");
            return { 
                statusCode: 500, 
                body: JSON.stringify({ error: "Server configuration error: Missing API Keys." })
            };
        }

        // 4. Format attributes and event for MoEngage
        const attributes = [
            { name: "USER_ATTRIBUTE_EMAIL", value: email, type: "string" },
            { name: "First Name", value: name.split(' ')[0] || name, type: "string" },
            { name: "Contact Phone", value: phoneNumber, type: "string" }
        ];

        const eventName = 'Lead Generated';
        const eventAttributes = {
            'lead_source': 'Landing Page Form',
            'form_version': 1.0
        };

        // 5. Build MoEngage Payload (Batch Request)
        const moengagePayload = {
            app_id: MOE_WORKSPACE_ID,
            data: [
                {
                    type: "user",
                    action: "set_attribute",
                    attributes: [
                        { name: "USER_ATTRIBUTE_UNIQUE_ID", value: email, type: "string" },
                        ...attributes 
                    ]
                },
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

        // 6. Call MoEngage API
        const response = await axios.post(MOE_API_URL, moengagePayload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authString}` // Secure Auth Header
            }
        });

        // 7. Check MoEngage response
        if (response.status === 200 && response.data.status === 'SUCCESS') {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "MoEngage data updated successfully." }),
            };
        } else {
            console.error("MoEngage API failed:", response.data);
            return {
                statusCode: 502, // Bad Gateway (External API Failure)
                body: JSON.stringify({ error: "External service failure." }),
            };
        }

    } catch (error) {
        console.error("Function execution error:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error processing request.' }),
        };
    }
};