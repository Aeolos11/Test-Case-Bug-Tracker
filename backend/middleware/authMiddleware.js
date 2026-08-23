const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

function verifyToken(req, res, next){
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({ message: "Missing token" });
    }

    try {
        const verifyedToken = jwt.verify(token, JWT_SECRET);
        req.user = verifyedToken;
        next();


    }catch(err){
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = verifyToken;
