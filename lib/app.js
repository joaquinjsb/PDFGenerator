/**
 * lib/app.js
 */

const PORT = 8097;

const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
var morgan = require('morgan');


app.use(morgan('tiny'));

app.get('/', async (req, res) => {
    let filename = req.query.filename;
    await (async () => {
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        const page = await browser.newPage();
        await page.goto('http://getpdffromthisserver./' + filename, {waitUntil: 'networkidle2'});
        const buffer = await page.pdf({            
            format: 'A4',
            landscape: false
        });
        await browser.close();
    })();
    res.type('application/pdf')
    res.send(buffer);
});

app.listen(PORT, () => {
    console.log('PDF Generator App listening on port %d!', PORT);
    console.log('press CTRL + C to exit');
})
