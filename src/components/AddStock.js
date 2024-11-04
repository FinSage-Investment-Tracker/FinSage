import React, { useContext, useState} from 'react';
import { useParams } from 'react-router-dom';
import { StockContext } from '../context/StockContext';

const AddStock = () => {
    const { portfolioId } = useParams();
    const {fetchStocks, addStock, fetchStocktransactions } = useContext(StockContext);
    const [newStock, setNewStock] = useState({ symbol: "", price: "", quantity: "", type: "buy", date:""});
    const [showForm, setShowForm] = useState(false); // State to toggle form visibility

    const handleAddStock = async (e) => {
        e.preventDefault();
        await addStock(portfolioId, newStock.symbol, newStock.price, newStock.quantity, newStock.type, newStock.date);
        setNewStock({ symbol: "", price: "", quantity: "", type: "buy", date:""});
        fetchStocks(portfolioId);
        fetchStocktransactions(portfolioId);
    };

    const onChange = (e) => {
        setNewStock({ ...newStock, [e.target.name]: e.target.value });
    };

    const toggleForm = () => {
        setShowForm(!showForm); // Toggle form visibility
    };

    return (
        <>
        <button onClick={toggleForm} className="btn btn-outline-primary mb-3">Add Stock</button>
        <div className="col-md-6 mx-auto mb-5 mt-3">
        {showForm && (
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
                        type="date"
                        name="date"
                        value={newStock.date}
                        onChange={onChange}
                        className="form-control"
                        required/>
            </div>
            <button type="submit" className="btn btn-primary">Add Stock</button>
        </form>
        )}
        </div>
        </>
    );
};

export default AddStock;
