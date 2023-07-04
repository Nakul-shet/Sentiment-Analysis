const express = require("express");
const puppeteer = require("puppeteer");
const { BayesClassifier } = require("natural");

const Sentiment = require("sentiment");
const cheerio = require("cheerio");
const _ = require("lodash");
const axios = require("axios");
require("dotenv").config();
const cors = require("cors");

const PORT = 3001;

//MongoDB Schema
const Product = require("./models/product");
const Track = require("./models/track");

//Database connection
const db_connection = require("./database");

const app = express();

db_connection();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());
app.set("view engine" , "ejs");

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.amazon.com/',
    'Connection': 'keep-alive',
    'Cookie': 'session-id=1234567890; session-id-time=2082787201; i18n-prefs=USD; sp-cdn="L5Z9:US"; x-wl-uid=1LqS+GLSbMb1A+Zw16gr71JWCU/A4Q4Xd/K4RbGClX9z21sl0r2LrGJ+OTZwsmiv3CdBbAv0pBk=; ubid-main=123-4567890-1234567; lc-acb=abc123',
};

app.get("/" , (req , res) => {

    res.send("Welcome to the home page");
})

//-- Function to get Product ID
app.post("/getProductId" , (req , res) => {
    const productName = req.body.productName;
    
    const searchProduct = async (productName) => {
        const encodedProductName = encodeURIComponent(productName);
        const url = `https://www.amazon.in/s?k=${encodedProductName}`;
      
        try {
          const response = await axios.get(url , {headers});
          const $ = cheerio.load(response.data);
      
          // Get the link to the first search result
          const productLink = $('div[data-index="4"] h2 a').attr('href');
      
          return productLink;
        } catch (error) {
          console.error(error);
        }
      };
      
      // Example usage
      searchProduct(productName).then((productLink) => {
        console.log(`Product link: ${productLink}`);
        var str = productLink;

        const first = (str.indexOf('dp%2F') + 5);
        const string = str.substr(first , 10);
        console.log(string)
        console.log(`https://www.amazon.in/dp/${str.substr(first , 10)}`);

        const firstpro = (str.indexOf('/dp') + 4);
        const string1 = str.substr(firstpro , 10);
        console.log(string1)
        console.log(`https://www.amazon.in/dp/${str.substr(firstpro , 10)}`);

        if(string.includes("-")){
            res.send(string1)
        }else{
            res.send(string)
        }

      });
})

app.post("/product" , (req , res) => {

    const {id} = req.body;

    const result = Product.deleteMany({productID : "favicon.ico"})
    result.exec().then((err) => {
        if(!err){
            Console.log("Deleted Unwated Documents")
        }
    }).catch((err) => {
        console.log(err)
    })

    const result1 = Product.findOne({productID : id});
        result1.exec().then((foundProduct) => {
            if(foundProduct){

                res.json({result : "Data already exists" , id :  foundProduct.productID})

            }else{

                const newProduct = new Product({
                    productID : id
                })

                newProduct.save();

                const url = `https://www.amazon.in/product-reviews/${id}?pageNumber=`;

                const titleUrl = `https://www.amazon.in/dp/${id}`

                for(i=1 ; i <= 30 ; i++){

                    axios.get(`${url}${i}` , {headers})
                    .then((response) => {
                        const html = response.data;
                        const $ = cheerio.load(html);

                        $('.review-data .review-text.review-text-content span').each((i, el) => {
                            const review = $(el).text().trim();

                            const sentiment = new Sentiment();
                            let senti = "";

                            const result = sentiment.analyze(review);

                            if (result.score > 0)
                                senti = "positive"
                            else if (result.score < 0)
                                senti = "negetive"
                            else
                                senti = "neutral"
                            
                            const resultant = {
                                review : review,
                                sentiment :senti
                            }

                            const result3 = Product.findOne({productID : id})
                            result3.exec().then((foundPro) => {
                                if(foundPro){
                                    foundPro.reviews.push(resultant);
                                    foundPro.save();
                                }
                            }).catch((err) => {
                                console.log(err)
                            })

                        });
                    })
                }

            }
        })

        setTimeout(() => {
            console.log(id)
            res.json({result : "Data already exists" , id :  id})
        } , 10000)

})

app.post('/analyze' , (req , res) => {

    const query = req.body.id;

    var sentimentCounts = {
        positive: 0,
        negetive: 0,
        neutral: 0,
    };

    const result = Product.findOne({productID : query});
    result.exec().then((foundProduct) => {
        if(foundProduct){
            const toProcess = foundProduct.reviews;

            toProcess.forEach((review) => {
                sentimentCounts[review.sentiment]++;
            });
        }
    }).catch((err) => {
        console.log(err)
    })

    let status;

    const trackStatus = Track.findOne({productId : query})
    trackStatus.exec().then((found) => {
        if(found){
            status = true
        }else{
            status = false
        }
    })

    let overallSentiment = '';
    let maxCount = -1;

    for (const sentiment in sentimentCounts) {
        if (sentimentCounts[sentiment] > maxCount) {
            maxCount = sentimentCounts[sentiment];
            overallSentiment = sentiment;
        }
    }

    const productUrl = `https://www.amazon.in/dp/${query}`

    let productImage , productTitle;
    let aboutProduct = [];
    let topRev = [];

    axios.get(productUrl , {headers})
    .then((res) => {
        const html = res.data;
        const $ = cheerio.load(html);

        productTitle = $('.product-title-word-break').text();
            productImage = $('.imgTagWrapper img').attr('src');

            $('.a-unordered-list.a-vertical.a-spacing-mini .a-list-item').each((i, el) => {
                const about = $(el).text();

                aboutProduct.push(about)
            }
        );
    })

    setTimeout(() => {
         console.log(aboutProduct , productImage , productTitle);
         console.log(status)
         res.send({result : "Analyze is available" , track : status ,about : aboutProduct , title : productTitle , displayImage : productImage , sentiment: _.capitalize(overallSentiment), positive : sentimentCounts.positive , negative : sentimentCounts.negetive , neutral : sentimentCounts.neutral})
    }, 5000)
})

