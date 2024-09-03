const express = require('express');
const app = express();
// const port = 3000;
const path = require('path')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');

const uri = "mongodb+srv://dbUser:root123@webtest.tsp0kch.mongodb.net/?retryWrites=true&w=majority&appName=WebTest";

const corsOptions = {
  // credentials: true,
  // origin: ['http://localhost:3000', 'http://localhost:80','http://localhost:4200'] // Whitelist the domains you want to allow
};
app.use(cors(corsOptions));

const STOCK_AUTH_KEY="cngvj2hr01qhlsli9tlgcngvj2hr01qhlsli9tm0"
const POLYGON_AUTH_KEY="WjpXISozIqxT2rhr6PWVps8KZOdV6CCO"
const timeoutDuration=15000

app.use(express.static(path.join(__dirname, 'dist/web-frontend-kk')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/web-frontend-kk/index.html'));
});

// FETCH COMPANY NAMES
app.get('/companyQuery',(req,res) => {
  (async () => {
        const stock_name=req.query.stock
        if(stock_name.length==0){
          return res.status(200).json([]); 
        }
        const url=`https://finnhub.io/api/v1/search?q=${stock_name}&token=${STOCK_AUTH_KEY}`
        // console.log(url)
        const response = await fetch(url);
        const data = await response.json();
        const filter_data=[]
        // console.log(data['result'][4])
        // if(data!=null){
        //   data['result'] = [...data['result']].filter(item => item['type']==="Common Stock" && !item['displaySymbol'].includes('.'));
        // }
        // for(let i=0;i<data['result'].length;i++){
        //   if(data['result'][i].type=="Common Stock" && !data['result'][i].displaySymbol.includes(".")){
        //     filter_data.push({'ticker':data['result'][i]['displaySymbol'],'company_name':data['result'][i]['description']})
        //     // console.log(data['result'][i])
        //     // filter_data.push(`${data['result'][i]['displaySymbol']} | ${data['result'][i]['description']}`)
        //   }
        //   // filter_data.push()
        // }
        // console.log(filter_data);
        // res.status(200).json(filter_data);
        res.status(200).json(data['result']);
  })();
})


// FETCH COMPANY DETAILS
app.get('/company',(req,res) => {
  (async () => {
        // const stock_name="GM"
        const stock_name=req.query.stock
        const url=`https://finnhub.io/api/v1/stock/profile2?symbol=${stock_name}&token=${STOCK_AUTH_KEY}`
        // console.log(url)
        const response = await fetch(url);
        const data = await response.json();
        console.log(data['ticker']);
        res.status(200).json(data);
        // res.status(200).json([{"ticker":data['ticker']}]);
  })();
})

// FETCH STOCK QUOTE (PRICE)
app.get('/stockPrice',(req,res) => {
  (async () => {
        const stock_name=req.query.stock
        const url=`https://finnhub.io/api/v1/quote?symbol=${stock_name}&token=${STOCK_AUTH_KEY}`
        // console.log(url)
        const response = await fetch(url);
        const data = await response.json();
        // data['t']=convertEpochToFormattedDate(data.t)
        // console.log(data);
        res.status(200).json(data);
  })();
})

