// import React, { useState } from 'react';
// // Assume you will place the actual MoEngage Inbox implementation logic here later

// const InboxContainer = () => {
//     // State to toggle the visibility of the inbox list
//     const [isInboxOpen, setIsInboxOpen] = useState(false);

//     const toggleInbox = () => {
//         setIsInboxOpen(!isInboxOpen);
//         // 💡 FUTURE STEP: This is where you will call the MoEngage SDK 
//         // function to fetch and display the cards!
//         if (!isInboxOpen) {
//             console.log("Inbox opened. Next step: Call MoEngage SDK to display cards.");
//         }
//     };

//     return (
//         <div className="inbox-main-wrapper">

//             {/* 1. The Inbox Button (The Trigger/Placeholder) */}
//             <button 
//                 onClick={toggleInbox} 
//                 className="inbox-button"
//                 aria-expanded={isInboxOpen}
//             >
//                 📬 Inbox 
//                 {/* You can replace "Inbox" with an actual icon */}
//             </button>

//             {/* 2. The Card Display Area (The Placeholder Container) */}
//             {isInboxOpen && (
//                 <div className="moengage-inbox-placeholder">
//                     {/* This container is where the cards will be rendered.
//                       You will inject the MoEngage card list into this div.
//                       For now, it's a simple placeholder message.
//                     */}
//                     <h3>Your Notifications</h3>
//                     {/* <p>Card list goes here (Implementation using MoEngage SDK).</p> */}
//                     <div className="card-list-area">
//                         {/* MoEngage Cards will render inside this list area */}
//                     </div>
//                 </div>
//             )}

//         </div>
//     );
// };

// export default InboxContainer;

// import React, { useState, useEffect } from 'react';
// import moengage from "@moengage/web-sdk"; // Import the SDK

// const InboxContainer = () => {
//     const [isInboxOpen, setIsInboxOpen] = useState(false);
//     const [cardData, setCardData] = useState([]);
//     const [loading, setLoading] = useState(false);

//     // --- 1. Function to Fetch Cards ---

//     const fetchAndDisplayCards = async () => {
//         if (!moengage || !moengage.cards) {
//             console.error("MoEngage Cards module not ready.");
//             return;
//         }

//         setLoading(true);
//         setCardData([]); // Clear previous data


//         try {
//             moengage.on_cards_loaded().then(function() {

//             //const CATEGORY_NAME = 'Product Updates';
//             const result = moengage.cards.getCardsForCategory('Product Updates').then(function(cards){

//             if (result && result.cards && Array.isArray(result.cards)) {

//                 const allCards = result.cards
//                     // 🚨 Filter to ensure the essential parts of the template data exist
//                     .filter(card =>
//                         card.templateData &&
//                         card.templateData.containers &&
//                         card.templateData.containers[0]
//                     )
//                     .map(card => {
//                         const widgets = card.templateData.containers[0].widgets;

//                         // 🚨 FIX: Map the content based on the widgets array index
//                         const headerWidget = widgets.find(w => w.id === 1 && w.type === 'text') || widgets[0];
//                         const messageWidget = widgets.find(w => w.id === 2 && w.type === 'text') || widgets[1];

//                         return {
//                             id: card.id,
//                             // Extract content from the specific widget structure
//                             title: headerWidget?.content.replace(/<\/?div>/g, '') || 'No Header', // Stripping <div> tags
//                             message: messageWidget?.content.replace(/<\/?div>/g, '') || 'No Message', // Stripping <div> tags
//                             rawCard: card // Keep the full object for debugging
//                         };
//                     });

//                 setCardData(allCards);

//             } else {
//                 console.log("MoEngage Cards: No card data received.");
//                 setCardData([]);
//             }
//         })     
//             })
//         } catch (error) {
//             console.error("Error fetching MoEngage Cards:", error);
//             setCardData([{ id: 'error', title: 'Error loading inbox.', message: 'Check console for details.' }]);
//         } finally {
//             setLoading(false);
//         }
//     }; 

//     // --- 2. Toggle Handler ---
//     const toggleInbox = () => {
//         const newState = !isInboxOpen;
//         setIsInboxOpen(newState);

//         if (newState) {
//             // 🚨 Action: Fetch cards immediately when the inbox opens
//             fetchAndDisplayCards();

//             // 💡 Optional: Notify SDK the inbox section is viewed for analytics
//             // moengage.cards.onCardsSectionLoaded(); 
//         } else {
//             // 💡 Optional: Notify SDK the inbox section is closed
//             // moengage.cards.onCardSectionUnLoaded(); 
//         }
//     };

//     // --- 3. Render Component ---
//     return (
//         <div className="inbox-main-wrapper">
//             <button
//                 onClick={toggleInbox}
//                 className="inbox-button"
//                 aria-expanded={isInboxOpen}
//             >
//                 📬 Inbox ({cardData.length})
//             </button>

