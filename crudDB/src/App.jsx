import { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [description, setDescription] = useState('');

  // Fetch data from the API
  useEffect(() => {
      fetchItems();
  }, []);

  const fetchItems = () => {
      axios
          .get('http://localhost:5000/api/items')
          .then((response) => setItems(response.data))
          .catch((error) => console.error('Error fetching items:', error));
  };

  const handleAdd = () => {
      const newItem = {
          name: selectedItem,
          description,
      };
      axios
          .post('http://localhost:5000/api/items', newItem)
          .then(() => {
              alert('Item added successfully');
              fetchItems();
          })
          .catch((error) => console.error('Error adding item:', error));
  };

  const handleUpdate = () => {
      const selectedId = items.find((item) => item.name === selectedItem)?.id;
      if (!selectedId) {
          alert('Select a valid item to update');
          return;
      }
      const updatedItem = {
          name: selectedItem,
          description,
      };
      axios
          .put(`http://localhost:5000/api/items/${selectedId}`, updatedItem)
          .then(() => {
              alert('Item updated successfully');
              fetchItems();
          })
          .catch((error) => console.error('Error updating item:', error));
  };

  const handleDelete = () => {
      const selectedId = items.find((item) => item.name === selectedItem)?.id;
      if (!selectedId) {
          alert('Select a valid item to delete');
          return;
      }
      axios
          .delete(`http://localhost:5000/api/items/${selectedId}`)
          .then(() => {
              alert('Item deleted successfully');
              fetchItems();
              setSelectedItem('');
              setDescription('');
          })
          .catch((error) => console.error('Error deleting item:', error));
  };

  const handleSelectChange = (e) => {
      const selectedId = e.target.value;
      const selected = items.find((item) => item.id.toString() === selectedId);
      if (selected) {
          setSelectedItem(selected.name);
          setDescription(selected.description);
      } else {
          setSelectedItem('');
          setDescription('');
      }
  };

  return (
      <div className="maincontainer">
          <h1>Animal Details</h1>
          <p>Item:</p>
          <select onChange={handleSelectChange}>
              <option value="default">Select an animal</option>
              {items.map((item) => (
                  <option key={item.id} value={item.id}>
                      {item.name}
                  </option>
              ))}
          </select>
          <br />
          <label>Item:</label>
          <br />
          <input
              type="text"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
          />
          <br />
          <label>Description:</label>
          <br />
          <textarea
              id="description"
              name="description"
              rows="4"
              cols="50"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
          />
          <div className="second-div">
              <button onClick={handleAdd}>Add</button>
              <button onClick={handleUpdate}>Update</button>
              <button onClick={handleDelete}>Delete</button>
          </div>
      </div>
  );
}

export default App;

