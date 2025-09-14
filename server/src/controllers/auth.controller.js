const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/auth.model');

// async function for signup 
async function signup(req, res) {
    try{
        // send request to body with the given things
        const { name, email, password } = req.body;

        // now check if the user is already their 
        const existing = await findUserByEmail(email);
        // if exists then return error
        if (existing) return res.status(400).json({ error: 'Email already Exists' });
        // if not let move for the password

        // create password with bcrypt salt of 10 
        const passwordHash = await bcrypt.hash(password, 10);
        // now after have the name, email and password which is not already 
        // present in our db 
        // we can create the new user
        const user = await createUser({ name, email, passwordHash });

        res.status(200).json(user);
    } catch (err) {
        // catch any error and show the message to the user
        res.status(500).json({ error: err.message });
    }
}


async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);

        if (!user) return res.status(400).json({ error: 'Invalid Credentials' });
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(400).json({ error: 'Invalid Credentials' });

        
    } catch (error) {
        
    }
}

