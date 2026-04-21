const mongoose = require('mongoose');
mongoose.set('strictQuery', false);


const conn = mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(db => {
    console.log("✅ Database Connected");
    return db;
})
.catch(err => {
    console.log("❌ Connection Error:", err);
});

module.exports = conn;