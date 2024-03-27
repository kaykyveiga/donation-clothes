const mongoose = require('mongoose');

async function main() {
  await  mongoose.connect('mongodb://localhost:27017/donationClothes');
    console.log('Connected');
}

main().catch(err => console.log(err))