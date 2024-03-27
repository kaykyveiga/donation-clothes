const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/donationClothes');
    console.log('Connected');
}

main().catch((err) => console.log(err))

module.exports = mongoose