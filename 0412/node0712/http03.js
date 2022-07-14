const http = require('http');
const fs = require('fs');


//이미지 서버 실행
http.createServer((req, res) => {
    fs.readFile('node.png', (err, data) => {
        //예외처리
        if(err) {
            console.log(err);
        }else {
            res.writeHead(200, {'content-type': 'image/png' });
            res.end(data);
        }
    });
    
    }).listen(3000, () => {
        console.log('이미지 서버 실행중....');
});



//사운드 서버 실행
http.createServer((req, res) => {
    fs.readFile('sunny.mp3', (err, data) => {
        //예외처리
        if(err) {
            console.log(err);
        }else {
            res.writeHead(200, {'content-type': 'audio/mp3' });
            res.end(data);
        }
    });
    
    }).listen(3001, () => {
        console.log('사운드 서버 실행중....');
});
