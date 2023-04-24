const express = require("express");
const app = express();

let envelopes = []; // array to hold envelope objects
let id = 1; // variable to keep track of envelope IDs
let totalBudget = 0; // global variable to store total budget

app.use(express.json());

// create a new envelope
app.post("/envelopes", (req, res) => {
  const { title, budget } = req.body;
  if (!title || !budget) {
    res.status(400).send("Title and budget are required.");
    return;
  }
  const envelope = {
    id,
    title,
    budget,
  };
  envelopes.push(envelope);
  id++;
  res
    .status(201)
    .send(
      `Envelope ${envelope.id} created with title "${envelope.title}" and budget ${envelope.budget}.`
    );
});

// retrieve all envelopes
app.get("/", (req, res) => {
  res.send(envelopes);
});

// retrieve a specific envelope
app.get("/envelopes/:id", (req, res) => {
  const { id } = req.params;
  const envelope = envelopes.find((env) => env.id === Number(id));
  if (!envelope) {
    res.status(404).send(`Envelope ${id} not found.`);
    return;
  }
  res.send(envelope);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
