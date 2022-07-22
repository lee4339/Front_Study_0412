const express = require('express');
//npm i cookie-parser
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

app.use(cookieParser());//app에 cookieParser()의 기능을 포함

//쿠키설정
app.get('/setCookie', (req, res) => {
    console.log('setCookie호출');
    res.cookie('member', {
        id: 'apple',
        name: '김사과',
        gender: 'female'
    }, {
        maxAge: 1000 * 60 * 60
    });//쿠키 생성
    res.redirect('/showCookie');//이동
});

app.get('/showCookie', (req, res) => {
    console.log('showCookie호출');
    res.send(req.cookies);//서버에서 사용자에게 전달(화면에 출력)
    res.end()
})





app.listen(port, () => {
    console.log(`${port}포트로 서버 실행중...`)
})