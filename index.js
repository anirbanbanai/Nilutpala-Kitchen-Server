const express = require('express')
const cors = require("cors")
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gmvhoig.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const niluCollection = client.db("NiluKitchen").collection("foodfact")
    const LoveCollection = client.db("NiluKitchen").collection("fav")
    const shopCollection = client.db("NiluKitchen").collection("shop")

    app.get("/nilufood", async (req, res) => {
      const result = await niluCollection.find().toArray();
      res.send(result)
    })

    app.post("/nilufood", async (req, res) => {
      const newItem = req.body;
      const result = await niluCollection.insertOne(newItem);
      res.send(result)
    })

    app.delete("/niludelete", async (req, res) => {
       const id = req.id;
       const result = await niluCollection.deleteOne(id);
       res.send(result)
    })

    app.delete("/fvdel/:id", async (req, res) => {
       const id = req.id;
       const result = await LoveCollection.deleteOne(id);
       res.send(result)
    })

    app.post("/fv", async(req, res)=>{
      const newItem= req.body;
      const result = await LoveCollection.insertOne(newItem);
      res.send(result)
    })
    app.post("/addcart", async(req, res)=>{
      const newItem= req.body;
      const result = await shopCollection.insertOne(newItem);
      res.send(result)
    })

    app.get("/fvr", async(req, res)=>{
      const result = await LoveCollection.find().toArray();
      res.send(result)
    })
    app.get("/addcart", async(req, res)=>{
      const result = await shopCollection.find().toArray();
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Running my kitchen!')
})

app.listen(port, () => {
  console.log(`This server running on port ${port}`)
})