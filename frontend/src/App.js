// import React from 'react'; // 👈 useEffect and moengage import is no longer needed
// // ❌ REMOVE: import { useEffect } from 'react';
// // ❌ REMOVE: import moengage from "@moengage/web-sdk"; 

// import IntroSection from './components/IntroSection'; 
// import UserForm from './components/UserForm'; 
// import './App.css'; 

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Future Dynamics Solutions</h1>
//         <p>Driving innovation and user connectivity in the digital space.</p>
//       </header>

//       <IntroSection />

//       {/* CONTACT FORM SECTION */}
//       <section className="info-section contact-us">
//         <h2>Interested? Contact Us.</h2>
//         <p className="contact-subtext">Tell us about your needs and we'll reach out to discuss how we can help you grow.</p>
//         <UserForm />
//       </section>
//     </div>
//   );
// }

// export default App;

// import React, { useEffect } from 'react'; // 👈 Re-import useEffect
// import moengage from "@moengage/web-sdk"; // 👈 Re-import moengage
// import IntroSection from './components/IntroSection';
// import UserForm from './components/UserForm';
// import InboxContainer from './components/InboxContainer';
// import './App.css';

// function App() {
//   useEffect(() => {
//     // 💡 IMPORTANT: Use the actual App ID (Workspace ID) here. 
//     // This value is publicly exposed and does not need to be hidden.
//     const moengageConfig = {
//       app_id: 'DNBVW45PTD67QO7I1Q7ORLZD', // Your actual Workspace ID
//       cluster: 'DC_1',
//       useLatest: true,
//       cards: {
//         enable: true,
//         // placeholder: '#inbox-button',
//       }
//     };

//     // moengage.onsite.registerCallback(tagName, function (err, data) {
//     //   if (err) {
//     //     // Handle error case here
//     //     // We could get error for various reasons, like
//     //     // network issues, campaigns not present for a particular tag
//     //     return console.error('Error from moengage:', err);
//     //   }
//     //   console.log('Data for campaign:', data);
//     //   var payload = data.payload; // Campaign payload defined during campaign creation
//     //   var impTracker = data.imp; // Function, you can call impTracker() to send impression stats for a campaign back to MoEngage. Call this after you have successfully rendered the HTML as per the payload provided.
//     //   var clickTracker = data.click({ widget_id: "sample_widget_id" }); // Function, you can call clickTracker() to send click stats for a campaign back to MoEngage. Call this when the user clicks on the desired section of the website. Passing widget_id is not mandatory and should only be used in case you want to differentiate the clicks between 2 different widgets of the Web Personalization Campaign.
//     // });

//     if (moengage) {
//       moengage.initialize(moengageConfig);
//       console.log("MoEngage Web SDK Initialized.");
//     }
//   }, []); // Runs once on component mount

//   return (
//     <div className="App">
//       <InboxContainer />
//       <header className="App-header">
//         <h1>Future Dynamics Solutions</h1>
//         <p>Driving innovation and user connectivity in the digital space.</p>
//       </header>

//       <IntroSection />

//       {/* CONTACT FORM SECTION */}
//       <section className="info-section contact-us">
//         <h2>Interested? Contact Us.</h2>
//         <p className="contact-subtext">Tell us about your needs and we'll reach out to discuss how we can help you grow.</p>
//         <UserForm />
//       </section>
//     </div>
//   );
// }

// export default App;

// import React, { useEffect } from 'react';
// import moengage from "@moengage/web-sdk";
// import IntroSection from './components/IntroSection';
// import UserForm from './components/UserForm';
// import InboxContainer from './components/InboxContainer';
// import './App.css';

// function App() {
//   useEffect(() => {
//     // 1. Define configuration with Cards enabled
//     const moengageConfig = {
//       app_id: 'DNBVW45PTD67QO7I1Q7ORLZD', // Your actual Workspace ID
//       cluster: 'DC_1',
//       useLatest: true,
//       cards: {
//         enable: true,
//       }
//     };

//     if (moengage) {
//       moengage.initialize(moengageConfig);
//       console.log("MoEngage Web SDK Initialized.");
      
//       // 2. Global readiness check (Optional but good practice)
//       moengage.on_cards_loaded(function() {
//         console.log("MoEngage Core SDK and Modules are ready for general use.");
//       });
//     }
//   }, []); // Run once on component mount

