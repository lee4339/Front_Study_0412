const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer'); // npm i nodemailer
const { formatWithOptions } = require('util');
const { title } = require('process');


const port = 3000;
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));


//http://localhost:3000/mail
router.route('/mail').get((req, res) => {
    fs.readFile('mail.html', 'utf-8', (err, data) => {
        if(!err) {
            res.writeHead(200, { 'content-type' : 'text/html' });
            res.end(data);
        } else {
            console.log(err);
        }
    });
});


router.route('/mailOk').post((req, res) => {
    const from = req.body.from;
    const frommail = req.body.frommail;
    const to = req.body.to;
    const tomail = req.body.tomail;
    const title = req.body.title;
    const content = req.body.content;

    const fmtfrom = `${from}<${frommail}>`
    const fmtto = `${to}<${tomail}>`

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'littlegtiger@gmail.com',     // 본인 구글아이디
            pass: 'jdiyxgfzfizdwkdg'            // 구글 보안에서 앱비밀번호 생성 후 작성
        },
        host: 'smtp.mail.com',
        port: '465'
    });

    const mailOptions = {
        from: fmtfrom,
        to: fmtto,
        subject : title,
        text: content
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });

});





app.use("/", router);
app.all('*', (res, req) => {
    res.statusCode(404).send(`<h2>페이지를 찾을 수 없습니다.</h2>`)
})


app.listen(port, () => {
    console.log(`${port}포트로 서버 동작중...`);
});