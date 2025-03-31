"use client"

import { useState, useEffect } from "react"

const DafList = () => {
  const [dafs, setDafs] = useState([])
  const [dafID, setDafsID] = useState(null)
  const [error, setError] = useState(null)
  const [wireInstructions, setWireInstructions] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [donationSuccess, setDonationSuccess] = useState(false) 
  const [donationPledgeId, setDonationPledgeId] = useState(null)  

  const containerStyle = {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: "#333",
  }

  const headingStyle = {
    fontSize: "28px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "32px",
    letterSpacing: "-0.5px",
  }

  const subheadingStyle = {
    fontSize: "22px",
    fontWeight: "500",
    color: "#333",
    marginTop: "32px",
    marginBottom: "16px",
    letterSpacing: "-0.3px",
  }

  const smallHeadingStyle = {
    fontSize: "18px",
    fontWeight: "500",
    color: "#333",
    marginTop: "24px",
    marginBottom: "12px",
  }

  const dafListStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "24px",
    marginBottom: "40px",
  }

  const dafCardStyle = {
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid #eee",
    backgroundColor: "#fff",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  }

  const dafNameStyle = {
    fontSize: "18px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "8px",
  }

  const dafDescriptionStyle = {
    fontSize: "14px",
    color: "#666",
    marginBottom: "16px",
    lineHeight: "1.5",
  }

  const buttonStyle = {
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    fontWeight: "500",
  }

  const sectionStyle = {
    marginTop: "32px",
    marginBottom: "32px",
    padding: "24px",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  }

  const formGroupStyle = {
    marginBottom: "20px",
  }

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#555",
  }

  const inputStyle = {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
    marginBottom: "16px",
  }

  const textStyle = {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.5",
    marginBottom: "12px",
  }

  const infoRowStyle = {
    display: "flex",
    marginBottom: "8px",
  }

  const infoLabelStyle = {
    fontWeight: "600",
    marginRight: "8px",
    minWidth: "140px",
  }

  const errorStyle = {
    color: "#e53e3e",
    padding: "12px",
    backgroundColor: "#fff5f5",
    borderRadius: "4px",
    marginBottom: "24px",
    fontSize: "14px",
  }

  const loadingStyle = {
    textAlign: "center",
    padding: "40px 0",
    color: "#666",
    fontSize: "16px",
  }

  useEffect(() => {
    const fetchDafs = async () => {
      setIsLoading(true)
      try {
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
          setError("No access token found")
          setIsLoading(false)
          return
        }

        const response = await fetch("http://localhost:5454/daf/get-dafs", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch DAFs")
        }

        const data = await response.json()
        setDafs(data)
        setDafsID(data[0]?.id)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching DAFs:", err)
        setError(err.message)
        setIsLoading(false)
      }
    }

    fetchDafs()
  }, [])

  const renderWireInstructions = () => {
    if (!wireInstructions) return null

    const { beneficiary, receivingBank } = wireInstructions
    return (
      <div style={sectionStyle}>
        <h2 style={subheadingStyle}>Wire Instructions</h2>

        <h3 style={smallHeadingStyle}>Beneficiary</h3>
        <div style={{ marginBottom: "16px" }}>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Name:</span>
            <span>{beneficiary.name}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Account Number:</span>
            <span>{beneficiary.accountNumber}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Address:</span>
            <span>{beneficiary.address}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Type of Account:</span>
            <span>{beneficiary.typeOfAccount}</span>
          </div>
        </div>

        <h3 style={smallHeadingStyle}>Receiving Bank</h3>
        <div>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Name:</span>
            <span>{receivingBank.name}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>ABA Routing Number:</span>
            <span>{receivingBank.abaRoutingNumber}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Address:</span>
            <span>{receivingBank.address}</span>
          </div>
        </div>
      </div>
    )
  }

  const renderSuccessMessage = () => {
    const successContainerStyle = {
      backgroundColor: "#f7f7f7",
      border: "1px solid #e0e0e0",
      borderLeft: "4px solid #4caf50", // Green accent for success
      borderRadius: "4px",
      padding: "24px",
      maxWidth: "500px",
      margin: "32px auto",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }
  
    const headingStyle = {
      fontSize: "24px",
      fontWeight: "600",
      color: "#333",
      marginTop: "0",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
    }
  
    const messageStyle = {
      fontSize: "16px",
      lineHeight: "1.5",
      color: "#555",
      marginBottom: "8px",
    }
  
    const idStyle = {
      fontSize: "14px",
      color: "#666",
      fontFamily: "monospace",
      backgroundColor: "#fff",
      padding: "8px 12px",
      borderRadius: "4px",
      border: "1px solid #eee",
      marginTop: "16px",
    }
  
    // Success icon (checkmark) using inline SVG
    const checkmarkIcon = (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4caf50"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginRight: "12px" }}
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    )
    if (!donationSuccess) return null

    return (
      <div style={successContainerStyle}>
      <h1 style={headingStyle}>
        {checkmarkIcon}
        Donation Successful!
      </h1>
      <p style={messageStyle}>Your donation has been successfully processed</p>
      <div style={idStyle}>
        <strong>Donation ID:</strong> {donationPledgeId}
      </div>
    </div>
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      setError("No access token found")
      return
    }
    const formData = new FormData(event.target)

    try {
      const response = await fetch("http://localhost:5454/daf/wire-donation", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      })
      const responseData = await response.json()
      console.log("Response:", responseData)
      setDonationSuccess(true)
      setDonationPledgeId(responseData.id)
    } catch (error) {
      console.error("Error creating WIRE:", error)
      setError("Failed to process donation. Please try again.")
    }
  }

  const renderDonationForm = () => {
    if (!dafID || !wireInstructions) return null

    return (
      <div style={sectionStyle}>
        <h2 style={subheadingStyle}>Donations</h2>
        <p style={textStyle}>Please wire your donation to the following account</p>

        <div
          style={{
            padding: "16px",
            backgroundColor: "#fff",
            borderRadius: "4px",
            marginBottom: "24px",
            border: "1px solid #eee",
          }}
        >
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Bank:</span>
            <span>{wireInstructions.receivingBank.name}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Routing Number:</span>
            <span>{wireInstructions.receivingBank.abaRoutingNumber}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Amount</label>
            <input
              type="number"
              name="amount"
              style={inputStyle}
              min="1"
              required
              onFocus={(e) => (e.target.style.borderColor = "#000")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
            />
            <input type="hidden" name="fundId" value={dafID} />
          </div>

          <button
            style={buttonStyle}
            type="submit"
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#333")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#000")}
          >
            Donate
          </button>
        </form>
      </div>
    )
  }

  const handleSelected = async (id) => {
    console.log("Selected DAF ID:", id)
    setDafsID(id)
    try {
      const response = await fetch("http://localhost:5454/daf/get-wire-instructions")

      if (!response.ok) {
        throw new Error("Failed to fetch wire instructions")
      }
      const data = await response.json()
      setWireInstructions(data)
      console.log("Wire Instructions:", data)
    } catch (err) {
      console.error("Error fetching wire instructions:", err)
      setError(err.message)
    }
  }

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Select a DAF to donate to</h1>

      {error && <div style={errorStyle}>{error}</div>}

      {isLoading ? (
        <div style={loadingStyle}>Loading DAFs...</div>
      ) : (
        <div style={dafListStyle}>
          {dafs.map((daf) => (
            <div
              key={daf.id}
              style={{
                ...dafCardStyle,
                boxShadow: dafID === daf.id ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                transform: dafID === daf.id ? "translateY(-4px)" : "none",
                borderColor: dafID === daf.id ? "#000" : "#eee",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseOut={(e) => {
                if (dafID !== daf.id) {
                  e.currentTarget.style.boxShadow = "none"
                  e.currentTarget.style.transform = "none"
                } else {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"
                  e.currentTarget.style.transform = "translateY(-4px)"
                }
              }}
            >
              <p style={dafNameStyle}>{daf.name}</p>
              <p style={dafDescriptionStyle}>{daf.description}</p>
              <button
                onClick={() => handleSelected(daf.id)}
                style={{
                  ...buttonStyle,
                  backgroundColor: dafID === daf.id ? "#333" : "#000",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#333")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = dafID === daf.id ? "#333" : "#000")}
              >
                {dafID === daf.id ? "Selected" : "Donate"}
              </button>
            </div>
          ))}
        </div>
      )}

      {renderWireInstructions()}
      {renderDonationForm()}
      {renderSuccessMessage()}
    </div>
  )
}

export default DafList