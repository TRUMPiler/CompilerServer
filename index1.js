const express = require("express");
const axios = require("axios");
const app = express();
const cors = require('cors');
const userModal = require('./User');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongodb=require('mongodb');
app.use(express.json({limit: '50mb'}));
app.use(cors());
const bcrypt=require('bcrypt');
const URI="mongodb+srv://naishal036:jl1iVgGj8BDAMLKm@cluster0.mvn5kle.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Route to compile code by interacting with the Compiler service
app.get("/compile", async (req, res) => {
  const { language } = req.body;

  if (!language) {
    return res.status(400).send({ error: "Language and code are required." });
  }

  try {
    // Send request to the Compiler service
    const response = await axios.post("https://oryx-alive-adversely.ngrok-free.app/compile", {
      language: language
    });
  
    // Send the response from Compiler back to the client
    res.send(response.data);
  } catch (error) {
    console.error("Error communicating with Compiler service:", error.message);
    res.status(500).send({ error: "Failed to communicate with Compiler service." });
  }
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Endpoint for uploading images
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ error: "No file uploaded." });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).send({ imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error.message);
    res.status(500).send({ error: "Failed to upload image." });
  }
});

// Endpoint for submitting code
app.post("/code", async (req, res) => {
  try {
    const { code, language, userId } = req.body;

    if (!code || !language || !userId) {
      console.log(req.body);
      return res.status(403).send(false);
    }

    const id = new mongodb.ObjectId();
    const client = new mongodb.MongoClient(URI);
    await client.connect();
    const db = client.db("GG");
    const collection = db.collection("Codes");

    await collection.insertOne({ _id: id, code, language, userid: userId });

    res.status(200).send({ _id: id, result: true });
  } catch (error) {
    console.error("Error communicating with database:", error.message);
    res.status(500).send({ error: "Failed to save the code." });
  }
});

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Users
app.post('/user/registration', async (req, res) => {
  try {
      const { name, email, password, confirmPassword, image } = req.body;
      
      // Validate the required fields
      if (!name || !email || !password || !confirmPassword) {
          return res.status(400).json({ error: 'All fields are required' });
      }

      // Validate password confirmation
      if (password !== confirmPassword) {
          return res.status(400).json({ error: 'Passwords do not match' });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { name, email, password: hashedPassword, image };

      // Connect to the database and register the user
      const client = new mongodb.MongoClient(URI);
      await client.connect();
      const db = client.db("GG");

      const result = await userModal.registerUser(db, user);
      res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
  } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/user/login', async (req, res) => {
  try {
      const { email, password } = req.body;

      if (!email || !password) {
          return res.status(400).json({ error: 'Email and password are required' });
      }

      const client = new mongodb.MongoClient(URI);
      await client.connect();
      const db = client.db("GG");
      
      if (password === "GoogleLogin") {
          // If password is "GoogleLogin", check if the user exists
          const existingUser = await db.collection('Users').findOne({ email });
          
          if (!existingUser) {
              // If the user does not exist, automatically register them
              
              return res.status(401).json({ message: 'User needs to login first', userId: result.insertedId });
          } else {
              // If user exists, log them in
              return res.status(200).json({
                  success: true,
                  message: 'Login successful',
                  user: {
                      id: existingUser._id,
                      name: existingUser.name,
                      email: existingUser.email,
                      image: existingUser.image,
                  },
              });
          }
      } else {
          // Handle normal login with password
          const loginResult = await userModal.loginUser(db, email, password);
          return res.status(200).json({
              success: true,
              message: loginResult.message,
              user: loginResult.user,
          });
      }
  } catch (error) {
      console.log(error);
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
