const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongo connection

const uri =
  "mongodb+srv://project-manager:Qsc16GUqGq4Wbrjm@cluster0.zynq1cd.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    // create a collection---
    const bookCollection = client.db("bookManager").collection("books");

    // inserting data
    app.post("/upload-book", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await bookCollection.insertOne(data);
      res.send(result);
    });

    // get data from collection
    app.get("/all-books", async (req, res) => {
      const books = bookCollection.find();
      const result = await books.toArray();
      res.send(result);
    });
    //
    // app.get("/coffee", async (req, res) => {
    //   const cursor = coffeeCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });
    app.get("/all-books/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookCollection.findOne(query);
      res.send(result);
    });

    // update data
    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBookData = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          ...updatedBookData,
        },
      };
      const result = await bookCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // delete data from collection
    app.delete("/book/:id", async (req,res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      const result = await bookCollection.deleteOne(filter);
      res.send(result);
    });



    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("project manager is working");
});

app.listen(port, () => {
  console.log(`project manger is working on port ${port}`);
});
