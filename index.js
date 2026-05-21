const express = require("express");
const app = express();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const cors = require("cors");
const { jwtVerify, createRemoteJWKSet } = require("jose-cjs");
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
// key set
const JWKS = createRemoteJWKSet(new URL(`http://localhost:3000/api/auth/jwks`));

// middleware
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  }
  console.log(token);
  // verify JWKS
  try {
    const { payload } = await jwtVerify(token, JWKS);
    next();
    console.log(payload);
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("medFlex");
    const doctorCollection = db.collection("doctors");
    const appointmentCollection = db.collection("appointments");
    // ********

    // test root /
    app.get("/", (req, res) => {
      res.send("Hello Yeamin! i'm database connected 🖕🏽 don't touch me!");
    });

    // get top 3 doctors by rating
    app.get("/doctors", async (req, res) => {
      try {
        const doctors = await doctorCollection
          .find()
          .sort({ rating: -1 })
          .limit(3)
          .toArray();

        res.send(doctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).send("Internal Server Error");
      }
    });
    // all-appointments
    app.get("/all-appointments", async (req, res) => {
      try {
        const allDoctors = await doctorCollection.find().toArray();

        res.send(allDoctors);
      } catch (error) {
        console.error("Error fetching all appointments:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // get a single data by id
    app.get("/all-appointments/:id", verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await doctorCollection.findOne(query);

        res.send(result);
      } catch (error) {
        console.error("Error fetching appointment by ID:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // _+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+ APPOINTMENTS API  _+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+
    // post appointment
    app.post("/appointments", verifyToken,async (req, res) => {
      const appointment = req.body;
      console.log("new appointment inserted", appointment);
      const result = await appointmentCollection.insertOne(appointment);
      res.send("result");
    });
    // get booked appointments
    app.get("/appointments/:userId",verifyToken, async (req, res) => {
      const userId = req.params.userId;
      const query = { userId: userId };

      const data = await appointmentCollection.find(query).toArray();
      res.send(data);
    });

    // delete an booked appointment
    app.delete("/appointments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await appointmentCollection.deleteOne(query);
      console.log("after delete from api", result);

      res.send(result);
    });

    // update an appointment
    app.patch("/appointments/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      const appointmentInfo = req.body;
      console.log("appointment info from api", appointmentInfo);
      const updateAppointment = {
        $set: {
          ...appointmentInfo,
        },
      };

      const result = await appointmentCollection.updateOne(
        filter,
        updateAppointment,
      );
      console.log("after update from api", result);

      res.send(result);
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
