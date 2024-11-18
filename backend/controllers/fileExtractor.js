const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

function extractExcelData(filePath) {
    const workbook = XLSX.readFile(filePath);

    // Assuming the data is on the first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet data to JSON format
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });


    const unrealisedStocks = [];


    let inUnrealisedSection = false;

    // Loop through each row in the data
    for (const row of data) {
        // Stop processing if we reach the disclaimer section
        if (row[0] && row[0].toString().toLowerCase().includes("disclaimer")) {
            break;
        }

        if (row.includes('Unrealised trades')) {
            inUnrealisedSection = true;
            continue;
        }

        // Skip header or total rows
        if (row[0] === "Stock name" || row[0] === "Total" || row[0] === undefined) {
            continue;
        }

        const safeValue = (value) => (value === undefined || value === null ? 'N/A' : value);

        if (inUnrealisedSection) {
            unrealisedStocks.push([
                safeValue(row[0]), // Stock Name
                safeValue(row[2]), // Quantity
                safeValue(row[3]), // Buy Date
                safeValue(row[4])  // Buy Price
            ]);
        }
    }

    return {  unrealised: unrealisedStocks };
    // realised: realisedStocks,
}

module.exports = extractExcelData;