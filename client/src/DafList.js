import React, { useState, useEffect } from 'react';

const DafList = () => {
  const [dafs, setDafs] = useState([]);
  const [dafID, setDafID] = useState(null);
  const [error, setError] = useState(null);
  const [wireInstructions, setWireInstructions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDafs = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setError('No access token found');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5454/daf/get-dafs', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch DAFs');
        }

        const data = await response.json();
        setDafs(data);
        if (data.length > 0) {
          setDafID(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching DAFs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDafs();
  }, []);

  const fetchWireInstructions = async (id) => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('No access token found');
        return;
      }

      const response = await fetch(`http://localhost:5454/daf/wire-instructions/${id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wire instructions');
      }

      const data = await response.json();
      setWireInstructions(data);
    } catch (err) {
      console.error('Error fetching wire instructions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDaf = (id) => {
    setDafID(id);
    setWireInstructions(null);
  };

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    card: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '16px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '16px',
      marginBottom: '16px',
    },
    dafCard: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    selectedDafCard: {
      border: '1px solid #3b82f6',
      backgroundColor: '#f0f7ff',
    },
    dafName: {
      fontSize: '18px',
      fontWeight: '500',
      marginBottom: '8px',
    },
    dafInfo: {
      color: '#666',
      fontSize: '14px',
      marginBottom: '4px',
    },
    button: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '8px 16px',
      fontSize: '16px',
      cursor: 'pointer',
      display: 'block',
      margin: '0 auto',
    },
    disabledButton: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    wireCard: {
      backgroundColor: '#f9f9f9',
      marginTop: '16px',
    },
    errorAlert: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      padding: '12px',
      borderRadius: '4px',
      marginBottom: '16px',
    },
    loader: {
      display: 'flex',
      justifyContent: 'center',
      padding: '32px',
    },
    emptyMessage: {
      textAlign: 'center',
      padding: '16px',
      color: '#666',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Your DAF Accounts</h2>
        
        {loading && !wireInstructions && (
          <div style={styles.loader}>
            <p>Loading...</p>
          </div>
        )}
        
        {error && (
          <div style={styles.errorAlert}>
            <p>{error}</p>
          </div>
        )}
        
        {!loading && dafs.length === 0 && !error && (
          <p style={styles.emptyMessage}>No DAF accounts found.</p>
        )}
        
        {dafs.length > 0 && (
          <div>
            <div style={styles.grid}>
              {dafs.map((daf) => (
                <div 
                  key={daf.id} 
                  style={{
                    ...styles.dafCard,
                    ...(daf.id === dafID ? styles.selectedDafCard : {})
                  }}
                  onClick={() => handleSelectDaf(daf.id)}
                >
                  <h3 style={styles.dafName}>{daf.name}</h3>
                  <p style={styles.dafInfo}>Balance: ${daf.balance?.toLocaleString() || '0'}</p>
                  <p style={styles.dafInfo}>ID: {daf.id}</p>
                </div>
              ))}
            </div>
            
            {dafID && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button 
                  style={{
                    ...styles.button,
                    ...(loading ? styles.disabledButton : {})
                  }}
                  onClick={() => fetchWireInstructions(dafID)}
                  disabled={loading}
                >
                  {loading && !wireInstructions ? 'Loading...' : 'Get Wire Instructions'}
                </button>
              </div>
            )}
            
            {wireInstructions && (
              <div style={{...styles.card, ...styles.wireCard, marginTop: '24px'}}>
                <h3 style={styles.title}>Wire Instructions</h3>
                <div>
                  <p><strong>Bank Name:</strong> {wireInstructions.bankName}</p>
                  <p><strong>Account Number:</strong> {wireInstructions.accountNumber}</p>
                  <p><strong>Routing Number:</strong> {wireInstructions.routingNumber}</p>
                  <p><strong>Account Name:</strong> {wireInstructions.accountName}</p>
                  <p><strong>Reference:</strong> {wireInstructions.reference}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DafList;