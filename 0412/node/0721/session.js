const express = require('express');  //import 보다 require 최신
// npm i express-session
const expressSession = require('express-session');
const bodyparser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyparser.urlencoded({ extended : false }));
app.use(expressSession({
    secret : '!@#$%^&*()',
    resave : false,
    saveUninitialized : true
})); 

//로그인
app.get('/login', (req, res) => {
    fs.readFile('login.html', 'utf-8', (err, data) => {
        if(!err) {
            res.writeHead(200, {'content-type':'text/html'});
            res.end(data);
        } else {
            console.log(err);
        }
    });
});

app.post('/loginOk', (req, res) => {
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    //입력된 값을 확인
    console.log(userid);
    console.log(userpw);

    //admin/1234
    if (userid == 'admin' && userpw == '1234') {
        req.session.member = {
            id : userid,
            userpw : userpw,
            isauth : true  // 인증되었는지
        }
        res.redirect('/main'); //로그인 성공시 메시지 보이는 창으로 이동
    } else {
        res.redirect('/fail'); //로그인 실패시 이동할 페이지 설정
    }
});

//로그인 성공시 이동하는 라우터
app.get('/main', (req, res) => {
    
    if(req.session.member) {
        console.log(req.session.member);
        fs.readFile('main.html', 'utf-8', (err, data) => {
            res.writeHead(200, { 'content-type' : 'text/html'});
            res.end(data);
        })
    } else {
        res.redirect('/login');
    }
});

//로그인 실패시 이동하는 라우터
app.get('/fail', (req, res) => {
    fs.readFile('fail.html', 'utf-8', (err, data) => {
        res.writeHead(200, { 'content-type' : 'text/html'});
        res.end(data);
    })
});

//로그아웃
app.get('/logout', (req, res) => {
    req.session.destroyry(() => {
        console.log('세션이 삭제되었습니다.')
    })
    res.redirect('/login');
})


app.listen(port, () => {
    console.log(`${port}포트로 서버 실행중...`)
});