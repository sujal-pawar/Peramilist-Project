import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host : "localhost",
  database: "permalist",
  password: "123456",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

db.query(
  "CREATE TABLE IF NOT EXISTS items (id SERIAL PRIMARY KEY, title VARCHAR(100))"
);  

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM items ORDER BY id ASC")
  items = result.rows

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {

  const value = req.body.newItem;

  await db.query("INSERT INTO items (title) VALUES ($1)",[value])
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId
  const value = req.body.updatedItemTitle
  try{
    await db.query("UPDATE items SET title = $1 WHERE id = $2",[value,id])
    res.redirect("/")
  }catch{
    console.error("Error updating :",error);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId
  try {
    await db.query("DELETE FROM items WHERE id = $1",[id])
    res.redirect("/")
  }catch{
    console.error("Error updating :",error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});