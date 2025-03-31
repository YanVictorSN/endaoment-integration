"use client"

import { useState, useEffect } from "react"

const OrgSelect = ({ searchResults, onSelectOrg }) => {
  // Common styles
  const orgListStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
    marginTop: "32px",
  }

  const orgCardStyle = {
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid #eee",
    backgroundColor: "#fff",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  }

  const orgNameStyle = {
    fontSize: "18px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "8px",
  }

  const orgDescriptionStyle = {
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

  return (
    <div style={orgListStyle}>
      {searchResults.map((org) => (
        <div
          key={org.id}
          style={orgCardStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"
            e.currentTarget.style.transform = "translateY(-2px)"
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = "none"
            e.currentTarget.style.transform = "none"
          }}
        >
          <h3 style={orgNameStyle}>{org.name}</h3>
          <p style={orgDescriptionStyle}>{org.description}</p>
          <button
            onClick={() => onSelectOrg(org)}
            style={buttonStyle}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#333")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#000")}
          >
            Select
          </button>
        </div>
      ))}
    </div>
  )
}

const GrantForm = ({ org, daf }) => {
  const [amount, setAmount] = useState("")
  const [purpose, setPurpose] = useState("")
  const [grantDetails, setGrantDetails] = useState(null)
  const [error, setError] = useState(null)

  // Common styles
  const formContainerStyle = {
    maxWidth: "600px",
    margin: "32px auto",
    padding: "32px",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #eee",
  }

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  }

  const headingStyle = {
    fontSize: "24px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "24px",
    letterSpacing: "-0.3px",
  }

  const formGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  }

  const labelStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#555",
  }

  const inputStyle = {
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#fff",
    transition: "border-color 0.2s ease",
  }

  const buttonStyle = {
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    padding: "14px",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    fontWeight: "500",
    marginTop: "8px",
  }

  const errorStyle = {
    color: "#e53e3e",
    padding: "12px",
    backgroundColor: "#fff5f5",
    borderRadius: "4px",
    fontSize: "14px",
    marginTop: "16px",
  }

  const successContainerStyle = {
    backgroundColor: "#f7f7f7",
    border: "1px solid #e0e0e0",
    borderLeft: "4px solid #4caf50",
    borderRadius: "4px",
    padding: "24px",
    maxWidth: "600px",
    margin: "32px auto",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  }

  const successHeadingStyle = {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    marginTop: "0",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
  }

  const detailRowStyle = {
    display: "flex",
    marginBottom: "12px",
    fontSize: "14px",
    color: "#555",
  }

  const detailLabelStyle = {
    fontWeight: "600",
    minWidth: "150px",
  }

  const handleGrant = (e) => {
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      setError("No access token found")
      return
    }
    e.preventDefault()

    fetch("http://localhost:5454/daf/grant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        amount,
        fundId: daf.id,
        orgId: org.id,
        purpose,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setGrantDetails(data)
      })
      .catch((error) => {
        console.error("Error:", error)
        setError("Failed to submit the grant")
      })
  }

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

  return (
    <div>
      {!grantDetails ? (
        <div style={formContainerStyle}>
          <form style={formStyle} onSubmit={handleGrant}>
            <h1 style={headingStyle}>Grant to {org.name}</h1>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Amount:</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#000")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                required
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Purpose:</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#000")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                required
              />
            </div>

            <button
              type="submit"
              style={buttonStyle}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#333")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#000")}
            >
              Grant
            </button>

            {error && <p style={errorStyle}>{error}</p>}
          </form>
        </div>
      ) : (
        <div style={successContainerStyle}>
          <h2 style={successHeadingStyle}>
            {checkmarkIcon}
            Grant Successful!
          </h2>

          <div style={detailRowStyle}>
            <span style={detailLabelStyle}>Status:</span>
            <span>{grantDetails.status}</span>
          </div>

          <div style={detailRowStyle}>
            <span style={detailLabelStyle}>Async Status:</span>
            <span>{grantDetails.asyncStatus}</span>
          </div>

          <div style={detailRowStyle}>
            <span style={detailLabelStyle}>Requested Amount:</span>
            <span>${grantDetails.requestedAmount}</span>
          </div>

          <div style={detailRowStyle}>
            <span style={detailLabelStyle}>Purpose:</span>
            <span>{grantDetails.purpose}</span>
          </div>

          <div style={detailRowStyle}>
            <span style={detailLabelStyle}>Organization:</span>
            <span>{org.name}</span>
          </div>

          <div style={detailRowStyle}>
            <span style={detailLabelStyle}>Created At:</span>
            <span>{new Date(grantDetails.createdAtUtc).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [selectedDaf, setSelectedDaf] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  }

  const headingStyle = {
    fontSize: "28px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "24px",
    letterSpacing: "-0.5px",
  }

  const searchContainerStyle = {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    maxWidth: "600px",
  }

  const searchInputStyle = {
    flex: "1",
    padding: "12px 16px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#fff",
    transition: "border-color 0.2s ease",
  }

  const buttonStyle = {
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    padding: "0 20px",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    fontWeight: "500",
  }

  const loadingStyle = {
    textAlign: "center",
    padding: "40px 0",
    color: "#666",
    fontSize: "16px",
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setIsSearching(true)
    const searchUrl = `https://api.dev.endaoment.org/v2/orgs/search?searchTerm=${encodeURIComponent(searchTerm)}`

    try {
      const response = await fetch(searchUrl)
      const data = await response.json()
      const validResults = data.filter((org) => org.id !== null && org.id !== undefined)
      setSearchResults(validResults)
    } catch (error) {
      console.error("Error searching for organizations:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectOrg = (org) => {
    setSelectedOrg(org)
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    })
  }

  const handleSelectDaf = (daf) => {
    setSelectedDaf(daf)
  }

  return (
    <div style={containerStyle}>
      {!selectedDaf && <DafList onSelectDaf={handleSelectDaf} />}

      {selectedDaf && (
        <>
          <h1 style={headingStyle}>Select an Organization to Grant</h1>

          <div style={searchContainerStyle}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
              placeholder="Search for organizations..."
              onFocus={(e) => (e.target.style.borderColor = "#000")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              style={buttonStyle}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#333")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#000")}
            >
              Search
            </button>
          </div>

          {isSearching && <div style={loadingStyle}>Searching for organizations...</div>}

          {searchResults.length > 0 && <OrgSelect searchResults={searchResults} onSelectOrg={handleSelectOrg} />}

          {searchResults.length === 0 && searchTerm && !isSearching && (
            <p style={{ color: "#666", textAlign: "center", padding: "20px" }}>
              No organizations found matching "{searchTerm}". Try a different search term.
            </p>
          )}

          {selectedOrg && <GrantForm org={selectedOrg} daf={selectedDaf} />}
        </>
      )}
    </div>
  )
}

const DafList = ({ onSelectDaf }) => {
  const [dafs, setDafs] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDafId, setSelectedDafId] = useState(null)

  // Common styles
  const containerStyle = {
    maxWidth: "800px",
    margin: "0 auto",
  }

  const headingStyle = {
    fontSize: "28px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "32px",
    letterSpacing: "-0.5px",
    textAlign: "center",
  }

  const dafListStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "24px",
    marginBottom: "40px",
  }

  const dafButtonStyle = {
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid #eee",
    backgroundColor: "#fff",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "500",
    color: "#333",
  }

  const loadingStyle = {
    textAlign: "center",
    padding: "40px 0",
    color: "#666",
    fontSize: "16px",
  }

  const errorStyle = {
    color: "#e53e3e",
    padding: "16px",
    backgroundColor: "#fff5f5",
    borderRadius: "4px",
    textAlign: "center",
    maxWidth: "500px",
    margin: "32px auto",
    fontSize: "14px",
  }

  useEffect(() => {
    const fetchDafs = async () => {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        setError("No access token found")
        setIsLoading(false)
        return
      }

      try {
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
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDafs()
  }, [])

  const handleDafSelect = (daf) => {
    setSelectedDafId(daf.id)
    onSelectDaf(daf)
  }

  if (isLoading) {
    return <div style={loadingStyle}>Loading DAFs...</div>
  }

  if (error) {
    return <div style={errorStyle}>Error: {error}</div>
  }

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Select a DAF to Grant From</h1>
      <div style={dafListStyle}>
        {dafs.map((daf) => (
          <button
            key={daf.id}
            onClick={() => handleDafSelect(daf)}
            style={{
              ...dafButtonStyle,
              boxShadow: selectedDafId === daf.id ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
              transform: selectedDafId === daf.id ? "translateY(-4px)" : "none",
              borderColor: selectedDafId === daf.id ? "#000" : "#eee",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"
              e.currentTarget.style.transform = "translateY(-2px)"
            }}
            onMouseOut={(e) => {
              if (selectedDafId !== daf.id) {
                e.currentTarget.style.boxShadow = "none"
                e.currentTarget.style.transform = "none"
              } else {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"
                e.currentTarget.style.transform = "translateY(-4px)"
              }
            }}
          >
            {daf.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Search