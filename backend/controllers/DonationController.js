const Donation = require('../models/Donation');

const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const ObjectId = require('mongoose').Types.ObjectId

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

        const donations = await Donation.find({ 'adopter._id': user._id }).sort('-createdAt');

        console.log("Consulta:", { 'adopter._id': user._id });

        console.log("Resultados:", donations);


        return res.status(200).json({
            donations,
        });
    }

    static async getDonationById(req, res) {

        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(422).json({ message: "Id inválido!" });
        }

        const donation = await Donation.findOne({ _id: id });
        if (!donation) {
            return res.status(404).json({ message: "A doação não foi encontrada!" });
        }

        return res.status(200).json({ donation });
    }

    static async deleteDonationById(req, res) {
        const id = req.params.id;
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (!ObjectId.isValid(id)) {
            return res.status(422).json({ message: "Id inválido!" });
        }

        const donation = await Donation.findOne({ _id: id });
        if (!donation) {
            return res.status(404).json({ message: "A doação não foi encontrada!" });
        }

        if (donation.user.id.toString() !== user._id.toString()) {
            res.status(422).json({
                message: 'Você não possui permissão para deletar essa doação.'
            })
        }

        await Donation.findByIdAndDelete(id)
        res.status(200)

    }

    static async patchDonationById(req, res) {
        const id = req.params.id;
        const { name, size, color } = req.body;
    
        // Verifique se os arquivos foram recebidos
        const files = req.files;
        console.log('Arquivos recebidos:', files);
    
        if (!ObjectId.isValid(id)) {
            return res.status(422).json({ message: "Id inválido!" });
        }
    
        const donation = await Donation.findById(id);
        if (!donation) {
            return res.status(404).json({ message: "A doação não foi encontrada!" });
        }
    
        const token = getToken(req);
        const user = await getUserByToken(token);
    
        if (donation.user.id.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Você não tem permissão para alterar esta doação." });
        }
    
        if (!files || files.length === 0) {
            return res.status(422).json({ message: "É necessário enviar pelo menos uma imagem." });
        }
    
        // Atualizar os campos
        if (name) donation.name = name;
        if (size) donation.size = size;
        if (color) donation.color = color;
    
        // Adicionar novas imagens
        files.forEach((file) => {
            donation.images.push(file.filename);
        });
    
        await donation.save();
    
        return res.status(200).json({
            message: "Doação atualizada com sucesso!",
            donation,
        });
    }
    static async sheduleDonation(req, res) {
        const id = req.params.id;
        const token = getToken(req);
        const user = await getUserByToken(token);
    
        if (!ObjectId.isValid(id)) {
            return res.status(422).json({ message: "Id inválido!" });
        }
    
        const donation = await Donation.findOne({ _id: id });
        if (!donation) {
            return res.status(404).json({ message: "A doação não foi encontrada!" });
        }
    
        if (donation.user.id.equals(user._id)) {
            return res.status(422).json({
                message: `${user.name}, você não pode marcar uma visita nas suas próprias doações.`
            });
        }
    
        if (donation.adopter && donation.adopter._id.equals(user._id)) {
            return res.status(422).json({
                message: `${user.name}, você já agendou uma visita.`
            });
        }
    
        donation.adopter = {
            _id: user._id,
            name: user.name,
            image: user.images
        };
    
        await Donation.findByIdAndUpdate(id, donation);
    
        res.status(200).json({
            message: `${user.name}, sua visita foi agendada.`
        });
    }
    

        
}