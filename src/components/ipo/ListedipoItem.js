import React from 'react'

const ListedipoItem = ({ ipo }) => {
    const gainColor = ipo.listing_gains > 0 ? 'text-success' : ipo.listing_gains < 0 ? 'text-danger' : 'text-body-secondary';
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{ipo.name} ({ipo.symbol})</h5>
        <h6 class={`card-subtitle mb-2 ${gainColor}`}>{ipo.additional_text}</h6>
        {ipo.document_url && (
          <a href={ipo.document_url} target="_blank" rel="noopener noreferrer" className="card-link">View Prospectus</a>
        )}
      </div>
    </div>
  )
}

export default ListedipoItem