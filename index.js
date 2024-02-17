const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const app = express();
const port = 8000;
const url = "192.168.1.72"; 

app.use(morgan('dev'));

app.get('/',[],(req, resp)=>{
    resp.sendFile(`${__dirname}/index.html`);
});

app.get('/video',[], (req, resp)=>{

    const range = req.headers.range;

    if(!range) resp.status(400).send('Requires Range Header');
    console.log(range)
    const videoPath = "video.mp4";
    const videoSize = fs.statSync(videoPath).size;

    const CHUNK_SIZE = 10 ** 6 ;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize-1);

    const contentLength = end - start + 1 ;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    resp.writeHead(206,headers);
    const videStream = fs.createReadStream(videoPath, {start, end});

    videStream.pipe(resp);

});

app.listen(port,url,()=>{
    console.log(`Listening on port ${port}! url: ${url}`)
});