// import React, { useEffect } from 'react'; // 👈 Import useEffect
// import moengage from "@moengage/web-sdk"; // 👈 Import moengage
// import IntroSection from './components/IntroSection'; 
// import UserForm from './components/UserForm'; 
// import './App.css'; 

// function App() {
//   useEffect(() => {
//     const moengageConfig = {
//       app_id: 'DNBVW45PTD67QO7I1Q7ORLZD', 
//       cluster: 'DC_1', 
//       useLatest: true 
//     };

//     if (moengage) {
//         moengage.initialize(moengageConfig);
//         console.log("MoEngage SDK Initialized.");
//     }
//   }, []);

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

// frontend/src/App.js

import React from 'react'; // 👈 useEffect and moengage import is no longer needed
// ❌ REMOVE: import { useEffect } from 'react';
// ❌ REMOVE: import moengage from "@moengage/web-sdk"; 

import IntroSection from './components/IntroSection'; 
import UserForm from './components/UserForm'; 
import './App.css'; 

function App() {
  /*
  // ❌ REMOVE THIS useEffect block as it's no longer needed for SDK initialization
  useEffect(() => {
    const moengageConfig = {
      app_id: 'DNBVW45PTD67QO7I1Q7ORLZD', 
      cluster: 'DC_1', 
      useLatest: true 
    };

    if (moengage) {
        moengage.initialize(moengageConfig);
        console.log("MoEngage SDK Initialized.");
    }
  }, []);
  */

  return (
    <div className="App">
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