app.get('/getAnalysis' , (req , res) => {

    const query = req.body.id;

var sentimentCounts = {
    positive: 0,
    negetive: 0,
    neutral: 0,
};

const result = Product.findOne({productID : query});
result.exec().then((foundProduct) => {
    if(foundProduct){
        const toProcess = foundProduct.reviews;

        toProcess.forEach((review) => {
            sentimentCounts[review.sentiment]++;
        });
    }
}).catch((err) => {
    console.log(err)
})

let overallSentiment = '';
let maxCount = -1;

for (const sentiment in sentimentCounts) {
    if (sentimentCounts[sentiment] > maxCount) {
        maxCount = sentimentCounts[sentiment];
        overallSentiment = sentiment;
    }
}

const productUrl = `https://www.amazon.in/dp/${query}`

let productImage , productTitle;
let aboutProduct = [];
let topRev = [];

axios.get(productUrl , {headers})
.then((res) => {
    const html = res.data;
    const $ = cheerio.load(html);

    productTitle = $('.product-title-word-break').text();
    productImage = $('.imgTagWrapper img').attr('src');

    $('.a-unordered-list.a-vertical.a-spacing-mini .a-list-item').each((i, el) => {
        const about = $(el).text();

        aboutProduct.push(about)
    });

    const topProducts = Product.findOne({productID : query })
    topProducts.exec().then((foundProduct) => {
        if(foundProduct){
            // res.send(foundProduct)
            for(i = 0 ; i <= 10 ; i++){
                topRev.push(foundProduct.reviews[i].review);
            }
        }

        console.log(aboutProduct , productImage , productTitle);
        console.log(topRev)
        res.send({result : "Analyze is available" ,topResult : topRev ,about : aboutProduct , title : productTitle , displayImage : productImage , sentiment: _.capitalize(overallSentiment), positive : sentimentCounts.positive , negative : sentimentCounts.negetive , neutral : sentimentCounts.neutral})
    })
    .catch((err) => {
        console.log(err)
    })
})

})


app.get("/getProductHistory" , async (req , res) => {

    let productDetails = [];

    const query = Product.find({});
    query.exec().then(function(foundProduct) {
    // Callback function
        if(foundProduct){
            // console.log(foundProduct)
            const totalItems = foundProduct.length;
            
            for(i=0 ; i<totalItems ; i++){
                productDetails.push(foundProduct[i].productID)
            }
            
        }
    }).catch(function(err) {
    // Error handling
        console.log(err)
    });

    setTimeout(() => {
        // console.log(productDetails)
        res.json({details :productDetails});
    } , 2000)
})

app.post('/getReviews' , (req , res) => {

    const {productId} = req.body;

    const result = Product.findOne({productID : productId})
    result.exec().then((foundPro , err) => {
        if(!err){
            if(foundPro){
                res.send(foundPro.reviews);
            }
        }else{
            console.log(err)
        }
    })
})

app.post('/productDetails' , (req , res) => {

    const {product} = req.body;

    const productUrl = `https://www.amazon.in/dp/${product}`

    let productImage , productTitle;

    axios.get(productUrl , {headers})
    .then((res) => {
        const html = res.data;
        const $ = cheerio.load(html);

        productTitle = $('.product-title-word-break').text();
        productImage = $('.imgTagWrapper img').attr('src');
    });

    res.json({title : productTitle , image : productImage})
})

app.post('/track' , (req , res) => {

    const {Total , positive , negative , neutral , productId , threshold} = req.body;

    const productUrl = `https://www.amazon.in/dp/${productId}`

    let productImage , productTitle;

    const result = Track.findOne({productId : productId})

    result.exec().then((foundTrack , err) =>{
        if(!err){
            if(foundTrack){
                res.send("Tracked");
            }else{
                axios.get(productUrl)
                .then((res) => {
                    const html = res.data;
                    const $ = cheerio.load(html);

                    productTitle = $('.product-title-word-break').text();
                    productImage = $('.imgTagWrapper img').attr('src');

                    const newTrack = new Track({
                        productId : productId,
                        productTitle : productTitle,
                        productImage : productImage,
                        positive : Number(positive),
                        negative : Number(negative),
                        neutral : Number(neutral),
                        total : Number(Total),
                        threshold : threshold
                    })
                
                    newTrack.save();

                });
            }

            res.send("Tracked");
        }else{
            console.log(err);
        }
    })

})

app.get("/getTracked" , (req , res) => {

    const result = Track.find({});

    result.exec().then((foundTracked , err) => {
        if(!err){
            if(foundTracked){
                res.send(foundTracked)
            }
        }
    })
})

app.post("/removeTrack" , (req , res) => {

    const {productId} = req.body;

    const result = Track.deleteOne({productId : productId})

    result.exec().then((err) => {
        if(!err){
            res.send("Deleted")
        }else{
            console.log(err)
        }
    })
})


app.listen(process.env.port || PORT , () => {
    console.log(`Server is up and running in port ${PORT}`)
})