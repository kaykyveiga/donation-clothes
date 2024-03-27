const jwt = require('jsonwebtoken');

const createUserToken = (user, req, res) => {
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, "registrationandlogintokensecret")

    res.status(200).json({
        message: "Auntenticado!",
        token: token,
        userId: user._id,
    })
}

module.exports = createUserToken;