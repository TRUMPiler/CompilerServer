const express = require("express");
const axios = require("axios");
const app = express();
const cors = require('cors');
const userModal = require('./User');
const noteModal = require('./Note');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongodb=require('mongodb');
app.use(express.json({limit: '50mb'}));
app.use(cors());
const bcrypt=require('bcrypt');
require('dotenv').config();
const URI=process.env.MONGODB;
const port=process.env.PORT;







// User routes
app.post("/user/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const client = new mongodb.MongoClient(URI);
        await client.connect();
        const db = client.db("GG");
        const result = await userModal.loginUser(db, email, password);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
});
app.post("/user/registration", async (req, res) => {
    const { name, email, password, confirmPassword, image } = req.body;
    try {
        const client = new mongodb.MongoClient(URI);
        await client.connect();
        const db = client.db("GG");
        const result = await userModal.registerUser(db, { name, email, password, confirmPassword, image });
        res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error registering user' });
    }
});


















// Note routes
app.post("/note/add", async (req, res) => {
    const { code, language, userId } = req.body;
    try {
        const client = new mongodb.MongoClient(URI);
        await client.connect();
        const db = client.db("GG");
        const result = await noteModal.addNote(db, { code, language, userId });
        res.status(201).json({ message: 'Note added successfully', noteId: result.insertedId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error adding note' });
    }
});
app.post("/note/update", async (req, res) => {
    const { code, language, noteId } = req.body;
    try {
        const client = new mongodb.MongoClient(URI);
        await client.connect();
        const db = client.db("GG");
        const result = await noteModal.updateNote(db, { code, language }, noteId);
        res.status(200).json({ message: 'Note updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error updating note' });
    }
});
app.post("/note/delete", async (req, res) => {
    const { noteId } = req.body;
    try {
        const client = new mongodb.MongoClient(URI);
        await client.connect();
        const db = client.db("GG");
        const result = await noteModal.deleteNote(db, noteId);
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error deleting note' });
    }
});
app.post("/note/get", async (req, res) => {
    const { noteId } = req.body;
    try {
        const client = new mongodb.MongoClient(URI);
        await client.connect();
        const db = client.db("GG");
        const result = await noteModal.getNote(db, noteId);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error getting note' });
    }
});
app.post("/note/getall", async (req, res) => {
    const { userId } = req.body;
    try {
        const client = new mongodb.MongoClient(URI);
        await client.connect();
        const db = client.db("GG");
        const result = await noteModal.getAllNotes(db, userId);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error getting notes' });
    }
});














// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});