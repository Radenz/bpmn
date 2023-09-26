import http from 'http';
import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

app.post("/cuti", (req, res) => {

    const reqData = req.body;
    const filename = 'src/store/data.json';

    fs.readFile(filename, 'utf8', function readFileCallback(err, strData){

        let objData = null;

        if (err) {
            if (err.code === "ENOENT") {
                objData = { data: [] };
            } else {
                console.error('Error reading data:', err);
                res.status(500).json({ error: 'Error reading data.' });
                return;
            }
        } else {
            objData = JSON.parse(strData);
        }

        objData["data"].push(reqData);
        strData = JSON.stringify(objData);

        fs.writeFile(filename, strData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                res.status(500).json({ error: 'Error saving data data.' });
                return;
            }
            console.log('Data saved successfully.');
            res.status(200).json(reqData);
        });

    });

});

const port = process.env.PORT;
const server = http.createServer(app);
server.listen(port);