//             {isInboxOpen && (
//                 <div className="moengage-inbox-placeholder">
//                     <h3>Your Notifications</h3>
//                     <div className="card-list-area">
//                         {loading && <p>Loading cards...</p>}

//                         {!loading && cardData.length === 0 && (
//                             <p>No new messages available.</p>
//                         )}

//                         {!loading && cardData.map(card => (
//                             <div key={card.id} className="moengage-card">
//                                 <h4>{card.title}</h4>
//                                 <p>{card.message}</p>
//                                 {/* Add moengage.cards.cardClicked(cardId) on button/link clicks */}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//         </div>
//     );
// };

// export default InboxContainer;

import React, { useState, useEffect } from 'react';
import moengage from "@moengage/web-sdk"; 

const InboxContainer = () => {
    const [isInboxOpen, setIsInboxOpen] = useState(false);
    const [cardData, setCardData] = useState([]);
    const [loading, setLoading] = useState(false);
    // 🚨 FIX 1: New state to track the readiness of the Cards module
    const [isCardsModuleReady, setIsCardsModuleReady] = useState(false); 
    
    // --- 0. Lifecycle Hook to Wait for Cards Initialization ---
    useEffect(() => {
        // We use the SDK's promise helper to wait for the module to be initialized
        if (moengage && moengage.on_cards_loaded) {
            moengage.on_cards_loaded().then(() => {
                setIsCardsModuleReady(true);
                console.log("MoEngage Cards Module is officially ready!");
            }).catch(err => {
                 console.error("MoEngage Cards initialization failed:", err);
            });
        }
    }, []); // Run once on mount

    // --- 1. Function to Fetch Cards (Now GUARANTEED to run only when ready) ---
    const fetchAndDisplayCards = async () => {
        // 🚨 FIX 2: We can remove the strict IF check since the button will be disabled
        if (!isCardsModuleReady) {
            console.error("Cards module not yet ready (button should be disabled).");
            return;
        }

        setLoading(true);
        setCardData([]); 
        const CATEGORY_NAME = 'Product Updates';
        
        try {
            // Note: We skip moengage.on_cards_loaded() here because useEffect already awaited it.
            
            // 3. Force a server refresh (Data sync)
            await moengage.cards.fetchCards();
            
            // 4. Retrieve data from local cache
            const result = await moengage.cards.getCardsForCategory(CATEGORY_NAME); 
            
            // 5. Notify Inbox Open
            moengage.cards.inboxOpened();
            
            // --- Data Processing ---
            if (result && result.cards && Array.isArray(result.cards)) {
                // ... (Data mapping logic remains the same) ...
                
                const allCards = result.cards
                    .filter(card => /* ... */ true) 
                    .map(card => {
                        const widgets = card.templateData.containers[0].widgets;
                        const headerWidget = widgets.find(w => w.id === 1 && w.type === 'text') || widgets[0];
                        const messageWidget = widgets.find(w => w.id === 2 && w.type === 'text') || widgets[1];

                        // Track Impression Stat
                        moengage.cards.cardShown(card.id); 

                        return {
                            id: card.id,
                            title: headerWidget?.content.replace(/<\/?div>/g, '') || 'No Header',
                            message: messageWidget?.content.replace(/<\/?div>/g, '') || 'No Message',
                        };
                    });
                
                setCardData(allCards);
            } else {
                console.log("MoEngage Cards: No eligible cards received.");
                setCardData([]);
            }
        } catch (error) {
            console.error("Error fetching MoEngage Cards:", error);
            setCardData([{ id: 'error', title: 'Error loading inbox.', message: 'Check console for details.' }]);
        } finally {
            setLoading(false);
        }
    }; 

    // --- 2. Toggle Handler (remains the same) ---
    const toggleInbox = () => {
        const newState = !isInboxOpen;
        setIsInboxOpen(newState);

        if (newState) {
            fetchAndDisplayCards();
        }
    };

    // --- 3. Render Component ---
    return (
        <div className="inbox-main-wrapper">
            <button
                onClick={toggleInbox}
                className="inbox-button"
                aria-expanded={isInboxOpen}
                // 🚨 FIX 3: Disable button until the module is ready
                disabled={!isCardsModuleReady} 
                title={!isCardsModuleReady ? "Loading Inbox Module..." : "Open Inbox"}
            >
                📬 Inbox ({cardData.length})
                {/* 💡 Optionally show a loading spinner if the module is not ready */}
                {!isCardsModuleReady && <span style={{ marginLeft: '5px' }}>⏳</span>} 
            </button>

            {/* ... rest of the render logic ... */}
        </div>
    );
};

export default InboxContainer;