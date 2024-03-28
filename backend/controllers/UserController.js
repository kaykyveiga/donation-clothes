const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');

module.exports = class UserController {
    static async register(req, res) {

        //Validations

        const { name, email, password, confirmPassword, phone, adress } = req.body;

        function checkField(field, fieldName) {
            if (!field) {
                res.status(422).json({
                    message: `O campo ${fieldName} é obrigatório`
                });
                return false;
            }
            return true;
        }

        if (!checkField(name, 'nome') ||
            !checkField(email, 'email') ||
            !checkField(password, 'senha') ||
            !checkField(phone, 'telefone') ||
            !checkField(adress, 'endereço')) {
            return;
        }

        const userExists = await User.findOne({ email: email });

        if (userExists) {
            res.status(422).json({
                message: 'Usuário já cadastrado no sistema'
            });
            return;
        }

        if (password !== confirmPassword) {
            res.status(422).json({
                message: 'Confirmação de senha incorreta'
            });
            return;
        }

        if (password.length < 8) {
            res.status(422).json({
                message: 'A senha deve ter no mínimo 8 caracteres'
            });
            return;
        }

        function isValidPhoneNumber(phoneNumber) {
            const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
            return phoneRegex.test(phoneNumber);
        }

        if (!isValidPhoneNumber(phone)) {
            res.status(422).json({
                message: 'O número de telefone deve estar no formato (dd) xxxxx-xxxx'
            });
            return;
        }

        //Create User

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            phone,
            adress,
            password: passwordHash
        })
        try {

            const newUser = await user.save();

            createUserToken(newUser, req, res)

        } catch (err) {
            res.status(500).json({ message: err })
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;

        function checkField(field, fieldName) {
            if (!field) {
                res.status(422).json({
                    message: `O campo ${fieldName} é obrigatório`
                });
                return false;
            }
            return true;
        }

        if (!checkField(email, 'email') ||
            !checkField(password, 'senha')) {
            return;
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            res.status(422).json({
                message: 'Usuário não encontrado!'
            });
            return;
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            res.status(422).json({
                message: 'Senha inválida!'
            });
            return;
        }

        try {
            createUserToken(user, req, res)

        } catch (err) {
            res.status(500).json({ message: err })
        }

    }

    static async checkUser(req, res) {
        let cuurrentUser = false;

        if (req.headers.authorization) {
            const token = getToken(req);
            const decoded = jwt.verify(token, "registrationandlogintokensecret");

            cuurrentUser = await User.findById(decoded.id)
            cuurrentUser.password = undefined
        }

        res.status(200).send(cuurrentUser)
    }

    static async getUserByID(req, res) {
        const id = req.params.id;

        const user = await User.findById(id).select("-password")

        if (!user) {
            res.status(422).json({
                message: 'Usuário não encontrado!'
            });
            return;
        }
        res.status(200).json({ user })
    }

    static async editUser(req, res) {
        const token = getToken(req);
        const user = await getUserByToken(token);

        const { name, email, password, confirmPassword, phone, adress } = req.body;

        const userExists = await User.findOne({ email: email });

        if (user.email !== email && userExists) {
            res.status(422).json({
                message: 'Por favor, utilize outro email!'
            });
            return;
        }

        function checkField(field, fieldName) {
            if (!field) {
                res.status(422).json({
                    message: `O campo ${fieldName} é obrigatório`
                });
                return false;
            }
            return true;
        }


        if (!checkField(name, 'nome')
            ||
            !checkField(email, 'email') ||
            !checkField(password, 'senha') ||
            !checkField(phone, 'telefone') ||
            !checkField(adress, 'endereço')) {
            return;
        }

        user.name = name
        user.email = email
        user.password = password
        user.phone = phone
        user.adress = adress


        if (password !== confirmPassword) {
            res.status(422).json({
                message: 'Confirmação de senha incorreta'
            });
            return;
        }

        if (password.length < 8) {
            res.status(422).json({
                message: 'A senha deve ter no mínimo 8 caracteres'
            });
            return;
        }

        function isValidPhoneNumber(phoneNumber) {
            const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
            return phoneRegex.test(phoneNumber);
        }

        if (!isValidPhoneNumber(phone)) {
            res.status(422).json({
                message: 'O número de telefone deve estar no formato (dd) xxxxx-xxxx'
            });
            return;
        }

        try {

            const updated = await User.findOneAndUpdate(
              { _id: user._id },
              { $set: user },
              { new: true },
            )
            res.json({
              message: 'Usuário atualizado com su cesso!', 
            })
          } catch (error) {
            res.status(500).json({ message: error })
          }
    }
}
