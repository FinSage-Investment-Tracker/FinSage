import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { Line } from 'react-chartjs-2';
// eslint-disable-next-line
import Chart from 'chart.js/auto'
import { StockContext } from '../context/StockContext';
import { MFContext } from '../context/MfContext';


const StockChart = () => {
    const { portfolioId } = useParams(); // Get portfolioId from params
    const { stocktransactions } = useContext(StockContext); // Use context to get stock transactions
    const { mfTransactions } = useContext(MFContext); // Use context to get stock transactions
    const [stockData, setStockData] = useState([]);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/charts/stock-data/${portfolioId}`);
                const data1 = await response.json();
                return data1;
            } catch (error) {
                console.error('Error fetching stock data:', error);
                return [];
            }
        };

        const fetchMFData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/charts/mf-data/${portfolioId}`);
                const data2 = await response.json();
                return data2;
            } catch (error) {
                console.error('Error fetching mf data:', error);
                return [];
            }
        };

        const fetchAndCombineData = async () => {
            const [data1, data2] = await Promise.all([fetchStockData(), fetchMFData()]);

            // Combine data by date
            const combinedData = {};

            data1.forEach((item) => {
                combinedData[item.date] = { date: item.date, value: item.value };
            });

            data2.forEach((item) => {
                if (combinedData[item.date]) {
                    combinedData[item.date].value += item.value;
                } else {
                    combinedData[item.date] = { date: item.date, value: item.value };
                }
            });

            // Convert the combined data object back to an array and sort by date
            const combinedArray = Object.values(combinedData).sort((a, b) => new Date(a.date) - new Date(b.date));
            setStockData(combinedArray);
        };

        fetchAndCombineData();
    }, [portfolioId, stocktransactions, mfTransactions]);// Add stocktransactions to the dependency array
// useEffect(() => {
//     const fetchStockData = async () => {
//         try {
//             const response = await fetch(`http://localhost:5000/api/charts/stock-data/${portfolioId}`); // Use portfolioId in the URL
//             const data = await response.json();
//             console.log('Fetched Stock Data:', data); // Log the fetched data
//             setStockData(data);
//         } catch (error) {
//             console.error('Error fetching stock data:', error);
//         }
//     };
//     fetchStockData();
//     //########################################################################3
// }, [portfolioId, stocktransactions]); // Add stocktransactions to the dependency array


    // Prepare data for Chart.js
    const chartData = {
        labels: stockData.map(item => item.date),
        datasets: [
            {
                label: 'Stock Value',
                data: stockData.map(item => item.value),
                fill: true, // Enable filling area under the line
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color of the filled area
                borderColor: 'rgba(75, 192, 192, 1)', // Color of the line
                tension: 0.1, // Smooth line
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allow the chart to maintain aspect ratio
        scales: {
            x: {
                display: false, // Hide the x-axis labels
            },
            y: {
                title: {
                    display: true,
                    text: 'Value',
                },
                beginAtZero: true, // Start the y-axis at zero
            },
        },
        plugins: {
            tooltip: {
                mode: 'index', // Show tooltip for all points at the hovered x position
                intersect: false, // Tooltip appears when hovering over the line, not the points
                callbacks: {
                    title: (tooltipItems) => {
                        // Show the date in the tooltip title
                        return tooltipItems[0].label;
                    },
                    label: (tooltipItem) => {
                        // Show the value in the tooltip
                        return `Value: ${tooltipItem.raw}`;
                    },
                },
            },
        },
    };

    return (
        <div className='container mb-5' style={{ textAlign: 'center', margin: '20px auto' }}>
            <h2 style={{ marginBottom: '10px' }}>Stock Data Chart</h2>
            <div style={{ 
                height: '60vh',  // Keep the height to 60% of the viewport height
                width: '80%', 
                margin: 'auto', 
                padding: '20px', // Add padding around the chart
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Optional: Add shadow for better visual
                borderRadius: '10px', // Optional: Rounded corners
                backgroundColor: '#fff', // Optional: Background color for the container
                position: 'relative', // Position relative to manage the chart correctly
            }}>
                <Line data={chartData} options={options} style={{ height: '100%', width: '100%' }} />
            </div>
        </div>
    );
};

export default StockChart;