// import React, { useState } from 'react';
// import moengage from "@moengage/web-sdk";

// const UserForm = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         phoneNumber: '', 
//     });

//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [submissionError, setSubmissionError] = useState('');
//     const [validationError, setValidationError] = useState('');

//     const validateForm = (data) => {
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

//         setSubmissionError('Submitting data...'); 

//         // ⚠️ API URL targets your LOCAL EXPRESS BACKEND ⚠️
//         const apiUrl = 'http://localhost:5000/api/users'; 

//         try {
//             const response = await fetch(apiUrl, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData),
//             });

//             if (response.ok) {
//                 // SUCCESS: Data successfully sent via your Express proxy
//                 setSubmissionError(''); 
//                 setIsSubmitted(true); 
//                 setFormData({ name: '', email: '', phoneNumber: '' }); 

//             } else {
//                 // Failure due to server error (e.g., Express validation, MoEngage Auth failure)
//                 const errorData = await response.json();
//                 setSubmissionError(`Error: ${errorData.error || 'Failed to submit data.'}`);
//                 console.error('Proxy server error:', errorData);
//             }
//         } catch (error) {
//             // Network failure (backend is down)
//             setSubmissionError('Network Error: Could not connect to the backend server. Is the Express server running?');
//             console.error('Network error:', error);
//         }
//     };

//     return (
//         <div className="user-form-container">
//             {isSubmitted ? (
//                 <div className="thank-you-message">
//                     <h3>Thank You for Contacting Us!</h3>
//                     <p>We've received your information and successfully logged your interest with MoEngage.</p>
//                     <button onClick={() => setIsSubmitted(false)}>Submit Another Inquiry</button>
//                 </div>
//             ) : (
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-group"><label htmlFor="name">Full Name:</label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required/></div>
//                     <div className="form-group"><label htmlFor="email">Email Address:</label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required/></div>
//                     <div className="form-group">
//                         <label htmlFor="phoneNumber">Phone Number (Digits Only):</label>
//                         <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required placeholder="1234567890"/>
//                         {validationError && (<p className="validation-error">{validationError}</p>)}
//                     </div>
//                     <button type="submit">Get in Touch</button>
//                 </form>
//             )}

//             {/* Display error if MoEngage call failed or validation failed */}
//             {submissionError && (
//                 <p className="submission-error-message">{submissionError}</p>
//             )}
//         </div>
//     );
// };

// export default UserForm;

// import React, { useState } from 'react';

// const UserForm = () => {
//   // State to hold the form data
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phoneNumber: '', 
//   });

//   // State to track if the form has been successfully submitted
//   const [isSubmitted, setIsSubmitted] = useState(false);
  
//   // State to track the status of the API call and validation errors
//   const [submissionError, setSubmissionError] = useState('');
//   const [validationError, setValidationError] = useState('');

//   // Basic Client-Side Validation Function
//   const validateForm = (data) => {
//     // Regular expression to check for digits only
//     const phoneRegex = /^\d+$/; 
    
//     // Remove common non-digit characters (spaces, dashes, parentheses) for a cleaner validation check
//     const cleanPhoneNumber = data.phoneNumber.replace(/[\s-()]/g, '');

//     if (cleanPhoneNumber && !phoneRegex.test(cleanPhoneNumber)) {
//       setValidationError('Phone number must contain only digits (e.g., 1234567890).');
//       return false;
//     }
    
//     setValidationError(''); // Clear any previous errors
//     return true;
//   };

//   // Updates the state whenever an input field changes
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//     // Re-validate instantly if there was a previous error
//     if (validationError) {
//         validateForm({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   // Handles the form submission and API call
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmissionError(''); // Clear any previous error or status at the start

//     // Run Validation Before Submission
//     if (!validateForm(formData)) {
//       setSubmissionError('Error: Please correct the phone number format.');
//       return; 
//     }

//     // Set the temporary loading status
//     setSubmissionError('Submitting data...'); 

//     // ⚠️ IMPORTANT: Update this URL to match your backend's actual endpoint ⚠️
//     const apiUrl = 'http://localhost:5000/api/users'; 

//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         // Success: Clear status, set submitted state, and clear form
//         setSubmissionError(''); // CLEAR the 'Submitting data...' message
//         setIsSubmitted(true); 
//         setFormData({ name: '', email: '', phoneNumber: '' }); 
//       } else {
//         // Server responded with an error status (e.g., 400, 500)
//         const errorData = await response.json();
//         setSubmissionError(`Error: Failed to submit data. ${errorData.error || response.statusText}`);
//         console.error('Server error:', errorData);
//       }
//     } catch (error) {
//       // Network errors (e.g., backend server is not running)
//       setSubmissionError('Network Error: Could not connect to the server. Please check your connection.');
//       console.error('Network error:', error);
//     }
//   };

