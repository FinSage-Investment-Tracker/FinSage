import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { StockContext } from '../../context/StockContext';
import axios from 'axios';


const AddSip = () => {
    const { portfolioId } = useParams();
    const {fetchStocks, fetchStocktransactions, addSip } = useContext(StockContext);
    const [newStock, setNewStock] = useState({ symbol: "", quantity: "", startDate:"", endDate:""});
    const [showForm, setShowForm] = useState(false); // State to toggle form visibility
    const [suggestions, setSuggestions] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isSymbolSelected, setIsSymbolSelected] = useState(false); // Track if a symbol is selected
    const typingTimeoutRef = useRef(null);

    const handleAddStock = async (e) => {
        e.preventDefault();
        await addSip(portfolioId, newStock.symbol, newStock.quantity, newStock.startDate, newStock.endDate);
        fetchStocktransactions(portfolioId);
        fetchStocks(portfolioId)
    };


    const onChange = (e) => {
        setNewStock({ ...newStock, [e.target.name]: e.target.value });
        if (e.target.name === "symbol") {
            setIsSymbolSelected(false); // Reset the flag when typing in the symbol input
        }
    };

    const toggleForm = () => {
        setShowForm(!showForm); // Toggle form visibility
    };

    // Function to fetch stock name-based suggestions
    const fetchStockSuggestions = async (query) => {
        if (query.length < 3) {
            setSuggestions([]);
            setIsDropdownVisible(false);
            return;
        }
        try {
            const response = await axios.get(`http://localhost:5000/api/stocksymbol/suggestions`, { params: { query } });
            setSuggestions(response.data);
            setIsDropdownVisible(true);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setIsDropdownVisible(false);
        }
    };
    
    // Debounced fetching of stock suggestions
    useEffect(() => {
        if (isSymbolSelected) return; // Skip fetching if a symbol is selected

        // Clear the previous timeout if it exists
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        if (newStock.symbol) {
            typingTimeoutRef.current = setTimeout(() => {
                fetchStockSuggestions(newStock.symbol);
            }, 300); // Debounce delay
        } else {
            setSuggestions([]);
            setIsDropdownVisible(false);
        }

        // Cleanup timeout on component unmount
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [newStock.symbol, isSymbolSelected]);

    const handleSuggestionClick = (symbol) => {
        setNewStock({ ...newStock, symbol });
        setSuggestions([]);
        setIsDropdownVisible(false);
        setIsSymbolSelected(true); // Set the flag when a symbol is selected
    };

    return (
        <>
        <button onClick={toggleForm} className="btn btn-outline-primary mb-3">Add SIP</button>
        <div className="col-md-6 mx-auto mb-5 mt-3">
        {showForm && (
            <form onSubmit={handleAddStock} className="mb-4">
            <div className="mb-3">
            <div className="input-group">
                <input
                    type="text"
                    name="symbol"
                    placeholder="Symbol"
                    value={newStock.symbol}
                    onChange={onChange}
                    className="form-control"
                    onFocus={() => {
                        if (suggestions.length > 0) {
                            setIsDropdownVisible(true);
                        }
                    }}
                    onBlur={() => {
                        setTimeout(() => setIsDropdownVisible(false), 100);
                    }}
                    required
                />
                {isDropdownVisible && suggestions.length > 0 && (
                    <ul
                        className="dropdown-menu show"
                        style={{
                            position: 'absolute',
                            zIndex: '1000',
                            top: '100%',
                            left: '0',
                            width: '100%',
                            marginTop: '5px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                        }}
                    >
                        {suggestions.map((suggestion) => (
                            <li
                                key={suggestion._id}
                                onMouseDown={() => handleSuggestionClick(suggestion.symbol)}
                                className="dropdown-item"
                            >
                                {suggestion.name} - {suggestion.symbol}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
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