const express = require('express');
const router = express.Router();

const  verifyToken = require('../middleware/authMiddleware')
const { register, login } = require('../controllers/authController');


router.post('/register', (req, res) => {
    register(req, res);

})

router.post('/login', (req, res) => {
    login(req, res);
})

router.get('/current-user', verifyToken, (req, res) => {
    res.json({ user: req.user });
});


module.exports = router;
