import express, { Request, Response } from "express";

interface Envelope {
  id: number;
  title: string;
  budget: number;
}

let envelopes: Envelope[] = []; // array to hold envelope objects
let id = 1; // variable to keep track of envelope IDs
let totalBudget = 0; // global variable to store total budget

const app = express();
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

// transfer budgets from different envelopes
app.post("/envelopes/transfer/:from/:to", (req, res) => {
  const { from, to } = req.params;
  const amount = req.headers.amount;

  if (!amount || isNaN(amount) || amount <= 0) {
    res.status(400).send("Invalid or missing transfer amount.");
    return;
  }
  if (!from || !to || envelopes.length < 1) {
    res.status(400).send("Invalid or missing envelope name");
    return;
  }
  const fromEnvelope = envelopes.find(
    (env) => env.title.toLowerCase() === from.toLowerCase()
  );
  const toEnvelope = envelopes.find(
    (env) => env.title.toLowerCase() === to.toLowerCase()
  );
  if (!fromEnvelope || !toEnvelope) {
    res.status(404).send("One or both of the envelopes does not exist.");
    return;
  }
  if (Number(fromEnvelope.budget) < amount) {
    res
      .status(400)
      .send(
        `Cannot transfer more than the budget. Current budget of envelope "${fromEnvelope.title}": ${fromEnvelope.budget}.`
      );
    return;
  }
  toEnvelope.budget = Number(toEnvelope.budget) + Number(amount);
  fromEnvelope.budget = Number(fromEnvelope.budget) - Number(amount);
  res
    .status(200)
    .send(
      `Transferred ${amount} from envelope ${fromEnvelope.title} to envelope ${toEnvelope.title}. Updated budgets: ${fromEnvelope.title}: ${fromEnvelope.budget}, ${toEnvelope.title}: ${toEnvelope.budget}`
    );
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
