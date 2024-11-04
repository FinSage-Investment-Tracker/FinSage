import React from 'react';

const StockItem = ({ stock, sellStock }) => {

    return (
        <>
        <div className="card w-100 mb-3" style={{ padding: '15px' }}>
            <div className="d-flex justify-content-between align-items-center">
                <div className="col">{stock.symbol}</div>
                <div className="col">{stock.quantity}</div>
                <div className="col">{stock.price}</div>
                <button type="button" class="btn btn-danger" onClick={() => sellStock(stock)} >Sell</button>
            </div>
        </div>
        </>
    );
};

export default StockItem;
