import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MFContext } from '../context/MfContext';
import axios from 'axios';

const AddMf = () => {
    const { portfolioId } = useParams();
    const { addMutualFund, fetchMutualFunds, fetchMfTransactions } = useContext(MFContext);
    const [newMf, setNewMf] = useState({ id: "", symbol: "", nav: "", units: "", type: "buy", date: "" });
    const [showForm, setShowForm] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isSymbolSelected, setIsSymbolSelected] = useState(false);
    const typingTimeoutRef = useRef(null);

    // Function to fetch MF symbol suggestions
    const fetchMfSuggestions = async (query) => {
        if (query.length < 2) {
            setSuggestions([]);
            setIsDropdownVisible(false);
            return;
        }
        try {
            const response = await axios.get(`http://localhost:5000/api/mfsymbol/suggestions`, { params: { query } });
            setSuggestions(response.data);
            setIsDropdownVisible(true);
        } catch (error) {
            console.error("Error fetching MF suggestions:", error);
            setIsDropdownVisible(false);
        }
    };

    // Debounced fetching of MF suggestions
    useEffect(() => {
        if (isSymbolSelected) return;

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        if (newMf.symbol) {
            typingTimeoutRef.current = setTimeout(() => {
                fetchMfSuggestions(newMf.symbol);
            }, 300); // Debounce delay
        } else {
            setSuggestions([]);
            setIsDropdownVisible(false);
        }

        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [newMf.symbol, isSymbolSelected]);

    // Handle form submission with API validation
    const handleAddMf = async (e) => {
        e.preventDefault();

        const API_KEY = "67513154014743.32771947"; // API key
        const url = `https://eodhd.com/api/eod/${newMf.symbol}.nse?from=${newMf.date}&to=${newMf.date}&period=d&api_token=${API_KEY}&fmt=json`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.length === 0) {
                alert("No data found for the selected date. Please check the symbol and date.");
                return;
            }

            const low=data[0].close;
            const nav = parseFloat(newMf.nav);

            // Validate if the entered NAV is within the high and low range
            // eslint-disable-next-line
            if (nav===low) {
                await addMutualFund(portfolioId, newMf.symbol, nav, newMf.units, newMf.type, newMf.date);
                setNewMf({ symbol: "", nav: "", units: "", type: "buy", date: "" });
                fetchMutualFunds(portfolioId);
                fetchMfTransactions(portfolioId);
            } else {
                alert(`NAV should be ${low} on the selected date`);
            }
        } catch (error) {
            alert(`Error: ${error.message}, check the mutual fund symbol`);
        }
    };

    // Handle input changes
    const onChange = (e) => {
        setNewMf({ ...newMf, [e.target.name]: e.target.value });
        if (e.target.name === "symbol") {
            setIsSymbolSelected(false);
        }
    };

    // Toggle form visibility
    const toggleForm = () => {
        setShowForm(!showForm);
    };

    // Handle suggestion click
    const handleSuggestionClick = (symbol) => {
        setNewMf({ ...newMf, symbol });
        setSuggestions([]);
        setIsDropdownVisible(false);
        setIsSymbolSelected(true);
    };

    return (
        <>
            <button onClick={toggleForm} className="btn btn-outline-primary mb-3">Add ETF or MF</button>
            <div className="col-md-6 mx-auto mb-5 mt-3">
                {showForm && (
                    <form onSubmit={handleAddMf} className="mb-4">
                        <div className="mb-3">
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="symbol"
                                    placeholder="Enter MF Symbol"
                                    value={newMf.symbol}
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
                                name="nav"
                                placeholder="NAV"
                                value={newMf.nav}
                                onChange={onChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="number"
                                name="units"
                                placeholder="Units"
                                value={newMf.units}
                                onChange={onChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="date"
                                name="date"
                                value={newMf.date}
                                onChange={onChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Add</button>
                    </form>
                )}
            </div>
        </>
    );
};

export default AddMf;