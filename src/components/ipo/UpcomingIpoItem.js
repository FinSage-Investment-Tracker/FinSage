import React from 'react';

const UpcomingIpoItem = ({ ipo }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{ipo.name} ({ipo.symbol})</h5>
        <h6 class="card-subtitle mb-2 text-body-secondary">{ipo.additional_text}</h6>
        <div className="d-flex justify-content-between">
          <p className="mb-1">
            <strong>Price Range:</strong> ₹{ipo.min_price} - ₹{ipo.max_price}
          </p>
          <p className="mb-1">
            <strong>Bidding Start:</strong> {ipo.bidding_start_date || 'N/A'}
          </p>
        </div>
        <div className="d-flex justify-content-between">
          <p className="mb-1">
            <strong>Listing Date:</strong> {ipo.listing_date || 'N/A'}
          </p>
          <p className="mb-1">
            <strong>Bidding End:</strong> {ipo.bidding_end_date || 'N/A'}
          </p>
        </div>
        {ipo.document_url && (
          <a href={ipo.document_url} target="_blank" rel="noopener noreferrer" className="card-link">View Prospectus</a>
        )}
      </div>
    </div>
  );
};

export default UpcomingIpoItem;
