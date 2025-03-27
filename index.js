const express = require('express');
const urlRoute = require('./routes/url');
const {connectToMongoDb} = require('./connect')
const URL = require('./models/url')

const app = express();
const PORT = 8000;

connectToMongoDb("mongodb://127.0.0.1:27017/url-shortner").then(()=> console.log("mongodb connected"))

app.use(express.json())
app.use('/url', urlRoute);

app.get('/:shortId', async (req, res)=> {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, { $push: {
        visitHistory: {
            timestamps: Date.now()
        }
    }});
    res.redirect(entry.redirectURL)
});

app.listen(PORT, ()=> {
    console.log("Server running");
    
})
