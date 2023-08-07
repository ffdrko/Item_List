const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static('Public'))

// Parse incoming request bodies in a middleware
app.use(bodyParser.urlencoded({ extended: true }));

const DATABASE_URL = 'mongodb://localhost:27017/ItemInfo'; // 

// Connect to MongoDB using Mongoose
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Define the schema for the item
const itemSchema = new mongoose.Schema({
  category: String,
  title: String,
  description: String,
  active: Boolean,
  createdTime: String,
});

// Create the Mongoose model for the item
const Item = mongoose.model('Item', itemSchema);

// GET route to render the Item Add form
app.get('/item/add', (req, res) => {
  
  const categories = ['Category 1', 'Category 2', 'Category 3'];

  res.render('item-add', { categories });
});

// POST route to handle form submission and create a new item
app.post('/item/add', (req, res) => {
  const newItem = new Item({
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    active: req.body.active === 'on', // Checkbox value will be 'on' if checked
    createdTime: new Date().toISOString(),
  });

  // Save the new item to the database
  newItem.save()
    .then(() => {
      console.log('Item added to the database');
      res.redirect('/item/add');
    })
    .catch((err) => {
      console.error('Error saving item to the database:', err);
      res.redirect('/item/add');
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
