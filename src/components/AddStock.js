// AddStock.js
import React, { useState } from 'react';

const AddStock = ({ onStockAdded }) => {
    const [newStock, setNewStock] = useState({ symbol: "", demat: "", price: "", quantity: "", exchange: "", type: "" });

    

    const handleAddStock = async (e) => {
        e.preventDefault();
        await onStockAdded(newStock); // Call the function passed as a prop
        setNewStock({ symbol: "", demat: "", price: "", quantity: "", exchange: "", type: "" });
    };

    const onChange = (e) => {
        setNewStock({ ...newStock, [e.target.name]: e.target.value });
    };

    return (
        <div className="col-md-6 mx-auto mb-5 mt-3">
        <h3>Add Stock</h3>
        <form onSubmit={handleAddStock} className="mb-4">
            <div className="mb-3">
                <input
                    type="text"
                    name="symbol"
                    placeholder="Symbol"
                    value={newStock.symbol}
                    onChange={onChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    type="text"
                    name="demat"
                    placeholder="Demat Account Number"
                    value={newStock.demat}
                    onChange={onChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={newStock.price}
                    onChange={onChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={newStock.quantity}
                    onChange={onChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    type="text"
                    name="exchange"
                    placeholder="Exchange"
                    value={newStock.exchange}
                    onChange={onChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <select
                    name="type"
                    value={newStock.type}
                    onChange={onChange}
                    className="form-select"
                    required
                >
                    <option value="">Select Type</option>
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                </select>
            </div>
            <button type="submit" className="btn btn-primary">Add Stock</button>
        </form>
        </div>
    );
};

export default AddStock;
