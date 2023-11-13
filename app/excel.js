const cron = require('node-cron');
var xlsx = require('xlsx');
var Excel = require('exceljs');
var algomojoConfig = require('./../algomojo.config.json');

var currentRunningBuyScript = null;
var currentRunningSellScript = null;


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
    if(currentRunningBuyScript !== scriptData['Trading Symbol']) {
        console.log(JSON.stringify(scriptData));
    }
    currentRunningBuyScript = scriptData['Trading Symbol'];
}

/**
 * Sell Script
 */
const sellScript = (scriptData) => {
    if(currentRunningSellScript !== scriptData['Trading Symbol']) {

    }
    currentRunningSellScript = scriptData['Trading Symbol'];
}

/**
 * Starts All Cron Tasks
 */
const startCronTasks = () => {

    cron.schedule('*/1 * * * * *', async () => {
        console.log('--- RUNNING SCRIPT FOR EVERY 1 SECOND ---');
        var path = require('path');
        var filePath = path.resolve('./excel-files/','');
        const sourceFileName = '1.Abstract.xlsx';
        const excelData = await readExcelFile(filePath, sourceFileName);
        // console.log(`Result: ${JSON.stringify(excelData)}`);
        excelData.forEach(data => {
            console.log(data['Trading Symbol']); // Sell Side
            if (data['Sell Side'] === 'S') {
                sellScript(data);
            } else {
                buyScript(data);
            }
        });
    });
}

module.exports = {
    startCronTasks,
  };