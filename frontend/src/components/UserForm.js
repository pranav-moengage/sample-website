// import React, { useState } from 'react';

// const UserForm = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         phoneNumber: '', 
//     });
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [submissionError, setSubmissionError] = useState('');
//     const [validationError, setValidationError] = useState('');

//     // --- CRITICAL UPDATE ---
//     // ⚠️ Replace this placeholder with the actual URL of your deployed Render Web Service
//     const BACKEND_URL = "https://sample-website-backend.onrender.com"; 
//     // If testing locally (both frontend and backend running):
//     // const BACKEND_URL = "http://localhost:5000"; 
    
//     // ... (Validation and handleChange logic remains the same) ...
//     const validateForm = (data) => {
//         // ... (validation logic remains the same) ...
//         const phoneRegex = /^\d+$/; 
//         const cleanPhoneNumber = data.phoneNumber.replace(/[\s-()]/g, '');

//         if (cleanPhoneNumber && !phoneRegex.test(cleanPhoneNumber)) {
//             setValidationError('Phone number must contain only digits (e.g., 1234567890).');
//             return false;
//         }
        
//         setValidationError('');
//         return true;
//     };

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//         if (validationError) {
//             validateForm({ ...formData, [e.target.name]: e.target.value });
//         }
//     };


//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setSubmissionError('');

//         if (!validateForm(formData)) {
//             setSubmissionError('Error: Please correct the phone number format.');
//             return; 
//         }
        
//         try {
//             // Fetch targets the deployed Express server
//             const response = await fetch(`${BACKEND_URL}/api/track-lead`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(formData), 
//             });

//             if (response.ok) {
//                 // Success: Set submitted state and clear form
//                 setIsSubmitted(true); 
//                 setFormData({ name: '', email: '', phoneNumber: '' }); 

//             } else {
//                 // Handle API error from your Express backend
//                 const errorData = await response.json();
//                 console.error('Backend API Error:', errorData);
//                 setSubmissionError(errorData.error || 'Submission failed. Please try again.');
//             }

//         } catch (error) {
//             // Catch network errors (e.g., backend server is down or wrong URL)
//             console.error('Error during backend API call:', error);
//             setSubmissionError('Failed to connect to the server. Please check your network and API URL.');
//         }
//     };


//     return (
//         <div className="user-form-container">
//             {/* ... (Render logic for isSubmitted and form remains the same) ... */}
//             {isSubmitted ? (
//                 <div className="thank-you-message">
//                     <h3>Thank You for Contacting Us!</h3>
//                     <p>We've received your information and successfully tracked your lead.</p>
//                     <button onClick={() => setIsSubmitted(false)}>Submit Another Inquiry</button>
//                 </div>
//             ) : (
//                 <form onSubmit={handleSubmit}>
//                     {/* ... (Form fields remain the same) ... */}
//                     <div className="form-group">
//                         <label htmlFor="name">Full Name:</label>
//                         <input
//                             type="text"
//                             id="name"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="email">Email Address:</label>
//                         <input
//                             type="email"
//                             id="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="phoneNumber">Phone Number (Digits Only):</label>
//                         <input
//                             type="tel" 
//                             id="phoneNumber"
//                             name="phoneNumber"
//                             value={formData.phoneNumber}
//                             onChange={handleChange}
//                             required 
//                             placeholder="1234567890"
//                         />
//                         {validationError && (
//                             <p className="validation-error">{validationError}</p>
//                         )}
//                     </div>

//                     <button type="submit">
//                         Get in Touch
//                     </button>
//                 </form>
//             )}

//             {/* Display error */}
//             {submissionError && (
//                 <p className="submission-error-message">
//                 {submissionError}
//                 </p>
//             )}
//         </div>
//     );
// };

// export default UserForm;

import React, { useState } from 'react';

const UserForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '', 
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submissionError, setSubmissionError] = useState('');
    const [validationError, setValidationError] = useState('');

    // --- CRITICAL UPDATE ---
    const BACKEND_URL = "https://sample-website-backend.onrender.com"; 
    
    // Helper function to capture time data in Epoch seconds
    const getTimeAttributes = () => {
        const now = new Date();
        
        // Epoch seconds are required for MoEngage
        const epochSeconds = Math.floor(now.getTime() / 1000);
        
        // Calculate Timezone Offset in Seconds
        // getTimezoneOffset returns offset in minutes (local time to UTC).
        // It's positive for time zones West of UTC, and negative for East.
        // MoEngage requires the sign flipped (e.g., IST is +5.5 hours, or 19800 seconds)
        const offsetMinutes = now.getTimezoneOffset();
        const offsetSeconds = offsetMinutes * -60;

        return {
            user_time: epochSeconds,         // Local time in Epoch seconds (used for user_time)
            current_time: epochSeconds,      // Epoch in seconds (used for current_time)
            user_timezone_offset: offsetSeconds // Offset in seconds
        };
    };

    const validateForm = (data) => {
        const phoneRegex = /^\d+$/; 
        const cleanPhoneNumber = data.phoneNumber.replace(/[\s-()]/g, '');

        if (cleanPhoneNumber && !phoneRegex.test(cleanPhoneNumber)) {
            setValidationError('Phone number must contain only digits (e.g., 1234567890).');
            return false;
        }
        
        setValidationError('');
        return true;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (validationError) {
            validateForm({ ...formData, [e.target.name]: e.target.value });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionError('');

        if (!validateForm(formData)) {
            setSubmissionError('Error: Please correct the phone number format.');
            return; 
        }

        // 🚨 NEW: Capture Time Attributes and combine payload
        const timeAttributes = getTimeAttributes();
        
        const payloadToBackend = {
            ...formData,
            ...timeAttributes // Includes user_time, current_time, user_timezone_offset
        };
        
        try {
            // Fetch targets the deployed Express server
            const response = await fetch(`${BACKEND_URL}/api/track-lead`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payloadToBackend), // Send the combined payload
            });

            if (response.ok) {
                setIsSubmitted(true); 
                setFormData({ name: '', email: '', phoneNumber: '' }); 
            } else {
                const errorData = await response.json();
                console.error('Backend API Error:', errorData);
                setSubmissionError(errorData.error || 'Submission failed. Please try again.');
            }

        } catch (error) {
            console.error('Error during backend API call:', error);
            setSubmissionError('Failed to connect to the server. Please check your network and API URL.');
        }
    };


    return (
        <div className="user-form-container">
            {isSubmitted ? (
                <div className="thank-you-message">
                    <h3>Thank You for Contacting Us!</h3>
                    <p>We've received your information and successfully tracked your lead.</p>
                    <button onClick={() => setIsSubmitted(false)}>Submit Another Inquiry</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number (Digits Only):</label>
                        <input
                            type="tel" 
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required 
                            placeholder="1234567890"
                        />
                        {validationError && (
                            <p className="validation-error">{validationError}</p>
                        )}
                    </div>

                    <button type="submit">
                        Get in Touch
                    </button>
                </form>
            )}

            {submissionError && (
                <p className="submission-error-message">
                {submissionError}
                </p>
            )}
        </div>
    );
};

export default UserForm;