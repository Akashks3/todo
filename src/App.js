import './App.css';
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";

function App() {
  const [firstName, setFirstName] = useState(""); 
  const [lastName, setLastName] = useState("");   
  const [inputValue, setInputValue] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL"); 
  const [editIndex, setEditIndex] = useState(-1); 

  
  useEffect(() => {
    fetch("http://localhost:5000/api/todos")
      .then((response) => response.json())
      .then((data) => setInputValue(data));
  }, []);

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleInputValue = () => {
    if (!firstName && !lastName) {
      return; 
    }
    const status = firstName && lastName ? "completed" : "pending";

    if (editIndex === -1) {
      // Create a new Todo
      fetch("http://localhost:5000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName, 
          lastName,  
          status,
        }),
      })
        .then((response) => response.json())
        .then((data) => setInputValue((prevVal) => [...prevVal, data]));
    } else {
      // Update an existing Todo
      const todoId = inputValue[editIndex]._id;
      fetch(`http://localhost:5000/api/todos/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName, 
          lastName,  
          status,
        }),
      })
        .then((response) => response.json())
        .then((updatedTodo) => {
          const updatedItems = [...inputValue];
          updatedItems[editIndex] = updatedTodo;
          setInputValue(updatedItems);
          setEditIndex(-1); 
        });
    }

    setFirstName("");
    setLastName("");
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFirstName(inputValue[index].firstName); 
    setLastName(inputValue[index].lastName);   
  };

  const DeleteItem = (index) => {
    const todoId = inputValue[index]._id;
    fetch(`http://localhost:5000/api/todos/${todoId}`, {
      method: "DELETE",
    }).then(() => {
      const filteredItems = [...inputValue];
      filteredItems.splice(index, 1);
      setInputValue(filteredItems);
      setEditIndex(-1); 
    });
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredItems = inputValue.filter(
    (item) => statusFilter === "ALL" || item.status === statusFilter
  );

  return (
    <>
      <div>
        <h1>MY TODO</h1>
        <input
          type="text"
          placeholder="Name"
          value={firstName}
          onChange={handleFirstNameChange}
          className="p-1"
        />
        <input
          type="text"
          placeholder="Description"
          value={lastName}
          onChange={handleLastNameChange}
          className="p-1"
        />
        <Button variant="primary" onClick={handleInputValue} className="add">
          {editIndex === -1 ? "ADD TODO" : "Update"}
        </Button>
      </div>

      <div className="mt-3">
        <div className="first">
          <h3>MY TODO</h3>
          <h3>
            Status filter:
            <select onChange={handleStatusFilterChange} id="delete" value={statusFilter}>
              <option value="ALL">ALL</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </h3>
        </div>

        <div className="container">
          <div className="card">
            <div className="card-body">
              {filteredItems.map((item, index) => (
                <div className="cards" key={index}>
                  <h5>Name: {item.firstName}</h5> 
                  <h5>Description: {item.lastName}</h5>                   <h5>
                    Status: <span id="delete">{item.status}</span>
                  </h5>
                  <Button
                    variant="warning"
                    id="edit"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    id="delete"
                    onClick={() => DeleteItem(index)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
