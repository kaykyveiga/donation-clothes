const User = require('../models/User');
const jwt = require('jsonwebtoken')

const getUserByToken = async (token) => {
    if (!token) {
        return res.status(401).json({ message: "Token Inválido!" });
    }

    const decoded = jwt.verify(token, "registrationandlogintokensecret");
    const userId = decoded.id;
    const user = await User.findOne({ _id: userId })
    return user
}

module.exports = getUserByToken