//   return (
//     <div className="App">
//       {/* Inbox is placed here */}
//       <InboxContainer />
//       <header className="App-header">
//         <h1>Future Dynamics Solutions</h1>
//         <p>Driving innovation and user connectivity in the digital space.</p>
//       </header>

//       <IntroSection />

//       <section className="info-section contact-us">
//         <h2>Interested? Contact Us.</h2>
//         <p className="contact-subtext">Tell us about your needs and we'll reach out to discuss how we can help you grow.</p>
//         <UserForm />
//       </section>
//     </div>
//   );
// }

// export default App;

import React, { useEffect } from 'react';
import moengage from "@moengage/web-sdk";
import IntroSection from './components/IntroSection';
import UserForm from './components/UserForm';
import InboxContainer from './components/InboxContainer'; // Keep Inbox for previous functionality
import './App.css';

// 🚨 Global tag name used to fetch the campaign
const GLOBAL_PERSONALIZATION_TAG = 'homepage_banner'; 

function App() {
  // State to hold and manage the personalization payload once received from MoEngage
  const [personalizationData, setPersonalizationData] = React.useState(null);

  useEffect(() => {
    // 1. MoEngage SDK Initialization
    const moengageConfig = {
      app_id: 'DNBVW45PTD67QO7I1Q7ORLZD', // Your actual Workspace ID
      cluster: 'DC_1',
      useLatest: true,
      cards: { enable: true }, 
    };

    if (moengage) {
      moengage.initialize(moengageConfig);
      console.log("MoEngage Web SDK Initialized.");
      
      // 2. Web Personalization (OSM) Integration
      moengage.onsite.registerCallback(GLOBAL_PERSONALIZATION_TAG, function (err, data) {
        if (err) {
          // Log an error if the campaign fetch failed (e.g., campaign inactive, network issue)
          return console.error(`[MoEngage OSM Error for ${GLOBAL_PERSONALIZATION_TAG}]:`, err);
        }
        
        console.log(`[MoEngage OSM Success for ${GLOBAL_PERSONALIZATION_TAG}]: Data Received.`, data);
        
        // Store the payload and tracking functions in state
        if (data && data.payload) {
            setPersonalizationData({
                payload: data.payload, // Custom JSON payload set in MoEngage
                impTracker: data.imp, // Impression tracker function
                clickTracker: data.click // Click tracker function
            });
        }
      });
    }
  }, []); // Run once on component mount

  // --- Dynamic Banner Component ---
  const PersonalizationBanner = () => {
      if (!personalizationData) return null; // Hide if no data is available
      
      const { payload, impTracker, clickTracker } = personalizationData;

      // 🚨 CRITICAL: Call the impression tracker (impTracker) immediately after rendering.
      // This tells MoEngage the message was shown.
      if (impTracker) {
          impTracker(); 
          // Set the tracker function to null to prevent it from firing repeatedly on subsequent renders
          setPersonalizationData(prev => ({...prev, impTracker: null})); 
      }

      // Display the banner using custom keys defined in your MoEngage payload JSON
      return (
          <div 
              style={{ 
                  padding: '15px', 
                  // Use a default background if your payload doesn't include a 'theme'
                  background: payload.theme || '#ffcc00', 
                  color: payload.textColor || 'black',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  cursor: clickTracker ? 'pointer' : 'default'
              }}
              // Track the click using the clickTracker function provided by MoEngage
              onClick={() => clickTracker && clickTracker()} 
          >
              <p style={{ margin: 0 }}>
                  📢 {payload.bannerMessage || "Custom Campaign Delivered!"}
              </p>
          </div>
      );
  };
  // ---------------------------------

  return (
    <div className="App">
      {/* 🚨 Dynamic Banner is placed here */}
      <PersonalizationBanner />
      
      <InboxContainer />
      <header className="App-header">
        <h1>Future Dynamics Solutions</h1>
        <p>Driving innovation and user connectivity in the digital space.</p>
      </header>

      <IntroSection />

      <section className="info-section contact-us">
        <h2>Interested? Contact Us.</h2>
        <p className="contact-subtext">Tell us about your needs and we'll reach out to discuss how we can help you grow.</p>
        <UserForm />
      </section>
    </div>
  );
}

export default App;