import React, { useState } from 'react';
import UpcomingIpoItem from './UpcomingIpoItem';
import ListedipoItem from './ListedipoItem';

const IpoList = () => {
  const [ipoData, setIpoData] = useState({
    upcoming: [],
    listed: [],
    active: [],
    closed: []
  });

  const fetchIpoData = async () => {
    try {
      const response = await fetch('https://indian-stock-exchange-api2.p.rapidapi.com/ipo', {
        method: 'GET',
        headers: {
            // 5d7c661377msh93b90c6777f0313p179780jsneaa9f4be588a
          'x-rapidapi-key': process.env.REACT_APP_RAPIDISE,
          'x-rapidapi-host': 'indian-stock-exchange-api2.p.rapidapi.com'
        }
      });
      const data = await response.json();
      setIpoData(data);
    } catch (error) {
      console.error('Error fetching IPO data:', error);
    }
  };

  // Call fetchIpoData immediately when the component renders
  if (ipoData.upcoming.length === 0 && ipoData.listed.length === 0 && ipoData.active.length === 0 && ipoData.closed.length === 0) {
    fetchIpoData();
  }

  return (
    <div>
    
        <h3 className="mt-3 mb-4">Active IPOs</h3>
        <div>
        {ipoData.active.length > 0 ? (
            ipoData.active.map((ipo) => (
            <UpcomingIpoItem key={ipo.symbol} ipo={ipo} />
            ))
        ) : (
            <p>No Active IPOs available.</p>
        )}
        </div>

        <h3 className="mt-3 mb-4">Closed IPOs</h3>
        <div>
            {ipoData.closed.length > 0 ? (
            ipoData.closed.map((ipo) => (
                <ListedipoItem key={ipo.symbol} ipo={ipo} />
            ))
            ) : (
            <p>No closed IPOs available.</p>
            )}
        </div>
      <h3 className="mt-3 mb-4">Upcoming IPOs</h3>
      <div>
        {ipoData.upcoming.length > 0 ? (
          ipoData.upcoming.map((ipo) => (
            <UpcomingIpoItem key={ipo.symbol} ipo={ipo} />
          ))
        ) : (
          <p>No upcoming IPOs available.</p>
        )}
      </div>

      <h3 className="mt-3 mb-4">Listed IPOs</h3>
      <div>
        {ipoData.listed.length > 0 ? (
          ipoData.listed.map((ipo) => (
            <ListedipoItem key={ipo.symbol} ipo={ipo} />
          ))
        ) : (
          <p>No listed IPOs available.</p>
        )}
      </div>
    </div>
  );
};

export default IpoList;
