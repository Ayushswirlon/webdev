import express from "express";

const app = express();

const port = 3000;

app.use(express.json());

let teaData = [];
let nextId = 1;

//tea creation
app.post("/teas", (req, res) => {
  const { name, price } = req.body;
  let teaName = { id: nextId++, name, price };
  teaData.push(teaName);
  res.status(201).send(teaName);
});

//tea list
app.get("/teas", (req, res) => {
  res.status(200).send(teaData);
});

//tea search
app.get("/teas/:id", (req, res) => {
  const teaObj = teaData.find((t) => t.id === parseInt(req.params.id));
  if (!teaObj) {
    return res.status(404).send("tea not found");
  }
  res.status(200).send(teaObj);
});

//update tea

app.put("/teas/:id", (req, res) => {
  const teaId = req.params.id;
  const tea = teaData.find((t) => t.id === parseInt(teaId));
  if (!tea) {
    res.status(404).send("tea not found");
  }
  const { name, price } = req.body;
  tea.name = name;
  tea.price = price;
  res.status(200).send(tea);
});

//delete tea

app.delete("/teas/:id", (req, res) => {
  const teaId = req.params.id;
  teaData = teaData.filter((t) => t.id !== parseInt(teaId));
  return res.status(203).send(teaData);
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
