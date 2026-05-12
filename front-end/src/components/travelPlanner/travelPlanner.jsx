import React, { useState, useEffect } from 'react';

export default function TravelSearch() {
  // --- STATE FOR RAW DATABASE DATA ---
  const [destinations, setDestinations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [vibes, setVibes] = useState([]);
  const [destActivities, setDestActivities] = useState([]);
  const [destVibes, setDestVibes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE FOR UI VIEWS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');

  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('');
  const [availableVibes, setAvailableVibes] = useState([]); // NEW: Stores filtered vibes
  const [dropdownResults, setDropdownResults] = useState([]);
  const [dropdownError, setDropdownError] = useState('');

  const [luckyResult, setLuckyResult] = useState(null);

  // 1. FETCH ALL DATA ON MOUNT
  useEffect(() => {
    Promise.all([
      fetch('http://127.0.0.1:5001/api/destinations').then(res => res.json()),
      fetch('http://127.0.0.1:5001/api/activities').then(res => res.json()),
      fetch('http://127.0.0.1:5001/api/vibes').then(res => res.json()),
      fetch('http://127.0.0.1:5001/api/destinations-activities').then(res => res.json()),
      fetch('http://127.0.0.1:5001/api/destination-vibes').then(res => res.json())
    ])
    .then(([destData, actData, vibeData, destActData, destVibeData]) => {
      setDestinations(destData);
      setActivities(actData);
      setVibes(vibeData);
      setDestActivities(destActData);
      setDestVibes(destVibeData);
      setIsLoading(false);
    })
    .catch(err => {
      console.error("Failed to fetch database:", err);
      setIsLoading(false);
    });
  }, []);

  // --- HELPER: Get all connected data for a specific destination ---
  const getFullDestinationData = (destination) => {
    const connectedVibes = destVibes
      .filter(dv => Number(dv.DestinationID) === Number(destination.DestinationID))
      .map(dv => vibes.find(v => Number(v.VibeID) === Number(dv.VibeID))?.VibeName);

    const connectedActivities = destActivities
      .filter(da => Number(da.DestinationID) === Number(destination.DestinationID))
      .map(da => {
        const actName = activities.find(a => Number(a.ActivityID) === Number(da.ActivityID))?.ActivityName;
        return { name: actName, desc: da.Spotlight_Description };
      });

    return { connectedVibes, connectedActivities };
  };

  // --- FEELING LUCKY LOGIC (Updated to show all data) ---
  const handleFeelingLucky = () => {
    if (destinations.length === 0) return;

    // Pick a random destination
    const randomDest = destinations[Math.floor(Math.random() * destinations.length)];
    
    // Grab all its data using the helper
    const { connectedVibes, connectedActivities } = getFullDestinationData(randomDest);

    setLuckyResult({
      destination: randomDest,
      vibes: connectedVibes,
      activities: connectedActivities
    });
    
    // Clear other views
    setSearchResult(null);
    setDropdownResults([]);
    setSelectedActivity('');
    setSelectedVibe('');
  };

  // --- SEARCH BAR LOGIC ---
  const handleSearch = (e) => {
    e.preventDefault(); 
    const match = destinations.find(
      d => d.CityName.toLowerCase() === searchTerm.toLowerCase() || 
           d.Country.toLowerCase() === searchTerm.toLowerCase()
    );

    if (match) {
      setSearchResult(match);
      setSearchError('');
    } else {
      setSearchResult(null);
      setSearchError('No matching destination found.');
    }
    setLuckyResult(null); 
  };

  // --- NEW: CASCADING DROPDOWN LOGIC ---
  useEffect(() => {
    if (!selectedActivity) {
      setAvailableVibes([]);
      setSelectedVibe('');
      return;
    }

    const actId = Number(selectedActivity);

    // 1. Find all cities that offer this activity
    const validDestIds = destActivities
      .filter(da => Number(da.ActivityID) === actId)
      .map(da => Number(da.DestinationID));

    // 2. Find all vibes linked to those specific cities
    const validVibeIds = destVibes
      .filter(dv => validDestIds.includes(Number(dv.DestinationID)))
      .map(dv => Number(dv.VibeID));

    // 3. Filter the vibe dropdown list (using a Set to remove duplicates)
    const uniqueVibeIds = [...new Set(validVibeIds)];
    const filteredVibes = vibes.filter(v => uniqueVibeIds.includes(Number(v.VibeID)));
    
    setAvailableVibes(filteredVibes);

    // 4. If the user's previously selected vibe isn't in the new list, clear it
    if (selectedVibe && !uniqueVibeIds.includes(Number(selectedVibe))) {
      setSelectedVibe('');
    }
  }, [selectedActivity, destActivities, destVibes, vibes]);


  // --- DROPDOWN RESULTS LOGIC ---
  useEffect(() => {
    if (!selectedActivity) {
      setDropdownResults([]);
      setDropdownError('');
      return;
    }

    const targetActId = Number(selectedActivity);

    // Filter by activity first
    let matches = destinations.filter(dest => 
      destActivities.some(da => Number(da.DestinationID) === Number(dest.DestinationID) && Number(da.ActivityID) === targetActId)
    );

    // If a vibe is ALSO selected, filter it down further
    if (selectedVibe) {
      const targetVibeId = Number(selectedVibe);
      matches = matches.filter(dest => 
        destVibes.some(dv => Number(dv.DestinationID) === Number(dest.DestinationID) && Number(dv.VibeID) === targetVibeId)
      );
    }

    if (matches.length > 0) {
      setDropdownResults(matches);
      setDropdownError('');
    } else {
      setDropdownResults([]);
      setDropdownError('No destinations match this combination.');
    }
    setLuckyResult(null); 
  }, [selectedActivity, selectedVibe, destinations, destActivities, destVibes]);


  if (isLoading) return <div style={{ padding: '20px' }}>Loading database...</div>;

  return (
    <div style={{ display: 'flex', gap: '30px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif', padding: '20px' }}>
      
      {/* --- LEFT COLUMN: SEARCH AND CONTROLS --- */}
      <div style={{ flex: 1 }}>
        
        {/* FEELING LUCKY BUTTON */}
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <button 
            onClick={handleFeelingLucky}
            style={{ 
              padding: '15px 30px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', 
              backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '30px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            🎲 I'm Feeling Lucky
          </button>
        </div>

        {/* FEELING LUCKY RESULT DISPLAY (Updated) */}
        {luckyResult && (
          <div style={{ marginBottom: '40px', padding: '25px', backgroundColor: '#fff3cd', border: '2px solid #ffeeba', borderRadius: '10px' }}>
            <h2 style={{ margin: '0 0 10px 0', color: '#856404', textAlign: 'center' }}>How about...</h2>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', textAlign: 'center' }}>{luckyResult.destination.CityName}, {luckyResult.destination.Country}</h1>
            <p style={{ margin: '0 0 20px 0', fontStyle: 'italic', textAlign: 'center' }}>{luckyResult.destination.Description}</p>
            
            <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#007BFF' }}>Vibes in that place:</h4>
              <p style={{ margin: '0 0 15px 0', fontSize: '14px' }}>{luckyResult.vibes.join(', ') || 'No specific vibe set.'}</p>
              
              <h4 style={{ margin: '0 0 5px 0', color: '#007BFF' }}>Activities you can do:</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                {luckyResult.activities.length > 0 ? (
                  luckyResult.activities.map((act, i) => (
                    <li key={i} style={{ marginBottom: '5px' }}><strong>{act.name}:</strong> {act.desc}</li>
                  ))
                ) : (
                  <li>Explore the city!</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* SECTION 1: SEARCH BAR */}
        <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>Search by Name</h2>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="e.g. Tokyo, France..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, padding: '10px' }}
            />
            <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px' }}>Send</button>
          </form>

          {searchError && <p style={{ color: 'red', marginTop: '15px' }}>{searchError}</p>}
          
          {searchResult && (() => {
            const { connectedVibes, connectedActivities } = getFullDestinationData(searchResult);
            return (
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{searchResult.CityName}, {searchResult.Country}</h3>
                <p style={{ margin: '0 0 10px 0' }}><em>{searchResult.Description}</em></p>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}><strong>Vibes:</strong> {connectedVibes.join(', ')}</p>
                <h4 style={{ margin: '10px 0 5px 0' }}>Activities here:</h4>
                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '14px' }}>
                  {connectedActivities.map((act, i) => (
                    <li key={i} style={{ marginBottom: '5px' }}><strong>{act.name}:</strong> {act.desc}</li>
                  ))}
                </ul>
              </div>
            );
          })()}
        </div>

        {/* SECTION 2: THE MATRIX DROPDOWNS */}
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>Find by Vibe & Activity</h2>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <select value={selectedActivity} onChange={(e) => setSelectedActivity(e.target.value)} style={{ flex: 1, padding: '10px' }}>
              <option value="">-- 1. Choose Activity --</option>
              {activities.map(act => (
                <option key={act.ActivityID} value={act.ActivityID}>{act.ActivityName}</option>
              ))}
            </select>

            {/* VIBE DROPDOWN - Disabled until activity is selected, mapped to availableVibes */}
            <select 
              value={selectedVibe} 
              onChange={(e) => setSelectedVibe(e.target.value)} 
              style={{ flex: 1, padding: '10px', backgroundColor: !selectedActivity ? '#eee' : 'white' }}
              disabled={!selectedActivity}
            >
              <option value="">-- 2. Choose Vibe --</option>
              {availableVibes.map(v => (
                <option key={v.VibeID} value={v.VibeID}>{v.VibeName}</option>
              ))}
            </select>
          </div>

          {dropdownError && selectedActivity && (
            <p style={{ color: 'red' }}>{dropdownError}</p>
          )}

          {dropdownResults.length > 0 && (
            <div>
              <h3>Recommended for you:</h3>
              {dropdownResults.map(dest => {
                const { connectedVibes, connectedActivities } = getFullDestinationData(dest);
                return (
                  <div key={dest.DestinationID} style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#eef6ff', borderRadius: '5px' }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>{dest.CityName}, {dest.Country}</h4>
                    <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}><em>{dest.Description}</em></p>
                    <p style={{ margin: '0 0 5px 0', fontSize: '13px' }}><strong>Vibes:</strong> {connectedVibes.join(', ')}</p>
                    <p style={{ margin: 0, fontSize: '13px' }}><strong>Activities:</strong> {connectedActivities.map(a => a.name).join(', ')}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* --- RIGHT COLUMN: DATABASE DIRECTORY TABLE --- */}
      <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '8px', maxHeight: '80vh', overflowY: 'auto' }}>
        <h2 style={{ marginTop: 0 }}>Available Database</h2>
        <p style={{ fontSize: '14px', color: '#555' }}>A complete list of all currently supported destinations.</p>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '2px solid #333', padding: '10px 8px' }}>City</th>
              <th style={{ borderBottom: '2px solid #333', padding: '10px 8px' }}>Country</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((d) => (
              <tr key={d.DestinationID}>
                <td style={{ borderBottom: '1px solid #ddd', padding: '10px 8px' }}><strong>{d.CityName}</strong></td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '10px 8px' }}>{d.Country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}