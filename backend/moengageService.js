// backend/moengageService.js

const axios = require('axios');
const MOE_WORKSPACE_ID = process.env.MOE_WORKSPACE_ID;
const MOE_DATA_API_KEY = process.env.MOE_DATA_API_KEY;

// Base64 encoding for Basic Auth: "WorkspaceID:DataAPIKey"
const authString = Buffer.from(`${MOE_WORKSPACE_ID}:${MOE_DATA_API_KEY}`).toString('base64');
const MOE_API_URL = 'https://api-0X.moengage.com/v1/customer/DNBVW45PTD67QO7I1Q7ORLZD'; // The MoEngage Data API endpoint

// Function to call the MoEngage Data API for tracking attributes and events
async function trackUserActivity(userId, attributes, eventName, eventAttributes) {
    if (!userId) {
        throw new Error("User ID (email) is required for server-side tracking.");
    }

    // 1. Prepare the attributes payload
    const attributePayload = {
        type: "user",
        action: "set_attribute",
        attributes: [
            // Standard attribute for unique identification
            { name: "USER_ATTRIBUTE_UNIQUE_ID", value: userId, type: "string" },
            // Add other attributes passed from the frontend
            ...attributes 
        ]
    };
    
    // 2. Prepare the event payload
    const eventPayload = {
        type: "event",
        action: "track_event",
        attributes: [
            { name: "USER_ATTRIBUTE_UNIQUE_ID", value: userId, type: "string" },
            { name: "event_name", value: eventName, type: "string" },
            { name: "event_time", value: new Date().toISOString(), type: "date" }, // Track event time
            { name: "attributes", value: eventAttributes, type: "object" } // Custom event properties
        ]
    };
    
    // Combine both payloads into a single batch for efficiency
    const payload = {
        app_id: MOE_WORKSPACE_ID,
        data: [attributePayload, eventPayload]
    };

    try {
        const response = await axios.post(MOE_API_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authString}` // Secure Basic Auth
            }
        });

        if (response.status === 200 && response.data.status === 'SUCCESS') {
            return { success: true, message: "MoEngage data updated." };
        } else {
            console.error("MoEngage API response error:", response.data);
            return { success: false, message: response.data.error || "API call failed." };
        }

    } catch (error) {
        console.error("Network or internal error calling MoEngage:", error.message);
        throw new Error("Failed to communicate with MoEngage API.");
    }
}

module.exports = { trackUserActivity };