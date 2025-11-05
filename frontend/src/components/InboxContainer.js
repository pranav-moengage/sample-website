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

import React, { useState, useEffect } from 'react';
import moengage from "@moengage/web-sdk"; // Import the SDK

const InboxContainer = () => {
    const [isInboxOpen, setIsInboxOpen] = useState(false);
    const [cardData, setCardData] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- 1. Function to Fetch Cards ---
    const fetchAndDisplayCards = async () => {
        if (!moengage || !moengage.cards) {
            console.error("MoEngage Cards module not ready.");
            return;
        }

        setLoading(true);
        setCardData([]); // Clear previous data

        try {
            // Use fetchCards() to force a fresh sync (better for up-to-date content)
            // Note: This API call may be throttled to 5 minutes between calls.
            const result = await moengage.cards.fetchCards('Product Updates');

            // The result structure contains categories and cards
            if (result && result.cardsInfo && Array.isArray(result.cardsInfo)) {

                // Process the cards to pull out the content you need
                const allCards = result.cardsInfo.flatMap(category =>
                    category.cards
                        .filter(card => card.data && card.data.Header && card.data.Message) // Filter out incomplete cards
                        .map(card => ({
                            id: card.id,
                            // 🚨 FIX: Map the fields directly from the MoEngage template keys
                            title: card.data.Header,
                            message: card.data.Message,
                            // You can also track the unique campaign name if available
                            campaignName: card.data.campaignName
                        }))
                );

                setCardData(allCards);
            } else {
                console.log("MoEngage Cards: No card data received.");
                setCardData([]);
            }

        } catch (error) {
            console.error("Error fetching MoEngage Cards:", error);
            setCardData([{ id: 'error', title: 'Error loading inbox.', message: 'Check console for details.' }]);
        } finally {
            setLoading(false);
        }
    };

    // --- 2. Toggle Handler ---
    const toggleInbox = () => {
        const newState = !isInboxOpen;
        setIsInboxOpen(newState);

        if (newState) {
            // 🚨 Action: Fetch cards immediately when the inbox opens
            fetchAndDisplayCards();

            // 💡 Optional: Notify SDK the inbox section is viewed for analytics
            // moengage.cards.onCardsSectionLoaded(); 
        } else {
            // 💡 Optional: Notify SDK the inbox section is closed
            // moengage.cards.onCardSectionUnLoaded(); 
        }
    };

    // --- 3. Render Component ---
    return (
        <div className="inbox-main-wrapper">
            <button
                onClick={toggleInbox}
                className="inbox-button"
                aria-expanded={isInboxOpen}
            >
                📬 Inbox ({cardData.length})
            </button>

            {isInboxOpen && (
                <div className="moengage-inbox-placeholder">
                    <h3>Your Notifications</h3>
                    <div className="card-list-area">
                        {loading && <p>Loading cards...</p>}

                        {!loading && cardData.length === 0 && (
                            <p>No new messages available.</p>
                        )}

                        {!loading && cardData.map(card => (
                            <div key={card.id} className="moengage-card">
                                <h4>{card.title}</h4>
                                <p>{card.message}</p>
                                {/* Add moengage.cards.cardClicked(cardId) on button/link clicks */}
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default InboxContainer;