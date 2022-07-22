const express = require('express');  //import 보다 require 최신
//npm i cookie-parser
const cookieParsesr = require('cookie-parser');
const bodyparser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyparser.urlencoded({ extended : false }));
app.use(cookieParsesr('!@#$%^&*()')); //app에 cookieParsesr()의 기능을 포함

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
        //쿠키 만료시간
        const expiresDay = new Date(Date.now() + (1000 * 60 * 60 * 24));
        //쿠키설정
        res.cookie('userid', userid, { expires : expiresDay, signed : true});
        res.redirect('/main'); //로그인 성공시 메시지 보이는 창으로 이동
    } else {
        res.redirect('/fail'); //로그인 실패시 이동할 페이지 설정
    }
});

//로그인 성공시 이동하는 라우터
app.get('/main', (req, res) => {
    const cookieUserid = req.signedCookies.userid;
    console.log(cookieUserid);
    if(cookieUserid) {
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
    res.clearCookie('userid');
    res.redirect('/login');
})


app.listen(port, () => {
    console.log(`${port}포트로 서버 실행중...`)
});