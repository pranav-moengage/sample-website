// import React from 'react';

// const IntroSection = () => {
//     const imageUrl = "https://placehold.co/1200x400/007bff/ffffff?text=Strategy+and+Execution";

//     return (
//         <>
//             <section className="info-section who-we-are">
//                 <h2>Who We Are</h2>
//                 <p>We are a dedicated team focused on bridging the gap between complex data and actionable insights. Our mission is to build robust, scalable platforms that empower businesses to understand their users better and make data-driven decisions.</p>
//                 <p>Our commitment extends beyond code; we prioritize user privacy and ensure every interaction is secure, transparent, and valuable.</p>
//             </section>

//             <div className="filler-image-container">
//                 <img 
//                     src={imageUrl} 
//                     alt="Abstract graphic representing strategy and execution"
//                     className="filler-image"
//                     onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/1200x400/333/fff?text=Digital+Landscape" }} 
//                 />
//             </div>

//             <section className="info-section what-we-do">
//                 <h2>What We Do</h2>
//                 <p>Our core offering is a state-of-the-art data tracking module designed to seamlessly integrate into any existing infrastructure. We track key user metrics—like interest level, contact information, and specific product requests—all while maintaining high standards of data hygiene.</p>
//                 <p>We turn potential interest into tangible engagement.</p>
//             </section>
            
//             <hr className="divider" />
//         </>
//     );
// };

// export default IntroSection;

import React from 'react';

const IntroSection = () => {
    // Placeholder image URL
    const imageUrl = "https://placehold.co/1200x400/007bff/ffffff?text=Strategy+and+Execution";

    return (
        <>
            {/* SECTION 1: Who We Are */}
            <section className="info-section who-we-are">
                <h2>Who We Are</h2>
                <p>We are a dedicated team of digital architects focused on bridging the gap between complex data and actionable insights. Our mission is to build robust, scalable platforms that empower businesses to understand their users better and make data-driven decisions. We believe in simplicity, efficiency, and real-time responsiveness.</p>
                <p>Our commitment extends beyond code; we prioritize user privacy and ensure every interaction is secure, transparent, and valuable.</p>
            </section>

            {/* FILLER IMAGE */}
            <div className="filler-image-container">
                <img 
                    src={imageUrl} 
                    alt="Abstract graphic representing strategy and execution"
                    className="filler-image"
                    // Fallback image in case the placeholder service is down
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/1200x400/333/fff?text=Digital+Landscape" }} 
                />
            </div>

            {/* SECTION 2: What We Do */}
            <section className="info-section what-we-do">
                <h2>What We Do</h2>
                <p>Our core offering is a state-of-the-art data tracking module designed to seamlessly integrate into any existing infrastructure. We track key user metrics—like interest level, contact information, and specific product requests—all while maintaining high standards of data hygiene.</p>
                <p>Whether you need lead generation, market segmentation, or competitive analysis, our tools provide the foundational data necessary for your success. We turn potential interest into tangible engagement.</p>
            </section>
            
            <hr className="divider" />
        </>
    );
};

export default IntroSection;