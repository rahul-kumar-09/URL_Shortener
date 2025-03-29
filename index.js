const express = require('express');
const urlRoute = require('./routes/url');
const {connectToMongoDb} = require('./connect')
const URL = require('./models/url')
const path = require('path')
const staticRoute = require('./routes/staticRouter')

const app = express();
const PORT = 8000;

connectToMongoDb("mongodb://127.0.0.1:27017/url-shortner").then(()=> console.log("mongodb connected"))

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/url', urlRoute);
app.use('/', staticRoute)

app.get('/url/test',async (req, res)=> {
    const allURL = await URL.find({});
    return res.render("home", {
        urls: allURL,
    })
})

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
