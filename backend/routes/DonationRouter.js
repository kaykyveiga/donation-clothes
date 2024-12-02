const router = require('express').Router();

const DonationController = require('../controllers/DonationController');

//helpers
const verifyToken = require('../helpers/veryfy-token');
const { imageUpload } = require('../helpers/image-upload');

router.post('/create', verifyToken, imageUpload.array("images"), DonationController.create);
router.get('/', DonationController.getAll );
router.get('/mydonations',verifyToken, DonationController.getMyDonation)
router.get('/clothesInterestMe', verifyToken, DonationController.clothesInterestMe )
router.get('/:id' , DonationController.getDonationById)
router.delete(('/delete/:id'), verifyToken, DonationController.deleteDonationById)
router.patch('/patch/:id', verifyToken, imageUpload.array('images'), DonationController.patchDonationById )

module.exports = router