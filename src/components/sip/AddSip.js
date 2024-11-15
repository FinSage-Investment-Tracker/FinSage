import React, { useContext, useState} from 'react';
import { useParams } from 'react-router-dom';
import { StockContext } from '../../context/StockContext';


const AddSip = () => {
    const { portfolioId } = useParams();
    const {fetchStocks, fetchStocktransactions, addSip } = useContext(StockContext);
    const [newStock, setNewStock] = useState({ symbol: "", quantity: "", startDate:"", endDate:""});
    const [showForm, setShowForm] = useState(false); // State to toggle form visibility

    const handleAddStock = async (e) => {
        e.preventDefault();
        await addSip(portfolioId, newStock.symbol, newStock.quantity, newStock.startDate, newStock.endDate);
        fetchStocktransactions(portfolioId);
        fetchStocks(portfolioId)
    };


    const onChange = (e) => {
        setNewStock({ ...newStock, [e.target.name]: e.target.value });
    };

    const toggleForm = () => {
        setShowForm(!showForm); // Toggle form visibility
    };

    return (
        <>
        <button onClick={toggleForm} className="btn btn-outline-primary mb-3">Add SIP</button>
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
                    name="quantity"
                    placeholder="Quantity"
                    value={newStock.quantity}
                    onChange={onChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
            <label htmlFor="startDate" className="form-label">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={newStock.startDate}
                        onChange={onChange}
                        className="form-control"
                        required/>
            </div>
            <div className="mb-3">
            <label htmlFor="endDate" className="form-label">End Date (remain empty if active)</label>
                    <input
                        type="date"
                        name="endDate"
                        value={newStock.endDate}
                        onChange={onChange}
                        className="form-control"/>
            </div>
            <button type="submit" className="btn btn-primary">Add SIP</button>
        </form>
        )}
        </div>
        </>
    );
};

export default AddSip;