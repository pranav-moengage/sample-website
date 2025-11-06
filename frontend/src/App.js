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

import React, { useEffect } from 'react';
import moengage from "@moengage/web-sdk";
import IntroSection from './components/IntroSection';
import UserForm from './components/UserForm';
import InboxContainer from './components/InboxContainer';
import './App.css';

function App() {
  useEffect(() => {
    // 1. Define configuration with Cards enabled
    const moengageConfig = {
      app_id: 'DNBVW45PTD67QO7I1Q7ORLZD', // Your actual Workspace ID
      cluster: 'DC_1',
      useLatest: true,
      cards: {
        enable: true,
      }
    };

    if (moengage) {
      moengage.initialize(moengageConfig);
      console.log("MoEngage Web SDK Initialized.");
      
      // 2. Global readiness check (Optional but good practice)
      moengage.onReady(function() {
        console.log("MoEngage Core SDK and Modules are ready for general use.");
      });
    }
  }, []); // Run once on component mount

  return (
    <div className="App">
      {/* Inbox is placed here */}
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