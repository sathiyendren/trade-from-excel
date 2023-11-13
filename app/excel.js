const cron = require('node-cron');
var xlsx = require('xlsx');
var Excel = require('exceljs');
var algomojoConfig = require('./../algomojo.config.json');

var currentRunningScript = null;


/**
 * Read Excel File
 */
const readExcelFile = async (path, filePath) => {
    try {
        const file = xlsx.readFile(`${path}/${filePath}`);
        let data = []
        const sheets = file.SheetNames
        for (let i = 0; i < sheets.length; i++) {
            const temp = xlsx.utils.sheet_to_json(
                file.Sheets[file.SheetNames[i]])
            temp.forEach((res) => {
                data.push(res)
            })
        }
        return data;
    }
    catch (err) {
        console.log(err);
    }
};

/**
 * Buy Script
 */
const buyScript = (scriptData) => {
    const quantity = scriptData['Qty']
    const price = scriptData['Ask Rate']
    const tradingSymbol = scriptData['Symbol']
    console.log(`BUY :::  ${tradingSymbol} for  ${quantity} Qunatity at Rs. ${price} `);

    currentRunningScript = scriptData;

}

/**
 * Sell Script
 */
const sellScript = (scriptData) => {
    const quantity = scriptData['Qty']
    const price = scriptData['BID Rate']
    const tradingSymbol = scriptData['Symbol']
    console.log(`SELL :::  ${tradingSymbol} for Qunatity ${quantity} at Rs. ${price}`);

    currentRunningScript = null;
}

/**
 * Starts All Cron Tasks
 */
const startCronTasks = () => {

    cron.schedule('*/1 * * * * *', async () => {
        console.log('--- RUNNING SCRIPT FOR EVERY 1 SECOND ---');
        var path = require('path');
        var filePath = path.resolve('./excel-files/', '');
        const sourceFileName = '1.Abstract.xlsx';
        const excelData = await readExcelFile(filePath, sourceFileName);
        // console.log(`Result: ${JSON.stringify(excelData)}`);
        excelData.forEach(data => {
            if (!currentRunningScript) {
                buyScript(data);
            } else if (data['Symbol' !== currentRunningScript['Symbol']]) {
                if (currentRunningScript) {
                    sellScript(currentRunningScript);
                }
                buyScript(data);
            }

        });
    });
}

module.exports = {
    startCronTasks,
};