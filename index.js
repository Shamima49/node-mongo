const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DB_PATH;   

let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const users = ['asad', 'sohana', 'rehana', 'selina', 'rohan', 'halim', 'nasir'];




// function rootCall(req, res){
//     res.send('Thank you very much')
// app.get('/', rootCall)
// const rootCall = (req, res) =>res.send('Thank you very much');

// app.get('/', (req, res) =>{
//     res.send("Thank you for calling me")
// })


// app.get('/', (req, res) => {
//     const fruit = {
//         "product":"ada",
//         "price":220           
//               }
//               res.send(fruit);

//})

// app.get('/fruits/banana', (req, res) => {
//     res.send({fruit:"banana", price: 20, quantity:1000});
// })


app.get('/products', (req, res) =>{
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find().toArray((err, documents)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(documents);
            }
        });
        //client.close();
      });
});

// app.get('/products', (req, res) => {
//     client = new MongoClient(uri, { useNewUrlParser: true });
//     client.connect(err => {
//        const collection = client.db("onlineStore").collection("products");
//        collection.find({key}).toArray((err, documents) =>{
           
//            if(err){
//                console.log(err);
//                res.status(500).send({message:err});
//            }
//            else{
//                res.send(documents);
//            }
//        });
//        //client.close();
//      });
// })  

app.get('/product/:key', (req, res) =>{
    const key = req.params.key;

    client = new MongoClient(uri, { useNewUrlParser: true });
     client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({key}).toArray((err, documents) =>{
            
            if(err){
                console.log(err);
                res.status(500).send({message:err});
            }
            else{
                res.send(documents[0]);
            }
        });
        client.close();
      });
 });
app.post('/getProductsByKey', (req, res) =>{
    const key = req.params.key;
    const productKeys = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({key: { $in: productKeys }}).toArray((err, documents)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(documents);
            }
        });
        //client.close();
      });
});

// post
app.post('/addProduct', (req, res) => {
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.insert(product, (err, result) =>{
            if(err){
                console.log(err);
                res.status(500).send({message:err});
            }
            else{
                res.send(result.ops[0]);
            }
        });
        client.close();
      });
    
})

app.post('/placeOrder', (req, res) => {
    const orderDetails = req.body;
    orderDetails.orderTime = new Date();
    console.log(orderDetails);
    
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("orders");
        collection.insertOne(orderDetails, (err, result) =>{
            if(err){
                console.log(err);
                res.status(500).send({message:err});
            }
            else{
                res.send(result.ops[0]);
            }
        });
        client.close();
      });
    
})

const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Listening to port 5000'));
