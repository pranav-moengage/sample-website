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

import React, { useEffect } from 'react'; // 👈 Re-import useEffect
import moengage from "@moengage/web-sdk"; // 👈 Re-import moengage
import IntroSection from './components/IntroSection';
import UserForm from './components/UserForm';
import InboxContainer from './components/InboxContainer';
import './App.css';

function App() {
  useEffect(() => {
    // 💡 IMPORTANT: Use the actual App ID (Workspace ID) here. 
    // This value is publicly exposed and does not need to be hidden.
    const moengageConfig = {
      app_id: 'DNBVW45PTD67QO7I1Q7ORLZD', // Your actual Workspace ID
      cluster: 'DC_1',
      useLatest: true,
      cards: {
        enable: true, 
        // placeholder: '#inbox-button',
      }
    };

    if (moengage) {
      moengage.initialize(moengageConfig);
      console.log("MoEngage Web SDK Initialized.");
    }
  }, []); // Runs once on component mount

  return (
    <div className="App">
        <InboxContainer/>
      <header className="App-header">
        <h1>Future Dynamics Solutions</h1>
        <p>Driving innovation and user connectivity in the digital space.</p>
      </header>

      <IntroSection />

      {/* CONTACT FORM SECTION */}
      <section className="info-section contact-us">
        <h2>Interested? Contact Us.</h2>
        <p className="contact-subtext">Tell us about your needs and we'll reach out to discuss how we can help you grow.</p>
        <UserForm />
      </section>
    </div>
  );
}

export default App;