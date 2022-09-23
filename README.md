# khapu-propine-crypto

---

## Structure

```
Project
| cast
| - timestampCast.js        
| - tokenCast.js           
| - transactionTypeCast.js
| cli
| - getPortfolio.js
| - index.js
| configs
| - cli.js
| - db.js
| - index.js
| - service.js
| db
| - portfolio.csv
| events
| - getLatestPortfolioEvent.js              
| - getPortfolioWithDateAndTokenEvent.js
| - getLatestPortfolioWithTokenEvent.js    
| - getPortfolioWithDateEvent.js
| libs
| - csv.js
| - FetchAPI.js
| - validate.js
| models
| - index.js 
| - Portfolio.js 
| views
| - portfolio.js
| propine
```
---



## Usage


* Sample cli

  ```
  node propine get

  node propine get token=ETH 

  node propine get token=ETH date=2022/09/22

  node propine get date=2022/09/22

*

