import express from 'express'
const app = express();
import shortid from 'shortid';
import Log from '../loggingMiddleware/log.js';
import cors from 'cors';

const allShortUrls = {};

const port = 5050;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: 'http://localhost:3000'
}));

function removeExpired(){
    // remove expired short urls
    for(const shortUrl in allShortUrls){
        // console.log(allShortUrls[shortUrl].expiry);
        if(new Date(allShortUrls[shortUrl].expiry) < new Date()){
            delete allShortUrls[shortUrl];
        }
    }
}

app.use((req, res, next) => {
    // remove expired short urls
    removeExpired();
    next();
})

app.get('/', (req, res) => {
    res.send('Welcome to URL Shortner microservice');
})

app.post('/shorturls', async (req, res) => {
    // create short url
    try{
        // console.log(req.body);
        const {url, validity = 30, shortidFromUser} = req.body;
        if(!url || !url.startsWith('http')){
            await Log({stack: 'backend', level: 'error', pkg: 'controller', message: 'Invalid URL Format'});
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
        // send back response
        return res.status(201).json({message: "Short URL created successfully",
            shortLink: `http://localhost:${port}/${short}`,
            expiry: expiry
        });
    }
    catch(e){
        // log error
        await Log({stack: 'backend', level: 'error', pkg: 'controller', message: e.message});
        return res.status(500).json({error: e.message});
    }
}) 

app.get('/shorturls/:code', async (req, res) => {
    // get short url
    try {
        const {code} = req.params;
        if(!allShortUrls[code]){
            await Log({stack: 'backend', level: 'error', pkg: 'controller', message: 'Short URL not found'});
            return res.status(404).json({error: 'Short URL not found'});
        }
        return res.status(200).json(allShortUrls[code]);
    }
    catch(e){
        // log error
        await Log({stack: 'backend', level: 'error', pkg: 'controller', message: e.message});
        return res.status(500).json({error: e.message});
    }
})

app.get('/shorturls/:code/clicks', async (req, res) => {
    // get short url
    try {
        const {code} = req.params;
        if(!allShortUrls[code]){
            await Log({stack: 'backend', level: 'error', pkg: 'controller', message: 'Short URL not found'});
            return res.status(404).json({error: 'Short URL not found'});
        }
        allShortUrls[code].clicks.push(new Date().toISOString());
        return res.redirect(allShortUrls[code].originalUrl);
    }
    catch(e){
        // log error
        await Log({stack: 'backend', level: 'error', pkg: 'controller', message: e.message});
        return res.status(500).json({error: e.message});
    }
})


app.listen(port, () => {
    // start sever
    console.log(`Server listening on port ${port}`)
})