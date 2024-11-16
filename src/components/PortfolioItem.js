// PortfolioItem.js
import React, { useContext } from 'react';
import { PortfolioContext } from '../context/PortfolioContext';
import { useNavigate } from 'react-router-dom';

const PortfolioItem = ({ item, updatePortfolio }) => {
    const context = useContext(PortfolioContext);
    const { deletePortfolio } = context;
    const navigate = useNavigate();

    const handleDeleteClick = () => {
        deletePortfolio(item._id);
    };

    const handleNameClick = () => {
        navigate(`/portfolio/${item._id}`);
    };

    return (
        <div className="card w-100 mb-3" style={{ padding: '15px' }}>
            <div className="d-flex justify-content-between align-items-center">
                <div className="col" onClick={handleNameClick} style={{ cursor: 'pointer', color: 'blue' }}>{item.name}</div>
                <div className="col">{item.relationship}</div>
                <div className="col">{item.stocks ? item.stocks.length : 0}</div>
                <div className="col">{item.mutualFunds ? item.mutualFunds.length : 0}</div>
                <div className="col text-end">
                    <button className="btn btn-link p-0 me-2">
                        <i className="fas fa-edit text-primary" onClick={() => updatePortfolio(item)}></i>
                    </button>
                    <button className="btn btn-link p-0">
                        <i className="fas fa-trash-alt text-danger" onClick={handleDeleteClick}></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PortfolioItem;