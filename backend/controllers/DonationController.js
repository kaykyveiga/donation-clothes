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
            !checkField(color, 'cor')) {
            return;
        }

        if (!images || images.length === 0) {
            res.status(422).json({
                message: `O campo imagem é obrigatório`
            });
            return;
        }
        try {
            const token = getToken(req);
            const user = await getUserByToken(token);


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
                    adress: user.adress,
                },
            });

            images.map((image) => donation.images.push(image.filename));

            const newDonation = await donation.save();

            return res.status(201).json({
                message: 'Doação cadastrada com sucesso!',
                newDonation,
            });
        } catch (err) {

            console.error('Erro ao salvar doação:', err);
            return res.status(500).json({ message: err.message || 'Erro no servidor' });
        }
    }

    static async getAll(req, res) {
        const donations = await Donation.find().sort('-createdAt')

        res.status(200).json({
            donations: donations,
        })
    }

    static async getMyDonation(req, res) {
        try {
            const token = getToken(req);
            const user = await getUserByToken(token);

            const donations = await Donation.find({ 'user.id': user._id }).sort('-createdAt');

            if (donations.length === 0) {
                return res.status(404).json({
                    message: "Não foi possível encontrar suas doações",
                });
            }

            return res.status(200).json({
                donations,
            });
        } catch (error) {
            console.error("Erro ao buscar doações:", error);
            return res.status(500).json({
                message: "Erro no servidor. Tente novamente mais tarde.",
            });
        }
    }
    static async clothesInterestMe(req, res) {

        const token = getToken(req);
        const user = await getUserByToken(token);

        const donations = await Donation.find({ 'adopted._id': user._id }).sort('-createdAt');

        console.log("Consulta:", { 'adopted._id': user._id });
        
        console.log("Resultados:", donations);
        

        return res.status(200).json({
            donations,
        });


    }
}