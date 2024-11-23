import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { StockContext } from '../context/StockContext';
import axios from 'axios';
import FileUpload from './fileupload/FileUpload';

const AddStock = () => {
    const { portfolioId } = useParams();
    const { fetchStocks, addStock, fetchStocktransactions } = useContext(StockContext);
    const [newStock, setNewStock] = useState({ symbol: "", price: "", quantity: "", type: "buy", date: "" });
    const [showForm, setShowForm] = useState(false); // State to toggle form visibility
    const [suggestions, setSuggestions] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isSymbolSelected, setIsSymbolSelected] = useState(false); // Track if a symbol is selected
    const typingTimeoutRef = useRef(null);

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

    const handleAddStock = async (e) => {
        e.preventDefault();
        
        const API_KEY = process.env.REACT_APP_EODHD1; // Add your API key here
        const url = `https://eodhd.com/api/eod/${newStock.symbol}.nse?from=${newStock.date}&to=${newStock.date}&period=d&api_token=${API_KEY}&fmt=json`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            const high = data[0].high;
            const low = data[0].low;
            if (newStock.price < high && newStock.price > low) {
                await addStock(portfolioId, newStock.symbol, newStock.price, newStock.quantity, newStock.type, newStock.date);
                setNewStock({ symbol: "", price: "", quantity: "", type: "buy", date: "" });
                fetchStocks(portfolioId);
                fetchStocktransactions(portfolioId);
            } else {
                alert(`Price should be between ${low} and ${high}`);
            }
        } catch (error) {
            alert(`Error: ${error.message}, check the stock symbol`);
        }
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

    const handleSuggestionClick = (symbol) => {
        setNewStock({ ...newStock, symbol });
        setSuggestions([]);
        setIsDropdownVisible(false);
        setIsSymbolSelected(true); // Set the flag when a symbol is selected
    };

    return (
        <>
            <button onClick={toggleForm} className="btn btn-outline-primary mb-3">Add Stock</button>
            <div className="col-md-6 mx-auto mb-5 mt-3">
                {showForm && (
                    <>
                    <form onSubmit={handleAddStock} className="mb-4">
                        <div className="mb-3">
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="symbol"
                                    placeholder="Enter Stock Name"
                                    value={newStock.symbol}
                                    onChange={onChange}
                                    className="form-control"
                                    required
                                    onFocus={() => {
                                        if (suggestions.length > 0) {
                                            setIsDropdownVisible(true);
                                        }
                                    }}
                                    onBlur={() => {
                                        setTimeout(() => setIsDropdownVisible(false), 100);
                                    }}
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
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Add Stock</button>
                    </form>
                    <FileUpload/>
                    </>
                )}
            </div>
        </>
    );
};

export default AddStock;