const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DB_PATH;   

let client = new MongoClient(uri, { useNewUrlParser: true });
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

app.get('/fruits/banana', (req, res) => {
    res.send({fruit:"banana", price: 20, quantity:1000});
})

app.get('/users/:id', (req, res) =>{
    const id = req.params.id;
    const name = users[id];
    res.send({id, name});
} )


app.get('/products', (req, res) => {
     client = new MongoClient(uri, { useNewUrlParser: true });
     client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({name:'laptop'}).limit(5).toArray((err, documents) =>{
            
            if(err){
                console.log(err);
                res.status(500).send({message:err});
            }
            else{
                res.send(documents);
            }
        });
        client.close();
      });
    

})


// post
app.post('/addProduct', (req, res) => {
    //console.log('data received', req.body);

    // save to database
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.insertOne(product, (err, result) =>{
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

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Listening to port 4000'));
