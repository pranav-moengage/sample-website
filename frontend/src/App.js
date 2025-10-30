// // import React, { useEffect } from 'react'; 
// // import moengage from "@moengage/web-sdk";
// // import IntroSection from './components/IntroSection'; 
// // import UserForm from './components/UserForm'; 
// // import './App.css'; 

// // function App() {
// //   useEffect(() => {
// //     // ⚠️ REPLACE WITH YOUR ACTUAL MOENGAGE CREDENTIALS
// //     const MOENGAGE_APP_ID = 'DNBVW45PTD67QO7I1Q7ORLZD'; 
// //     const MOENGAGE_CLUSTER = 'DC_1'; // Check your cluster (DC_1, DC_2, etc.)

// //     const moengageConfig = {
// //       app_id: MOENGAGE_APP_ID, 
// //       cluster: MOENGAGE_CLUSTER,
// //       useLatest: true
// //     };

// //     if (moengage) {
// //         moengage.initialize(moengageConfig);
// //         console.log("MoEngage SDK Initialized.");
// //     }
// //   }, []);

// //   return (
// //     <div className="App">
// //       <header className="App-header">
// //         <h1>Future Dynamics Solutions</h1>
// //         <p>Driving innovation and user connectivity in the digital space.</p>
// //       </header>

// //       <IntroSection />

// //       <section className="info-section contact-us">
// //         <h2>Interested? Contact Us.</h2>
// //         <p className="contact-subtext">Tell us about your needs and we'll reach out to discuss how we can help you grow.</p>
// //         <UserForm />
// //       </section>
// //     </div>
// //   );
// // }

// // export default App;

// import React from 'react';
// import UserForm from './components/UserForm'; 
// import './App.css'; 

// function App() {
//   const imageUrl = "https://placehold.co/1200x400/007bff/ffffff?text=Strategy+and+Execution";

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Future Dynamics Solutions</h1>
//         <p>Driving innovation and user connectivity in the digital space.</p>
//       </header>

//       {/* SECTION 1: Who We Are */}
//       <section className="info-section who-we-are">
//         <h2>Who We Are</h2>
//         <p>We are a dedicated team of digital architects focused on bridging the gap between complex data and actionable insights. Our mission is to build robust, scalable platforms that empower businesses to understand their users better and make data-driven decisions. We believe in simplicity, efficiency, and real-time responsiveness.</p>
//         <p>Our commitment extends beyond code; we prioritize user privacy and ensure every interaction is secure, transparent, and valuable.</p>
//       </section>

//       {/* FILLER IMAGE */}
//       <div className="filler-image-container">
//         <img 
//           src={imageUrl} 
//           alt="Abstract graphic representing strategy and execution"
//           className="filler-image"
//           // Fallback image in case the placeholder service is down
//           onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/1200x400/333/fff?text=Digital+Landscape" }} 
//         />
//       </div>

//       {/* SECTION 2: What We Do */}
//       <section className="info-section what-we-do">
//         <h2>What We Do</h2>
//         <p>Our core offering is a state-of-the-art data tracking module designed to seamlessly integrate into any existing infrastructure. We track key user metrics—like interest level, contact information, and specific product requests—all while maintaining high standards of data hygiene.</p>
//         <p>Whether you need lead generation, market segmentation, or competitive analysis, our tools provide the foundational data necessary for your success. We turn potential interest into tangible engagement.</p>
//       </section>
      
//       <hr className="divider" />

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

// import React from 'react';
// import IntroSection from './components/IntroSection'; // 👈 Import the new component
// import UserForm from './components/UserForm'; 
// import './App.css'; 

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Future Dynamics Solutions</h1>
//         <p>Driving innovation and user connectivity in the digital space.</p>
//       </header>

//       {/* 👈 Use the new IntroSection component here */}
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

import React, { useEffect } from 'react'; // 👈 Import useEffect
import moengage from "@moengage/web-sdk"; // 👈 Import moengage
import IntroSection from './components/IntroSection'; 
import UserForm from './components/UserForm'; 
import './App.css'; 

function App() {
  // Use useEffect to ensure the initialization runs only once after the component mounts
  useEffect(() => {
    // ⚠️ IMPORTANT: Replace 'YOUR_MOENGAGE_APP_ID' with your actual App ID
    // If you need the cluster, add cluster: 'DC_2' as shown in your snippet.
    const moengageConfig = {
      app_id: 'DNBVW45PTD67QO7I1Q7ORLZD', 
      cluster: 'DC_01', 
      useLatest: true 
    };

    if (moengage) {
        moengage.initialize(moengageConfig);
        console.log("MoEngage SDK Initialized.");
    }
  }, []);

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