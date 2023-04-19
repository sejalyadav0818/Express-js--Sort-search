const express = require('express');
const app = express();
const port = 3000;

// Sample data
const items = [
  { name: 'item 1', value: 10 },
  { name: 'item 2', value: 5 },
  { name: 'item 3', value: 8 },
  { name: 'item 4', value: 8 },
  { name: 'item 5', value: 10 }
];

let sortOrder = 'asc'; // Initial sort order is ascending

// Define a route to render the items sorted by name
app.get('/', (req, res) => {
  // Sort the items array based on the current sort order
  const sortedItems = items.sort((a, b) => {
    const orderFactor = sortOrder === 'asc' ? 1 : -1;
    if (a.name === b.name) {
      return orderFactor * (a.value - b.value); // sort by value if name is the same
    }
    return orderFactor * a.name.localeCompare(b.name); // sort by name otherwise
  });

  // Search the sorted items array based on the query parameter
  const query = req.query.q || ''; // Initialize query to an empty string if it is undefined
  const filteredItems = query ? sortedItems.filter(item => {
    // Combine all fields into a single string and search for the query
    const itemFields = Object.values(item).join(' ');
    return itemFields.toLowerCase().includes(query.toLowerCase());
  }) : sortedItems;

  // Render the EJS template
  res.render('index', { filteredItems: filteredItems, sortOrder, query });
});

// Define a route to toggle the sort order and redirect to the home page
app.get('/toggle-sort-order', (req, res) => {
  sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle the sort order
  res.redirect('/');
});

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
