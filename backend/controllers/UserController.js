const User = require('../models/User');

module.exports = class UserController {
    static async register(req, res) {
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
    }
}
