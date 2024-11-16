import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
// eslint-disable-next-line
import Chart from 'chart.js/auto'
import { StockContext } from '../context/StockContext';
import { MFContext } from '../context/MfContext';


const StockChart = () => {
    const { portfolioId } = useParams();
    const { stocktransactions} = useContext(StockContext); // Include mfTransactions here
    const {  mfTransactions } = useContext(MFContext); // Include mfTransactions here
    const [stockData, setStockData] = useState([]);
    const [mfData, setMfData] = useState([]);
    const [viewMode, setViewMode] = useState('portfolio'); // Default to 'portfolio'
    const [duration, setDuration] = useState('12'); // Default duration to 12 months

    // Function to handle duration change
    const handleDurationChange = (newDuration) => {
        setDuration(newDuration);
    };

    // Function to handle view mode change (Portfolio/Compare)
    const handleViewModeChange = (newMode) => {
        setViewMode(newMode);
    };

    // Fetch data when the component mounts or when any dependency changes
    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/charts/stock-data/${portfolioId}?duration=${duration}`);
                const data1 = await response.json();
                setStockData(data1);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        const fetchMFData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/charts/mf-data/${portfolioId}?duration=${duration}`);
                const data2 = await response.json();
                setMfData(data2);
            } catch (error) {
                console.error('Error fetching mutual fund data:', error);
            }
        };

        // Fetch both stock and mutual fund data
        fetchStockData();
        fetchMFData();
    }, [portfolioId, duration, stocktransactions, mfTransactions]); // Include stocktransactions and mfTransactions in the dependency array

    // Prepare data for Chart.js based on view mode
    const chartData = {
        labels: stockData.map(item => item.date),
        datasets: viewMode === 'portfolio'
            ? [
                {
                    label: 'Portfolio Value',
                    data: stockData.map(item => {
                        const mfItem = mfData.find(mf => mf.date === item.date);
                        return item.value + (mfItem ? mfItem.value : 0); // Combine stock and mutual fund value
                    }),
                    fill: true,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1,
                },
            ]
            : [
                {
                    label: 'Stock Value',
                    data: stockData.map(item => item.value),
                    fill: false,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.1,
                },
                {
                    label: 'Mutual Fund Value',
                    data: mfData.map(item => item.value),
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1,
                },
            ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                display: false,
            },
            y: {
                title: {
                    display: true,
                    text: 'Value',
                },
                beginAtZero: true,
            },
        },
        plugins: {
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    title: (tooltipItems) => {
                        return tooltipItems[0].label;
                    },
                    label: (tooltipItem) => {
                        return `Value: ${tooltipItem.raw}`;
                    },
                },
            },
        },
    };

    return (
        <div style={{ textAlign: 'center', margin: '20px auto' }}>
            <h2 style={{ marginBottom: '10px' }}>Portfolio Analysis Chart</h2>

            {/* Dropdown for selecting view mode */}
            <div>
                <label>View Mode: </label>
                <select value={viewMode} onChange={(e) => handleViewModeChange(e.target.value)}>
                    <option value="portfolio">Portfolio</option>
                    <option value="compare">Compare</option>
                </select>
            </div>

            {/* Dropdown for selecting duration */}
            <div>
                <label>Duration: </label>
                <select value={duration} onChange={(e) => handleDurationChange(e.target.value)}>
                    <option value="all">ALL</option>
                    <option value="12">1Y</option>
                    <option value="6">6M</option>
                    <option value="3">3M</option>
                    <option value="1">1M</option>
                </select>
            </div>

            <div style={{
                height: '60vh',
                width: '80%',
                margin: 'auto',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                borderRadius: '10px',
                backgroundColor: '#fff',
                position: 'relative',
            }}>
                <Line data={chartData} options={options} style={{ height: '100%', width: '100%' }} />
            </div>
        </div>
    );
};

export default StockChart;