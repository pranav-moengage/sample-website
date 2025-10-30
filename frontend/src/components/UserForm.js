// import React, { useState } from 'react';
// import moengage from "@moengage/web-sdk"; // 👈 Import moengage


// const UserForm = () => {
//     // ... (State and validation functions remain the same) ...

//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         phoneNumber: '', 
//     });
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [submissionError, setSubmissionError] = useState('');
//     const [validationError, setValidationError] = useState('');

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
//         // ... (handleChange logic remains the same) ...
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//         if (validationError) {
//             validateForm({ ...formData, [e.target.name]: e.target.value });
//         }
//     };


//     // Handles the form submission and MoEngage call
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setSubmissionError('');

//         if (!validateForm(formData)) {
//             setSubmissionError('Error: Please correct the phone number format.');
//             return; 
//         }

//         // --- 🚀 NEW MOENGAGE SDK INTEGRATION LOGIC ---

//         if (!moengage || typeof moengage.add_user_attribute !== 'function') {
//             setSubmissionError("Error: MoEngage SDK is not initialized or available.");
//             return;
//         }

//         try {
//             // 1. Set the Unique Identifier (Email)
//             // This is the core step, linking the user to their MoEngage profile
//             moengage.add_email(formData.email);
            
//             // 2. Set other User Attributes
//             moengage.add_user_attribute('user_name', formData.name);
//             moengage.add_user_attribute('user_phone', formData.phoneNumber);
            
//             // 3. Optional: Track an Event (e.g., Lead Generated)
//             moengage.track_event('Lead Generated', {
//                 'lead_source': 'Landing Page Form',
//                 'form_version': 1.0
//             });
            
//             // Success: Set submitted state and clear form
//             setIsSubmitted(true); 
//             setFormData({ name: '', email: '', phoneNumber: '' }); 

//         } catch (error) {
//             // SDK call usually doesn't throw network errors, but we catch generic issues
//             console.error('Error during MoEngage SDK call:', error);
//             setSubmissionError('Failed to record data with MoEngage SDK.');
//         }
//     };


//     return (
//         <div className="user-form-container">
//             {/* ... (Render logic for isSubmitted and form remains the same) ... */}
//             {isSubmitted ? (
//                 <div className="thank-you-message">
//                     <h3>Thank You for Contacting Us!</h3>
//                     <p>We've received your information and successfully logged your interest with MoEngage.</p>
//                     <button onClick={() => setIsSubmitted(false)}>Submit Another Inquiry</button>
//                 </div>
//             ) : (
//                 <form onSubmit={handleSubmit}>
//                     {/* ... (Form fields for Name, Email, Phone Number) ... */}
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

//             {/* Display error if MoEngage call failed or validation failed */}
//             {submissionError && (
//                 <p className="submission-error-message">
//                 {submissionError}
//                 </p>
//             )}
//         </div>
//     );
// };

// export default UserForm;

// frontend/src/components/UserForm.js

import React, { useState } from 'react';
// ❌ MoEngage SDK is no longer imported here as tracking is moved to the backend.

const UserForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '', 
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submissionError, setSubmissionError] = useState('');
    const [validationError, setValidationError] = useState('');

    const validateForm = (data) => {
        // Simple phone number validation
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


    // Handles the form submission and sends data to YOUR backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionError('');

        if (!validateForm(formData)) {
            setSubmissionError('Error: Please correct the phone number format.');
            return; 
        }

        // --- SECURE BACKEND API CALL LOGIC ---
        
        try {
            // We use the full proxy path here, but since the React app is served
            // from the same host in production, '/api/track-lead' often works.
            // During development, ensure CORS is set up (as done in server.js).
            const response = await fetch('/.netlify/functions/track-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData), 
            });

            if (response.ok) {
                // Success: Set submitted state and clear form
                setIsSubmitted(true); 
                setFormData({ name: '', email: '', phoneNumber: '' }); 

            } else {
                // Handle API error from your Express backend
                const errorData = await response.json();
                console.error('Backend API Error:', errorData);
                setSubmissionError(errorData.error || 'Submission failed. Please try again.');
            }

        } catch (error) {
            // Catch network errors (e.g., backend server is down)
            console.error('Error during backend API call:', error);
            setSubmissionError('Failed to connect to the server. Please ensure the backend is running.');
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
                    {/* Form fields */}
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

            {/* Display error */}
            {submissionError && (
                <p className="submission-error-message">
                {submissionError}
                </p>
            )}
        </div>
    );
};

export default UserForm;