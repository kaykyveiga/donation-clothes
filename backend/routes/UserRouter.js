const router = require('express').Router();

const UserController = require('../controllers/UserController');

//Helpers
const verifyToken = require('../helpers/veryfy-token');
const { imageUpload } = require('../helpers/image-upload');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/checkuser', UserController.checkUser);
router.get('/:id', UserController.getUserByID);
router.patch('/edit/:id', verifyToken, imageUpload.single("image"), UserController.editUser);

module.exports = router