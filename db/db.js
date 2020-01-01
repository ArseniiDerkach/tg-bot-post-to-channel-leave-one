const MongoClient = require('mongodb').MongoClient;
const { uri, db } = require('./config');
const collection = 'ad';

// exports.addAd = async () =>{
//     const ad = {
//         text: 'test text \n https://www.google.com/',
//         id: 0
//     }
//     let client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//     const currentdb = client.db(db);
//     const col = currentdb.collection(collection);
//     col.insertOne(ad);
// }


exports.getAd = async () => {
    let client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const currentdb = client.db(db);
    const col = currentdb.collection(collection);
    const ad = await col.find().toArray();
    client.close;
    return ad[0];
}

exports.updateAd = async (ad) => {
    let client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    const currentdb = client.db(db);
    const col = currentdb.collection(collection);
    await col.findOneAndUpdate(
        {},
        { $set: { text: ad.text, id: ad.id } }
     )
}