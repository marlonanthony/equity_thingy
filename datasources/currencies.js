const { RESTDataSource } = require('apollo-datasource-rest') 
const keys = require('../config/keys_dev')

class CurrencyAPI extends RESTDataSource {
    constructor(props) {
        super(props) 
        this.baseURL = ''
        // this.baseURL = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=EUR&to_currency=USD&apikey=${keys.alphaVantageAPIKey}`
        
    }

    async getCurrencyPair(FC='EUR', TC='USD') {
        try {
            const data = await this.get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${FC}&to_currency=${TC}&apikey=${keys.alphaVantageAPIKey}`),
              response = data['Realtime Currency Exchange Rate'],
              fromCurrency = response['1. From_Currency Code'],
              fromCurrencyName = response['2. From_Currency Name'],
              toCurrency = response['3. To_Currency Code'],
              toCurrencyName = response['4. To_Currency Name'],
              exchangeRate = response['5. Exchange Rate'],
              lastRefreshed = response['6. Last Refreshed'],
              timeZone = response['7. Time Zone'],
              bidPrice = response['8. Bid Price'],
              askPrice = response['9. Ask Price']
            return data && {
                fromCurrency,
                fromCurrencyName,
                toCurrency,
                toCurrencyName,
                exchangeRate,
                lastRefreshed,
                timeZone,
                bidPrice,
                askPrice
            }
        } catch (err) { 
            console.log(err) 
            throw err 
        }
        
        // return Array.isArray(response) 
        //     ? this.equityReducer(response[0])
        //     : [] 
    }
}

module.exports = CurrencyAPI