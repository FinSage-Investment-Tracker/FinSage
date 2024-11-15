import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "./Spinner"; // Assuming you have a Spinner component
import etImage from '../Assets/ET.jpg';  // Adjust the path based on where the image is located
import mintImage from '../Assets/mint.jpg'; 

const News = ({ pageSize }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true); // Initially loading
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState(null);

  // Fetch news function
  const fetchNews = async (page) => {
    setLoading(true); // Set loading to true before fetch
    const url = `http://localhost:5000/api/news?page=${page}&pageSize=${pageSize}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      // Initial fetch or updating with more articles
      if (page === 1) {
        setArticles(data.articles || []);
      } else {
        setArticles((prevArticles) => [...prevArticles, ...(data.articles || [])]);
      }

      setTotalResults(data.totalResults || 0);
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Error fetching news. Please try again later.");
      setLoading(false); // Set loading to false if error occurs
    }
  };

  useEffect(() => {
    fetchNews(1); // Initial fetch
    // eslint-disable-next-line
  }, []);

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    await fetchNews(nextPage);
    setPage(nextPage);
  };

  const getImageSource = (source) => {
    if (source === 'Economictimes') {
      return etImage; // Replace with your Economictimes image URL
    } else if (source === 'Livemint') {
      return mintImage; // Replace with your Livemint image URL
    } else {
      return 'https://via.placeholder.com/200'; // Fallback to a generic placeholder
    }
  };

  // Inline NewsItem Component
  const NewsItem = ({ title, description, imageUrl, newsUrl, author, date, source }) => (
    <div className="card my-3" style={{ width: "18rem" }}>
      <img
        src={imageUrl || getImageSource(source)}  // Use the dynamically set image source
        className="card-img-top"
        alt="News Thumbnail"
        style={{ height: "150px", objectFit: "cover" }}
      />
      <div className="card-body">
        <h5 className="card-title">{title || "No Title Available"}</h5>
        <p className="card-text">
          {description ? description.slice(0, 88) : "No description available..."}
        </p>
        <p className="card-text">
          <small className="text-muted">
            By {author || "Unknown"} on {new Date(date).toLocaleDateString()}
          </small>
        </p>
        <p className="card-text">
          <small className="text-muted">
            Source: {source || "Unknown"}
          </small>
        </p>
        <a href={newsUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary">
          Read More
        </a>
      </div>
    </div>
  );

  return (
    <div className={`container my-3 text-black`}>
      {/* Separate div for the heading */}
      <div className="text-center" style={{ marginTop: "20px", marginBottom: "20px" }}>
        <h2>Indian Market News</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Show spinner during the initial fetch */}
      {loading && page === 1 && <Spinner />}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length < totalResults}
        loader={<Spinner />}  // Show spinner while fetching more data
      >
        <div className="container">
          <div className="row">
            {articles.map((article, index) => (
              <div className="col-md-4" key={index}>
                <NewsItem
                  title={article.title}
                  description={article.content}
                  imageUrl={article.enclosure?.url}
                  newsUrl={article.link}
                  author={article.creator}
                  date={article.pubDate}
                  source={article.source}  // Added source here
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>

      {/* Show this message if no news articles are available */}
      {!loading && articles.length === 0 && <h4>No more news found.</h4>}
    </div>
  );
};

export default News;