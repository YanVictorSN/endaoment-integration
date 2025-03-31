import React, { useState, useEffect } from 'react';
import DafList from './components/DafList';
import DafForm  from './components/DafForm';
import GrantWorkflow from './components/SearchForOrg';
function Login() {
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null); 

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5454/auth/init-login');
      const data = await response.json();
      setRedirectUrl(data.url);
      window.location.href = data.url;
    } catch (error) {
      console.error('Error initiating login:', error);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get('access_token');
    const refreshToken = queryParams.get('refresh_token');
    console.log('Access Token:', accessToken);
    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setIsAuthenticated(true);
      setAccessToken(accessToken);
    }
  }, []);

  return (
    <div
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        maxWidth: "400px",
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      {!isAuthenticated && (
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "500",
            color: "#333",
            marginBottom: "24px",
            letterSpacing: "-0.5px",
          }}
        >
          Login
        </h1>
      )}

      {!isAuthenticated && (
        <button
          onClick={handleLogin}
          style={{
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
            fontWeight: "500",
            width: "100%",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#333")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#000")}
        >
          Login with Endaoment
        </button>
      )}
      {isAuthenticated && (
        <>
          <button
            onClick={() => setActiveComponent('GrantWorkflow')}
            style={{
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              fontWeight: '500',
              width: '100%',
              marginBottom: '20px',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#333')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#000')}
          >
            Grant an Organizations
          </button>
          <button
            onClick={() => setActiveComponent('DafForm')}
            style={{
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              fontWeight: '500',
              width: '100%',
              marginBottom: '20px',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#333')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#000')}
          >
            Create a new DAF
          </button>
          <button
            onClick={() => setActiveComponent('DafList')}
            style={{
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              fontWeight: '500',
              width: '100%',
              marginBottom: '20px',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#333')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#000')}
          >
            My DAFs
          </button>

          {activeComponent === 'GrantWorkflow' && <GrantWorkflow />}
          {activeComponent === 'DafForm' && <DafForm />}
          {activeComponent === 'DafList' && <DafList />}
        </>
      )}
    </div>
  );
}

export default Login;