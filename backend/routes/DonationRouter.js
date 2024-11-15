const router = require('express').Router();

const DonationController = require('../controllers/DonationController');

//helpers
const verifyToken = require('../helpers/veryfy-token');
const { imageUpload } = require('../helpers/image-upload');

router.post('/create', verifyToken, imageUpload.array("images"), DonationController.create);
router.get('/', DonationController.getAll )

module.exports = router