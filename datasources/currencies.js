const { RESTDataSource } = require('apollo-datasource-rest') 
const keys = require('../config/keys_dev')

class CurrencyAPI extends RESTDataSource {
    constructor() {
        super() 
        this.baseURL = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=EUR&to_currency=USD&apikey=${keys.alphaVantageAPIKey}`
        // const equityData = res.data['Realtime Currency Exchange Rate']
    }

    async getCurrencyPair() {
        const response = await this.get('') 
        console.log(response) 
        // return response['Realtime Currency Exchange Rate']
        // return Array.isArray(response) 
        //     ? this.equityReducer(response[0])
        //     : [] 
    }
}

module.exports = CurrencyAPI