//   return (
//     <div className="user-form-container">
//       {/* Conditional rendering based on submission status */}
//       {isSubmitted ? (
//         <div className="thank-you-message">
//           <h3>Thank You for Contacting Us!</h3>
//           <p>We've received your information and will reach out to you shortly.</p>
//           {/* Button to allow submitting a new inquiry */}
//           <button onClick={() => setIsSubmitted(false)}>Submit Another Inquiry</button>
//         </div>
//       ) : (
//         // Render the form if not yet submitted
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="name">Full Name:</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="email">Email Address:</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="phoneNumber">Phone Number (Digits Only):</label>
//             <input
//               type="tel" 
//               id="phoneNumber"
//               name="phoneNumber"
//               value={formData.phoneNumber}
//               onChange={handleChange}
//               required 
//               placeholder="1234567890"
//             />
//             {validationError && (
//                 <p className="validation-error">{validationError}</p>
//             )}
//           </div>

//           <button type="submit">
//             Get in Touch
//           </button>
//         </form>
//       )}

//       {/* Display 'Submitting data...' ONLY while loading and before success/failure is confirmed */}
//       {submissionError === 'Submitting data...' && !isSubmitted && (
//           <p className="submission-info-message">
//               Submitting data...
//           </p>
//       )}

//       {/* Display API or network errors if they are not the temporary 'Submitting' message */}
//       {submissionError && submissionError !== 'Submitting data...' && (
//         <p className="submission-error-message">
//           {submissionError}
//         </p>
//       )}
//     </div>
//   );
// };

// export default UserForm;

import React, { useState } from 'react';
import moengage from "@moengage/web-sdk"; // 👈 Import moengage


const UserForm = () => {
    // ... (State and validation functions remain the same) ...

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '', 
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submissionError, setSubmissionError] = useState('');
    const [validationError, setValidationError] = useState('');

    const validateForm = (data) => {
        // ... (validation logic remains the same) ...
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
        // ... (handleChange logic remains the same) ...
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (validationError) {
            validateForm({ ...formData, [e.target.name]: e.target.value });
        }
    };


    // Handles the form submission and MoEngage call
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionError('');

        if (!validateForm(formData)) {
            setSubmissionError('Error: Please correct the phone number format.');
            return; 
        }

        // --- 🚀 NEW MOENGAGE SDK INTEGRATION LOGIC ---

        if (!moengage || typeof moengage.add_user_attribute !== 'function') {
            setSubmissionError("Error: MoEngage SDK is not initialized or available.");
            return;
        }

        try {
            // 1. Set the Unique Identifier (Email)
            // This is the core step, linking the user to their MoEngage profile
            moengage.add_email(formData.email);
            
            // 2. Set other User Attributes
            moengage.add_user_attribute('user_name', formData.name);
            moengage.add_user_attribute('user_phone', formData.phoneNumber);
            
            // 3. Optional: Track an Event (e.g., Lead Generated)
            moengage.track_event('Lead Generated', {
                'lead_source': 'Landing Page Form',
                'form_version': 1.0
            });
            
            // Success: Set submitted state and clear form
            setIsSubmitted(true); 
            setFormData({ name: '', email: '', phoneNumber: '' }); 

        } catch (error) {
            // SDK call usually doesn't throw network errors, but we catch generic issues
            console.error('Error during MoEngage SDK call:', error);
            setSubmissionError('Failed to record data with MoEngage SDK.');
        }
    };


    return (
        <div className="user-form-container">
            {/* ... (Render logic for isSubmitted and form remains the same) ... */}
            {isSubmitted ? (
                <div className="thank-you-message">
                    <h3>Thank You for Contacting Us!</h3>
                    <p>We've received your information and successfully logged your interest with MoEngage.</p>
                    <button onClick={() => setIsSubmitted(false)}>Submit Another Inquiry</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {/* ... (Form fields for Name, Email, Phone Number) ... */}
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

            {/* Display error if MoEngage call failed or validation failed */}
            {submissionError && (
                <p className="submission-error-message">
                {submissionError}
                </p>
            )}
        </div>
    );
};

export default UserForm;