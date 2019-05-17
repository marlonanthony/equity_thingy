const { RESTDataSource } = require('apollo-datasource-rest') 
const keys = require('../config/keys_dev')

class EquityAPI extends RESTDataSource {
    constructor() {
        super() 
        this.baseURL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=${keys.alphaVantageAPIKey}`
    }

    async getEquity() {
        const response = await this.get('equity') 
        return Array.isArray(response) 
            ? this.equityReducer(response[0])
            : [] 
    }

    equityReducer(equity) {
        return {
            id: 
        }
    }
}

module.exports = EquityAPI