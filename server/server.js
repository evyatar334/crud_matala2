const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 5000;


app.use(cors());
// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud',
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database...');
});

// Define an endpoint to serve the data
app.get('/api/items', (req, res) => {
    connection.query('SELECT * FROM items', (err, results) => {
        if (err) {
            console.error('Failed to execute query:', err);
            res.status(500).json({ error: 'Failed to fetch data from database' });
            return;
        }
        res.json(results); // Respond with the data as JSON
    });
});

app.post('/api/items', (req, res) => {
    const { name, description } = req.body;
    const query = 'INSERT INTO items (name, description, created, updated, active) VALUES (?, ?, NOW(), NOW(), 1)';
    connection.query(query, [name, description], (err, result) => {
        if (err) {
            console.error('Failed to add item:', err);
            res.status(500).json({ error: 'Failed to add item' });
            return;
        }
        res.json({ message: 'Item added successfully', id: result.insertId });
    });
});


app.put('/api/items/:id', (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const query = 'UPDATE items SET name = ?, description = ?, updated = NOW() WHERE id = ?';
    connection.query(query, [name, description, id], (err) => {
        if (err) {
            console.error('Failed to update item:', err);
            res.status(500).json({ error: 'Failed to update item' });
            return;
        }
        res.json({ message: 'Item updated successfully' });
    });
});

app.delete('/api/items/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM items WHERE id = ?';
    connection.query(query, [id], (err) => {
        if (err) {
            console.error('Failed to delete item:', err);
            res.status(500).json({ error: 'Failed to delete item' });
            return;
        }
        res.json({ message: 'Item deleted successfully' });
    });
});


// Start the Express server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
