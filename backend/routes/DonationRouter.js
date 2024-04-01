const router = require('express').Router();

const DonationController = require('../controllers/DonationController');

//helpers
const verifyToken = require('../helpers/veryfy-token');

router.post('/create',verifyToken, DonationController.create);

module.exports = router