function convertEpochToFormattedDate(epoch) {
  const date = new Date(epoch * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


// FETCH COMPANY NEWS
app.get('/news',(req,res) => {
  (async () => {
        const stock_name=req.query.stock

        const today = new Date();
        const thirtyDaysBefore = new Date(today);
        thirtyDaysBefore.setDate(thirtyDaysBefore.getDate() - 30);

        const url=`https://finnhub.io/api/v1/company-news?symbol=${stock_name}&from=${getDateBefore(thirtyDaysBefore)}&to=${getDateBefore(today)}&token=${STOCK_AUTH_KEY}`
        // console.log(url)
        const response = await fetch(url);
        const data = await response.json();
        // console.log(data);
        res.status(200).json(data);
  })();
})

// FETCH COMPANY RECOMMENDATION TRENDS
app.get('/companyRecommendation',(req,res) => {
  (async () => {
        const stock_name=req.query.stock
        const url=`https://finnhub.io/api/v1/stock/recommendation?symbol=${stock_name}&token=${STOCK_AUTH_KEY}`
        console.log(url)
        const response = await fetch(url,{timeout: timeoutDuration });
        const data = await response.json();
        // console.log(data);
        res.status(200).json(data);
  })();
})


// COMPANY INSIDER SENTIMENT
app.get('/companySentiment',(req,res) => {
  (async () => {
        const stock_name=req.query.stock;
        const url=`https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${stock_name}&from=2022-01-01&token=${STOCK_AUTH_KEY}`
        console.log(url)
        const response = await fetch(url);
        const data = await response.json();
        // console.log(data);
        res.status(200).json(data);
  })();
})

// FETCH COMPANY PEERS
app.get('/companyPeers',(req,res) => {
  (async () => {
        const stock_name=req.query.stock
        const url=`https://finnhub.io/api/v1/stock/peers?symbol=${stock_name}&token=${STOCK_AUTH_KEY}`
        console.log(url)
        const response = await fetch(url);
        var data = await response.json();
        if(data!=null){
          data = [...new Set(data)].filter(item => item !==stock_name && !item.includes('.'));
        }
        
        console.log(data);
        res.status(200).json(data);
  })();
})


// FETCH COMPANY EARNINGS
app.get('/companyEarnings',(req,res) => {
  (async () => {
        const stock_name=req.query.stock
        const url=`https://finnhub.io/api/v1/stock/earnings?symbol=${stock_name}&token=${STOCK_AUTH_KEY}`
        console.log(url)
        const response = await fetch(url);
        const data = await response.json();
        // console.log(data);
        res.status(200).json(data);
  })();
})

// FETCH  STOCK CHART
// app.get('/stockCharts',(req,res) => {
//   (async () => {
//     const stock_name=req.query.stock
//     const mutipler=1
//     const timespan="hour" //"day"
//     console.log("testingd")
//     const url=`https://api.polygon.io/v2/aggs/ticker/${stock_name}/range/${mutipler}/${timespan}/${getDateBefore(1,6)}/${getDateBefore(0,0)}?adjusted=true&sort=asc&apiKey=${POLYGON_AUTH_KEY}`
//     // https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/hour/2023-01-09/2023-01-09?adjusted=true&sort=asc&apiKey=*
//     console.log(url)
//     // const response = await fetch(url,{timeout: timeoutDuration });
//     // const data = await response.json();
//     // res.status(200).json(data);
//   })
// })

function formatEpochTime(epochTime) {
  const date = new Date(epochTime * 1000); 
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

app.get('/stockcharts',(req,res) => {
  (async () => {
    const stock_name=req.query.stock

    // FETCH LAST TRADING days
    var url=`https://finnhub.io/api/v1/quote?symbol=${stock_name}&token=${STOCK_AUTH_KEY}`
    // console.log(url)
    var response = await fetch(url);
    var data = await response.json();
    const lastTradingDay = formatEpochTime(data["t"])
    // console.log(lastTradingDay)
    const previoudTradingDay=getDateBeforeParticular(data["t"])
    // console.log(previoudTradingDay)

    const mutipler=1
    const timespan="hour"
    url=`https://api.polygon.io/v2/aggs/ticker/${stock_name}/range/${mutipler}/${timespan}/${previoudTradingDay}/${lastTradingDay}?adjusted=true&sort=asc&apiKey=${POLYGON_AUTH_KEY}`
    console.log(url)
    response = await fetch(url,{timeout: timeoutDuration });
    data = await response.json();
    // for(let i=0;i<data['results'].length;i++){
    //   data['results'][i]['t']=convertToPDT(data['results'][i]['t'])
    // }
    // console.log(data['results']);
    res.status(200).json(data);
  })();
})

// function convertToPDT(epochTime) {
//   const date = new Date(epochTime * 1000);
//   const currentTimezoneOffsetInHours = date.getTimezoneOffset() / 60;
//   const pdtOffset = currentTimezoneOffsetInHours + 7;
//   const pdtDate = new Date(date.getTime() + pdtOffset * 60 * 60 * 1000);
//   return Math.floor(pdtDate.getTime() / 1000);
// }


app.get('/stockMainChart',(req,res) => {
  (async () => {
    // console.log("MAIN CGART")
    const stock_name=req.query.stock
    const today = new Date();
    const sixMonthsBefore = new Date(today);
    // sixMonthsBefore.setMonth(sixMonthsBefore.getMonth() - 6);
    sixMonthsBefore.setFullYear(sixMonthsBefore.getFullYear()-2);
    // console.log("Last",sixMonthsBefore)
    // console.log("Before",getDateBefore(sixMonthsBefore))
    // console.log("Current",today)

    const mutipler=1
    const timespan="day"
    // url='https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2023-09-26/2024-03-26?adjusted=true&sort=asc&apiKey=WjpXISozIqxT2rhr6PWVps8KZOdV6CCO'
    url=`https://api.polygon.io/v2/aggs/ticker/${stock_name}/range/${mutipler}/${timespan}/${getDateBefore(sixMonthsBefore)}/${getDateBefore(today)}/?adjusted=true&sort=asc&apiKey=${POLYGON_AUTH_KEY}`
    console.log(url)
    response = await fetch(url);
    data = await response.json();
    // // console.log(data);
    res.status(200).json(data);
  })();
})

// FETCH MARKET CLOSE OR OPEN
app.get('/marketStatus',(req,res) => {
  (async () => {
    const url=`https://finnhub.io/api/v1/stock/market-status?exchange=US&token=${STOCK_AUTH_KEY}`
    console.log(url)
    const response = await fetch(url,{timeout: timeoutDuration });
    const data = await response.json();
    // console.log(data);
    res.status(200).json(data);
  })();
})




function getDateBefore(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDateBeforeParticular(epochTime){
  const date = new Date(epochTime * 1000); 
  date.setDate(date.getDate() - 1); 

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/addWatchlist',(req,res) => {
  (async () => {
    const stock_name=req.query.stock
    await client.connect();
    const db = client.db("stocks");
    const collection = db.collection('watchlist');

    const results = await collection.insertOne({stock: stock_name});
    console.log('Stock added to Watchlists:', results);

    const stock_list = await collection.find({}).toArray();
    console.log('Stock Watchlists :', stock_list);

    // var stocks=[];
    for(let i=0;i<stock_list.length;i++){
      var url=`https://finnhub.io/api/v1/quote?symbol=${stock_list[i]['stock']}&token=${STOCK_AUTH_KEY}`
      // console.log(url)
      var response = await fetch(url,{timeout: timeoutDuration });
      var data = await response.json();

      // if(data.d <0 ){
      //   // data['color']="#e03c4d"
      //   data['up']=false
      // }
      // else if (data.d > 0){
      //   // data['color']="#339454"
      //   data['up']=true
      // }
      // else{
      //   // data['color']="black"
      //   data['up']=false
      // }

      // data['ticker']=stock_list[i]['stock'];
      stock_list[i]['c']=data['c']
      stock_list[i]['dp']=data['dp']
      stock_list[i]['d']=data['d']
      

      url=`https://finnhub.io/api/v1/stock/profile2?symbol=${stock_list[i]['stock']}&token=${STOCK_AUTH_KEY}`
      // console.log(url)
      response = await fetch(url,{ timeout: timeoutDuration });
      d = await response.json();
      // data['company_name']=d['name']
      stock_list[i]['company_name']=d['name']

      // stocks.push(data)
      // var d = await response.json();
      // console.log(d)
      // stocks[stock_list[i]['stock']]['company_name']=data['name']
      // console.log(stock_list[i]['stock'])
      // console.log(data)
      
    }
    // console.log(stocks)
    res.status(200).json(stock_list);

    // res.status(200).json(results);
    // await client.close();
  })();
})

app.get('/getWatchlist',(req,res) => {
  (async () => {
    await client.connect();
    const db = client.db("stocks");
    const collection = db.collection('watchlist');

    const stock_list = await collection.find({}).toArray();
    console.log('Stock Watchlists :', stock_list);

    // var stocks=[];
    for(let i=0;i<stock_list.length;i++){
      var url=`https://finnhub.io/api/v1/quote?symbol=${stock_list[i]['stock']}&token=${STOCK_AUTH_KEY}`
      // console.log(url)
      var response = await fetch(url,{timeout: timeoutDuration });
      var data = await response.json();

      // if(data.d <0 ){
      //   // data['color']="#e03c4d"
      //   data['up']=false
      // }
      // else if (data.d > 0){
      //   // data['color']="#339454"
      //   data['up']=true
      // }
      // else{
      //   // data['color']="black"
      //   data['up']=false
      // }

      // data['ticker']=stock_list[i]['stock'];
      stock_list[i]['c']=data['c']
      stock_list[i]['dp']=data['dp']
      stock_list[i]['d']=data['d']
      

      url=`https://finnhub.io/api/v1/stock/profile2?symbol=${stock_list[i]['stock']}&token=${STOCK_AUTH_KEY}`
      // console.log(url)
      response = await fetch(url,{ timeout: timeoutDuration });
      d = await response.json();
      // data['company_name']=d['name']
      stock_list[i]['company_name']=d['name']

      // stocks.push(data)
      // var d = await response.json();
      // console.log(d)
      // stocks[stock_list[i]['stock']]['company_name']=data['name']
      // console.log(stock_list[i]['stock'])
      // console.log(data)
      
    }
    // console.log(stocks)
    res.status(200).json(stock_list);
    // await client.close();
  })();
})

app.get('/emptyWatchlist',(req,res) => {
  (async () => {
    await client.connect();
    const db = client.db("stocks");
    const collection = db.collection('watchlist');

    const count = await collection.countDocuments();
    if(count === 0){
      // console.log(' Check Watchlists:', results);
      res.status(200).json({"status":"empty"});
    }else{
      // console.log('Check Watchlists:', results);
      res.status(200).json({"status":"something"});
    }
    // await client.close();
  })();
})



app.get('/checkWatchlist',(req,res) => {
  (async () => {
    const stock_name=req.query.stock
    await client.connect();
    const db = client.db("stocks");
    const collection = db.collection('watchlist');

    const query = { stock: stock_name };
    const results = await collection.findOne(query);
    // if (results) {
    //   console.log('Stock Watchlist found:', results);
    //   // res.status(200).json(results);
    // } else {
    //   console.log('Stock Watchlist not found');
    //   // res.status(200).json(results)
    // }
    if(results==null){
      console.log('Stock not there in Watchlists:', results);
      return res.status(200).json(false)
    }
    else{
      console.log('Stock is there in Watchlists:', results);
      return res.status(200).json(true)
    }
    // await client.close();
  })();
})

// app.get('findWatchlist',(req,res) => {
//   (async () => {
//     const stock_name=req.query.stock
//     await client.connect();
//     const db = client.db("stocks");
//     const collection = db.collection('watchlist');

//     const query = { stock: stock_name };
//     const results = await collection.findOne(query);
//     // const results = await collection.deleteOne({ stock: stock_name});
//     console.log('Stock Removed from Watchlist', results);
//     res.status(200).json(results);
//   })();
// })


app.get('/delWatchlist',(req,res) => {
  (async () => {
    const stock_name=req.query.stock
    await client.connect();
    const db = client.db("stocks");
    const collection = db.collection('watchlist');

    const results = await collection.deleteOne({ stock: stock_name});
    console.log('Stock Removed from Watchlist', results);

    const stock_list = await collection.find({}).toArray();
    console.log('Stock Watchlists :', stock_list);

    // var stocks=[];
    for(let i=0;i<stock_list.length;i++){
      var url=`https://finnhub.io/api/v1/quote?symbol=${stock_list[i]['stock']}&token=${STOCK_AUTH_KEY}`
      // console.log(url)
      var response = await fetch(url,{timeout: timeoutDuration });
      var data = await response.json();

      // if(data.d <0 ){
      //   // data['color']="#e03c4d"
      //   data['up']=false
      // }
      // else if (data.d > 0){
      //   // data['color']="#339454"
      //   data['up']=true
      // }
      // else{
      //   // data['color']="black"
      //   data['up']=false
      // }

      // data['ticker']=stock_list[i]['stock'];
      stock_list[i]['c']=data['c']
      stock_list[i]['dp']=data['dp']
      stock_list[i]['d']=data['d']
      

      url=`https://finnhub.io/api/v1/stock/profile2?symbol=${stock_list[i]['stock']}&token=${STOCK_AUTH_KEY}`
      // console.log(url)
      response = await fetch(url,{ timeout: timeoutDuration });
      d = await response.json();
      // data['company_name']=d['name']
      stock_list[i]['company_name']=d['name']

      // stocks.push(data)
      // var d = await response.json();
      // console.log(d)
      // stocks[stock_list[i]['stock']]['company_name']=data['name']
      // console.log(stock_list[i]['stock'])
      // console.log(data)
      
    }
    // console.log(stocks)
    res.status(200).json(stock_list);


    // res.status(200).json(results);
    // await client.close();
  })();
})


app.get('/getWalletAmount',(req,res) => {
  // console.log("Wallet - ",results.money)
  (async () => {
    await client.connect();
    const db = client.db("stocks");
    const collection = db.collection('wallet');
    const documentId="65ed73ba0553ef35570beb41"
    const results = await collection.findOne();
    console.log("Wallet - ",results.money)
    res.status(200).json(results.money);
    // await client.close();
  })();
})


app.get('/updateWalletAmount',(req,res) => {
  (async () => {
    const amount=parseFloat(req.query.amount)
    await client.connect();
    const db = client.db("stocks");
    const collection = db.collection('wallet');
    // const results = await collection.findOne();

    if(amount > 0){
      const result = await collection.updateOne(
        { type: "wallet" },
        { $inc: { money:amount } }
      );
    }
    else{
      const result = await collection.updateOne(
        { type: "wallet" },
        { $inc: { money:-amount } }
      );
    }
    
    console.log("Wallet - ",results.money)
    res.status(200).json(results);
    // await client.close();
  })();
})


app.get('/addPortfolio',(req,res) => {
  (async () => {
    const stock_name=req.query.stock
    var price = parseFloat(req.query.price)
    var quantity = parseFloat(req.query.quantity)
    var company_name=req.query.name

    // console.log(stock_name)
    // console.log(price)

    await client.connect();
    const db = client.db("stocks");
    const portfolioCollection = db.collection('portfolio');
    const walletCollection = db.collection('wallet');

    var query = { stock: stock_name };
    var results = await portfolioCollection.findOne(query);
    var update_val = {
      $inc:{
        quantity: quantity,
        price: price,
      }
    }

    if(results==null){
      results = await portfolioCollection.insertOne({
        stock: stock_name,
        price: price,
        quantity: quantity,
        company: company_name});
        console.log('Stock Add into Portoflio', results);
    }
    else{
      results = await portfolioCollection.updateOne(query, update_val);
    }

    results = await walletCollection.updateOne(
      { type: "wallet" },
      { $inc: { money:-1*price } }
    );
    
    
    res.status(200).json(results);
    // await client.close();
  })();
})

app.get('/getStockPortfolio',(req,res) => {
  (async () => {
    const stock_name=req.query.stock
    await client.connect();
    const db = client.db("stocks");
    const collection = db.collection('portfolio');
    

    var query = { stock: stock_name };
    // console.log(query)
    var results = await collection.findOne(query);
    // console.log(results)
    if(results==null){
      results={
        'stock': '',
        'price': 0,
        'quantity': 0,
        'company': ''
      }
    }
    console.log('Stock from Portfolio', results);
    res.status(200).json(results);
    // await client.close();
  })();
})

app.get('/delPortfolio',(req,res) => {
  (async () => {
    const stock_name=req.query.stock
    var price = parseFloat(req.query.price)
    var quantity = parseFloat(req.query.quantity)
    await client.connect();
    const db = client.db("stocks");
    const collection = db.collection('portfolio');
    const walletCollection = db.collection('wallet');

    var query = { stock: stock_name };
    // var results = await collection.findOne(query);
    var update_val = {
      $inc:{
        quantity: -quantity,
        price: -price,
      }
    }
    await collection.updateOne(query, update_val);
    
    
    var results=await collection.findOne(query);
    if(results.quantity <=0 ){
      await collection.deleteOne({ stock: stock_name});
    }

    await walletCollection.updateOne(
      { type: "wallet" },
      { $inc: { money:1*price } }
    );

    console.log('Stock Removed from Portfolio', results);
    res.status(200).json(results);
    // await client.close(); 
  })();
})


app.get('/getPortfolio',(req,res) => {
  (async () => {
    await client.connect();
    const db = client.db("stocks");
    const collection = db.collection('portfolio');
    
    const stock_list = await collection.find({}).toArray();
    // console.log('Portfolio', stock_list);

    var pf=[]
    // console.log(stock_list)
    for(let i=0;i<stock_list.length;i++){
      const url=`https://finnhub.io/api/v1/quote?symbol=${stock_list[i]["stock"]}&token=${STOCK_AUTH_KEY}`
      const response = await fetch(url,{timeout: timeoutDuration });
      const price = await response.json();
      
      // var stock_up="F";
      // var color = "#e03c4d"
      // var change = price["c"].toFixed(2) - ((stock_list[i]["price"]/stock_list[i]["quantity"])).toFixed(2)
      // if(change > 0){
      //   stock_up="T"
      //   color="#339454"
      //   change=1*change
      // }
      // else if(change==0){
      //   color="black"
      //   stock_up="S"
      //   change=Math.abs(change)
      // }
      // pf.push({
      //   "ticker":stock_list[i]["stock"],
      //   "quantity":stock_list[i]["quantity"],
      //   "cost":stock_list[i]["price"],
      //   "avg": stock_list[i]["price"]/stock_list[i]["quantity"],
      //   // "change": (stock_list[i]["price"]/stock_list[i]["quantity"]) - price["c"],
      //   "change": change,
      //   "current": price["c"],
      //   "market": price["c"]*stock_list[i]["quantity"],
      //   "stock_up":stock_up,
      //   "color":color,
      //   "name":stock_list[i]["company"],
      //   "refresh":"Yes"
      // })
      market_val = price["c"]*stock_list[i]["quantity"];
      bought_val = (stock_list[i]["price"]/stock_list[i]["quantity"])*stock_list[i]["quantity"]
      pf.push({
        "ticker":stock_list[i]["stock"],
        "quantity":stock_list[i]["quantity"],
        "cost":stock_list[i]["price"],
        // "avg": stock_list[i]["price"]/stock_list[i]["quantity"],
        // "change": (stock_list[i]["price"]/stock_list[i]["quantity"]) - price["c"],
        "change": (market_val-bought_val),
        // "current": price["c"],
        "market": price["c"]*stock_list[i]["quantity"],
        "change_per": (((market_val-bought_val)/(stock_list[i]["price"]))*100),
        // "stock_up":stock_up,
        // "color":color,
        "name":stock_list[i]["company"],
        // "refresh":"Yes"
      })
    }
    console.log("Stock portofolio details",pf)
    res.status(200).json(pf);
    // await client.close();
  })();
})

app.get('/emptyPortfolio',(req,res) => {
  (async () => {
    await client.connect();
    const db = client.db("stocks");
    const collection = db.collection('portfolio');

    const count = await collection.countDocuments();
    console.log('Stock in Portfolio:', count);
    if(count === 0){
      res.status(200).json("empty");
    }else{
      // console.log('Stock added to Watchlists:', results);
      res.status(200).json("non-empty");
    }
    // await client.close();
  })();
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});



// run().catch(console.dir);