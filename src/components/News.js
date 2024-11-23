import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "./Spinner"; // Assuming you have a Spinner component
import etImage from '../Assets/ET.jpg'; // Adjust the path based on where the image is located
import mintImage from '../Assets/mint.jpg'; 

const News = ({ pageSize }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true); // Initially loading
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState(null);

  const fetchNews = async (page) => {
    setLoading(true);
    const url = `http://localhost:5000/api/news?page=${page}&pageSize=${pageSize}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (page === 1) {
        setArticles(data.articles || []);
      } else {
        setArticles((prevArticles) => [...prevArticles, ...(data.articles || [])]);
      }

      setTotalResults(data.totalResults || 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Error fetching news. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(1); 
    // eslint-disable-next-line
  }, []);

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    await fetchNews(nextPage);
    setPage(nextPage);
  };

  const getImageSource = (source) => {
    if (source === 'Economictimes') {
      return etImage;
    } else if (source === 'Livemint') {
      return mintImage;
    } else {
      return 'https://via.placeholder.com/200';
    }
  };

  const NewsItem = ({ title, description, imageUrl, newsUrl, author, date, source }) => (
    <div
      className="card my-3 shadow-sm d-flex flex-column"
      style={{ borderRadius: "10px", overflow: "hidden", height: "100%" }}
    >
      <img
        src={imageUrl || getImageSource(source)}
        className="card-img-top"
        alt="News Thumbnail"
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column" style={{ backgroundColor: "#f8f9fa" }}>
        <h5 className="card-title text-truncate" style={{ fontWeight: "bold", color: "#333" }}>
          {title || "No Title Available"}
        </h5>
        <p className="card-text" style={{ fontSize: "14px", color: "#555" }}>
          {description ? description.slice(0, 88) + "..." : "No description available..."}
        </p>
        <div className="card-meta mb-2" style={{ fontSize: "12px", color: "#888" }}>
          <small>
            By <strong>{author || "Unknown"}</strong> on {new Date(date).toLocaleDateString()}
          </small>
        </div>
        <div className="card-meta mb-3" style={{ fontSize: "12px", color: "#888" }}>
          <small>Source: {source || "Unknown"}</small>
        </div>
        <div className="mt-auto">
          <a
            href={newsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-outline-primary w-100"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
  

  return (
    <div className={`container my-3`} style={{ maxWidth: "1200px" }}>
      <div className="text-center" style={{ marginTop: "20px", marginBottom: "20px" }}>
        <h2 style={{ fontWeight: "bold", color: "#333" }}>Indian Market News</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading && page === 1 && <Spinner />}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length < totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row gx-4 gy-4">
            {articles.map((article, index) => (
              <div className="col-md-4 d-flex" key={index}>
                <NewsItem
                  title={article.title}
                  description={article.content}
                  imageUrl={article.enclosure?.url}
                  newsUrl={article.link}
                  author={article.creator}
                  date={article.pubDate}
                  source={article.source}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>

      {!loading && articles.length === 0 && (
        <div className="text-center my-5">
          <h4 style={{ color: "#555" }}>No more news found.</h4>
        </div>
      )}
    </div>
  );
};

export default News;
