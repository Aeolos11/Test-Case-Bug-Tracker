const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET
async function register(req, res) {
    try {
        const {name, email, password } = req.body;
        const newUser = new User({
            name,
            email,
            passwordHash:password,
        });

        await newUser.save();
        return res.status(201).json({
            message: `User created. Account name: ${name} has been registered on the email: ${email}. `,
        });
    }catch(err) {
        if (err.code === 11000) {
            return res.status(409).json({error: 'User with such email already exists'});
        }
        console.error("REGISTER ERROR:", err);
        return res.status(500).json({ error: err.message });
    }
}

async function login(req, res) {
    try {
        const {email, password } = req.body;
        const existingUser = await User.findOne({ email: email })
        if (!existingUser){
            return res.status(400).json({ error: "Invalid email or password" });
        }
        const validPass = await bcrypt.compare(password, existingUser.passwordHash);
        if (!validPass){
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id:existingUser._id, role: existingUser.role},  JWT_SECRET, { expiresIn: "24h" });
        return res.json({
            token,
            user: {
                email: existingUser.email,
                name: existingUser.name,
                role: existingUser.role,
            }
        });

    }catch(err) {
        console.error(err);
        return res.status(500).json({ error: "Login failed" });
    }

}

module.exports = { register, login };