import React, { useState } from 'react';

const DafForm = () => {
  const [newDaf, setNewDaf] = useState(null); // State to store the created DAF details

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch('http://localhost:5454/daf/create-daf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setNewDaf(data); 
      } else {
        const errorData = await response.json();
        console.error('Error creating DAF:', errorData);
        alert(`Error: ${errorData.message || 'Failed to create DAF'}`);
      }
    } catch (error) {
      console.error('Error creating DAF:', error);
      alert('An error occurred while creating the DAF. Please try again.');
    }
  };

  const renderDAFForm = () => {
    if (newDaf) return null; // Hide the form if a DAF has been created

    const formStyle = {
      maxWidth: "600px",
      margin: "0 auto",
      padding: "40px 20px",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    };

    const fieldGroupStyle = {
      marginBottom: "24px",
    };

    const labelStyle = {
      display: "block",
      marginBottom: "8px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#555",
    };

    const inputStyle = {
      width: "100%",
      padding: "12px",
      fontSize: "16px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      backgroundColor: "#fff",
      boxSizing: "border-box",
      transition: "border-color 0.2s ease",
    };

    const buttonStyle = {
      backgroundColor: "#000",
      color: "#fff",
      border: "none",
      padding: "14px 24px",
      borderRadius: "4px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
      fontWeight: "500",
      marginTop: "8px",
    };

    return (
      <form id="create-daf-form" onSubmit={handleSubmit} style={formStyle}>
        <div style={fieldGroupStyle}>
          <label htmlFor="name" style={labelStyle}>
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldGroupStyle}>
          <label htmlFor="description" style={labelStyle}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
          />
        </div>

        <div style={fieldGroupStyle}>
          <label htmlFor="fundAdvisor.firstName" style={labelStyle}>
            Advisor First Name
          </label>
          <input
            type="text"
            id="fundAdvisor.firstName"
            name="fundAdvisor.firstName"
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldGroupStyle}>
          <label htmlFor="fundAdvisor.lastName" style={labelStyle}>
            Advisor Last Name
          </label>
          <input
            type="text"
            id="fundAdvisor.lastName"
            name="fundAdvisor.lastName"
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldGroupStyle}>
          <label htmlFor="fundAdvisor.email" style={labelStyle}>
            Advisor Email
          </label>
          <input
            type="email"
            id="fundAdvisor.email"
            name="fundAdvisor.email"
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldGroupStyle}>
          <label htmlFor="fundAdvisor.address.line1" style={labelStyle}>
            Address Line 1
          </label>
          <input
            type="text"
            id="fundAdvisor.address.line1"
            name="fundAdvisor.address.line1"
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldGroupStyle}>
          <label htmlFor="fundAdvisor.address.line2" style={labelStyle}>
            Address Line 2 (Optional)
          </label>
          <input
            type="text"
            id="fundAdvisor.address.line2"
            name="fundAdvisor.address.line2"
            style={inputStyle}
          />
        </div>

        <div style={fieldGroupStyle}>
          <label htmlFor="fundAdvisor.address.city" style={labelStyle}>
            City
          </label>
          <input
            type="text"
            id="fundAdvisor.address.city"
            name="fundAdvisor.address.city"
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldGroupStyle}>
          <label htmlFor="fundAdvisor.address.state" style={labelStyle}>
            State
          </label>
          <input
            type="text"
            id="fundAdvisor.address.state"
            name="fundAdvisor.address.state"
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldGroupStyle}>
          <label htmlFor="fundAdvisor.address.zip" style={labelStyle}>
            ZIP Code
          </label>
          <input
            type="text"
            id="fundAdvisor.address.zip"
            name="fundAdvisor.address.zip"
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldGroupStyle}>
          <label htmlFor="fundAdvisor.address.country" style={labelStyle}>
            Country
          </label>
          <input
            type="text"
            id="fundAdvisor.address.country"
            name="fundAdvisor.address.country"
            required
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          style={buttonStyle}
        >
          Create DAF
        </button>
      </form>
    );
  };

  const renderSuccessMessage = () => {
    if (!newDaf) return null; 
    return (
      <main>
        <h1>DAF Created!</h1>
        <p>Name: <span id="fund-name">{newDaf.name}</span></p>
        <p>Description: <span id="fund-description">{newDaf.description}</span></p>
        <p>
          Advisor:
          <span id="fund-advisor">
            {newDaf.advisor.firstName + ' ' + newDaf.advisor.lastName}
          </span>
        </p>
        <p>Balance: <span id="fund-balance">{newDaf.usdcBalance}</span></p>
      </main>
    );
  };

  return (
    <div>
      {renderDAFForm()}
      {renderSuccessMessage()}
    </div>
  );
};

export default DafForm;