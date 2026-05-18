const express = require("express");
const app = express();

const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
app.use(express.json());
app.use(cors());
//
//
const uri = process.env.MONGO_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("medFlex");
    const doctorCollection = db.collection("doctors");
    // ********

    // get top 3 doctors by rating
    app.get("/doctors", async (req, res) => {
      try {
        const doctors = await doctorCollection
          .find()
          .sort({ rating: -1 })
          .limit(3)
          .toArray();
        console.log(doctors);
        res.send(doctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).send("Internal Server Error");
      }
    });
    // all-appointments
    app.get("/all-appointments", async (req, res) => {
      try {
        const doctors = await doctorCollection.find().toArray();
        console.log(doctors);
        res.send(doctors);
      } catch (error) {
        console.error("Error fetching all appointments:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // ********
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
run().catch(console.dir);
