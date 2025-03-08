import React, { useState } from "react";
import axios from "axios";

const GoogleMapsDirections = () => {
  const [statement, setStatement] = useState(""); // Input state
  const [response, setResponse] = useState(""); // Response state

  const getResponse = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/financial-advice", { statement });
      setResponse(res.data); // Assuming the backend sends the object as a JSON response
      console.log(res.data);
      
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("An error occurred while generating advice.");
    }
  };

  return (
    <>
      <div>
        <input
          type="text"
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          placeholder="Enter your statement"
        />
        <button onClick={getResponse}>Send Statement</button>
      </div>
      <div>
        <h3>Response:</h3>
        <pre>{JSON.stringify(response, null, 2)}</pre>
      </div>
    </>
  );
};

export default GoogleMapsDirections;




