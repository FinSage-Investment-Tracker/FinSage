import React, { useEffect, useState } from 'react';
import Spinner from './Spinner'; // Import your custom Spinner component

const StockNews = ({ company }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Send the company prop as a query parameter or include it in the URL
        const response = await fetch(`http://localhost:5000/api/stock-news?company=${company}`);
        const data = await response.json();
        setNews(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching news');
        setLoading(false);
      }
    };

    fetchNews();
  }, [company]); // Re-fetch when company changes

  return (
    <div>
      <h2>{company} News</h2>
      {/* Show custom spinner while loading */}
      {loading ? (
        <div style={styles.spinnerContainer}>
          <Spinner />
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {/* Show news or no news after fetching */}
          {news.length > 0 ? (
            <ul style={styles.newsList}>
              {news.map((item, index) => (
                <NewsItem key={index} item={item} />
              ))}
            </ul>
          ) : (
            <p>No news found.</p>
          )}
        </div>
      )}
    </div>
  );
};

const NewsItem = ({ item }) => {
  return (
<li className="card w-100 mb-3" style={{ padding: '15px' }}>
    <div className="d-flex justify-content-between align-items-center">
        <div className="col-8">
            <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'black' }}>
                <h5 style={{ margin: 0 }}>{item.title}</h5>
            </a>
        </div>
        <div className="col-4 text-end">
            <p style={{ fontSize: '14px', color: '#555', margin: 0 }}>
                <strong>{item.time}</strong>
            </p>
        </div>
    </div>
</li>
  );
};

const styles = {
  newsList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  newsItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '15px',
    margin: '10px 0',
    backgroundColor: '#f4f4f9',
    borderRadius: '15px', // Curved edges
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    marginBottom: '10px',
  },
  sourceText: {
    fontSize: '14px',
    color: '#555',
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px',
  },
};

export default StockNews;