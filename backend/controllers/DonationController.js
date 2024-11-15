const Donation = require('../models/Donation');

const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');

module.exports = class DonationController {
    static async create(req, res) {
        const { name, size, color, brand } = req.body;

        const images = req.files;

        const available = true;

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
            !checkField(size, 'tamanho') ||
            !checkField(color, 'cor')){
            return;
        }

        if (images.lenght === 0) {
            res.status(422).json({
                message: `O campo imagem é obrigatório`
            });
        }

        const token = getToken(req);
        const user = await getUserByToken(token)

        const donation = new Donation({
            name,
            size,
            color,
            brand,
            available,
            images: [],
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                adress: user.adress
            }
        })

        images.map((image) => {
            donation.images.push(image.filename)
        })

        try {
            const newDonation = await donation.save();
            res.status(201).json({
                message: 'Doação cadastrada com sucesso!',
                newDonation
            })
        } catch (err) {
            res.status(500).json({ message: err })
        }
    }
    static async getAll(req, res) {
        const donations = await Donation.find().sort('-createdAt')

        res.status(200).json({
            donations: donations,
        })
    }
}