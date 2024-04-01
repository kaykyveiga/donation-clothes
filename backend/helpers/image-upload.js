const multer = require('multer');
const path = require('path');

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = ''
        if (req.baseUrl.includes('users')) {
            folder = 'users'
        } else if (req.baseUrl.includes('donation')) {
            folder = 'donation'
        }
        cb(null, `public/images/${folder}`)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            cb(new Error('Envie um imagem no formato png ou jpg!'))
        }
        cb(undefined, true)
    }
})

module.exports = { imageUpload }