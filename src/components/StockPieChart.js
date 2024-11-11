import React, { useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { StockContext } from '../context/StockContext';

const StockPieChart = () => {
    const { stocks } = useContext(StockContext); // Access stocks from context

    // Prepare data for Doughnut Chart
    const chartData = {
        labels: stocks.map(stock => stock.symbol),
        datasets: [
            {
                label: 'Investment Value',
                data: stocks.map(stock => stock.quantity * stock.price), // Calculate value
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                ],
                hoverBackgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                ],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
            },
        },
    };

    return (
        <div style={{ width: '50%', margin: 'auto', height: '50vh' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Holdings Distribution</h3>
            <Doughnut data={chartData} options={options} />
        </div>
    );
};

export default StockPieChart;