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

// update a specific envelope
app.patch("/envelopes/:id", (req, res) => {
  const { id } = req.params;
  const envelope = envelopes.find((env) => env.id === Number(id));
  if (!envelope) {
    res.status(404).send(`Envelope ${id} not found.`);
    return;
  }
  const { title, budget, value } = req.body;
  if (title) {
    envelope.title = title;
  }
  if (budget) {
    envelope.budget = budget;
  }
  if (value) {
    if (envelope.budget < value) {
      res
        .status(400)
        .send(
          `Cannot extract more than the budget. Current budget: ${envelope.budget}`
        );
      return;
    }
    envelope.budget -= value;
  }
  res.send(`Envelope ${id} updated.`);
});

// delete a specific envelope
app.delete("/envelopes/:id", (req, res) => {
  const { id } = req.params;
  const index = envelopes.findIndex((env) => env.id === Number(id));
  if (index === -1) {
    res.status(404).send(`Envelope ${id} not found.`);
    return;
  }
  envelopes.splice(index, 1);
  res.send(`Envelope ${id} deleted.`);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
