const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express()
const port = process.env.PORT ||5000;

//middle wear use
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t5mp3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect()

        const productCollection = client.db("emaJohn").collection("product");
        console.log('mongo is not working');

        //use get for data from backend
        app.get('/product',async(req,res)=>{
            console.log('query',req.query);
            const page=parseInt(req.query.page)
            const size=parseInt(req.query.size)
            const query={};
            const cursor = productCollection.find(query)
            let result;
            if(page||size){
                result = await cursor.skip(page*size).limit(size).toArray()
            }
            else{
                result = await cursor.toArray()
            }
           
            res.send(result)
        })

        app.get('/productCount',async(req,res)=>{
           
            const count = await productCollection.estimatedDocumentCount();
            res.send({count})
        })

        app.post('/productByKey',async(req,res)=>{
            const keys=req.body;
            
            const ids = keys.map(id => ObjectId(id))
            console.log(ids);
            const query = {_id:{$in:ids}}
            const cursor = productCollection.find(query)
            const product = await cursor.toArray()
            res.send(product)
            
        })

        

    }
    finally{

    }


}
run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send('Iam working')
})

app.listen(port,()=>{
    console.log('listening from ',port);
})