const express = require('express');
const app = express();
const shortid = require('shortid');
const Log = require('../loggingMiddleware/logs');

const allShortUrls = {};

const port = 5050;

app.use(express.json());

function removeExpired(){
    for(const shortUrl in allShortUrls){
        if(new Date(allShortUrls[shortUrl].expiry) < new Date()){
            delete allShortUrls[shortUrl];
        }
    }
}

app.use((req, res, next) => {
    removeExpired();
    next();
})

app.get('/', (req, res) => {
    res.send('Welcome to URL Shortner microservice');
})

app.post('/shorturls', async (req, res) => {
    try{
        const {url, validity = 30, shortidFromUser} = req.body;
        if(!url || !url.startsWith('http')){
            await Log.log({stack: 'backend', level: 'error', pkg: 'controller', message: 'Invalid URL Format'});
            return res.status(400).json({error: 'Invalid URL Format'});
        }
        const short = shortidFromUser || shortid.generate();
        const expiry = new Date(Date.now() + validity * 24 * 60 * 60 * 1000).toISOString();
        allShortUrls[short] = {
            originalUrl: url,
            createdAt: new Date().toISOString(), 
            expiry: expiry,
            clicks: []
        };
        return res.status(201).json({message: "Short URL created successfully",
            shortLink: `http://localhost:${port}/${short}`,
            expiry: expiry
        });
    }
    catch(e){
        await Log.log({stack: 'backend', level: 'error', pkg: 'controller', message: e.message});
        return res.status(500).json({error: e.message});
    }
}) 

app.get('/shorturls/:code', async (req, res) => {
    try {
        const {code} = req.params;
        if(!allShortUrls[code]){
            await Log.log({stack: 'backend', level: 'error', pkg: 'controller', message: 'Short URL not found'});
            return res.status(404).json({error: 'Short URL not found'});
        }
        return res.status(200).json(allShortUrls[code]);
    }
    catch(e){
        await Log.log({stack: 'backend', level: 'error', pkg: 'controller', message: e.message});
        return res.status(500).json({error: e.message});
    }
})

app.get('/shorturls/:code/clicks', async (req, res) => {
    try {
        const {code} = req.params;
        if(!allShortUrls[code]){
            await Log.log({stack: 'backend', level: 'error', pkg: 'controller', message: 'Short URL not found'});
            return res.status(404).json({error: 'Short URL not found'});
        }
        allShortUrls[code].clicks.push(new Date().toISOString());
        return res.status(200).json(allShortUrls[code]);
    }
    catch(e){
        await Log.log({stack: 'backend', level: 'error', pkg: 'controller', message: e.message});
        return res.status(500).json({error: e.message});
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})