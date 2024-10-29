import React, { useContext } from 'react';
import { StockContext } from '../context/StockContext';

const StockItem = ({ stock, updateStockDetails }) => {
    const context = useContext(StockContext);
    const { deleteStock } = context;

    const handleEditClick = () => {
        updateStockDetails(stock); // Call the function to update stock details
    };

    const handleDeleteClick = () => {
        // Logic for deleting the stock
        deleteStock(stock._id);
    };

    return (
        <div className="card w-100 mb-3" style={{ padding: '15px' }}>
            <div className="d-flex justify-content-between align-items-center">
                <div className="col">{stock.symbol}</div>
                <div className="col">{stock.demat}</div>
                <div className="col">{stock.quantity}</div>
                <div className="col">{stock.price}</div>
                <div className="col">{stock.exchange}</div>
                <div className="col">{stock.type}</div>
                <div className="col text-end">
                    <button className="btn btn-link p-0 me-2" onClick={handleEditClick}>
                        <i className="fas fa-edit text-primary"></i>
                    </button>
                    <button className="btn btn-link p-0" onClick={handleDeleteClick}>
                        <i className="fas fa-trash-alt text-danger"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StockItem;
