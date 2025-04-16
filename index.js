const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Route to compile code by interacting with the Compiler service
app.get("/compile", async (req, res) => {
  const { language } = req.body;

  if (!language) {
    return res.status(400).send({ error: "Language and code are required." });
  }

  try {
    // Send request to the Compiler service
    const response = await axios.post("http://localhost:5000/compile", {
      language: language
    });
  
    // Send the response from Compiler back to the client
    res.send(response.data);
  } catch (error) {
    console.error("Error communicating with Compiler service:", error.message);
    res.status(500).send({ error: "Failed to communicate with Compiler service." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
