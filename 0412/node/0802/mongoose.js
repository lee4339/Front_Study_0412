const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
//npm i mongoose

const app = express();
const port = 3000;
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

//데이터베이스 연결
let database;
let UserSchema;
let UserModel;

function connectDB() {
    const url = 'mongodb://localhost:27017/frontenddb';
    console.log('데이터베이스 연결 시도중 ... ');

    mongoose.Promise = global.Promise;//몽구스의 프로미스 객체를 global.Promise 객체로 사용
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

    database = mongoose.connection;//데이터베이스 연결 구간
    //데이터베이스의 연결상태에 대한 예외처리 설정
    database.on('error', console.error.bind(console, 'mongoose 연결실패'));
    database.on('open', () => {
        console.log('데이터베이스 연결 성공');
        //스키마설정
        UserSchema = mongoose.Schema({
            userid: String,
            userpw: String,
            username: String,
            gender: String
        });
        console.log('UserSchema 생성완료!');

        UserSchema.static('findAll', function (callback) {
            return this.find({}, callback);
        })

        UserModel = mongoose.model('user', UserSchema);//테이블명 users로설정
        console.log('UserModel이 정의되었습니다!');

    })
}

// localhost:3000/user/regist (post)
router.route('/user/regist').post((req, res) => {
    console.log('/user/regist호출');

    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const username = req.body.username;
    const gender = req.body.gender;

    console.log(`userid:${userid}, userpw:${userpw}, username:${username}, gender:${gender}`);

    if (database) {
        joinUser(database, userid, userpw, username, gender, (err, result) => {
            if (!err) {
                if (result) {
                    res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                    res.write('<h2>회원가입성공</h2>');
                    res.end();
                } else {
                    res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                    res.write('<h2>회원가입실패</h2>');
                    res.end();
                }
            } else {
                res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                res.write('<h2>서버에러! 회원가입실패</h2>');
                res.end();
            }
        })
    } else {
        res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결실패</h2>');
        res.end();
    }
})

// localhost:3000/user/login (post)
router.route('/user/login').post((req, res) => {
    console.log('/user/login 호출!');
    const userid = req.body.userid;
    const userpw = req.body.userpw;

    console.log(`userid:${userid}, userpw:${userpw}`);

    if (database) {
        loginUser(database, userid, userpw, (err, result) => {
            if (!err) {
                if (result) {
                    console.dir(result);
                    const username = result[0].username;
                    const gender = result[0].gender;
                    res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                    res.write('<h2>로그인 성공</h2>');
                    res.write(`<p>아이디 : ${userid}</p>`);
                    res.write(`<p>이름 : ${username}</p>`);
                    res.write(`<p>성별 : ${gender}</p>`);
                    res.end();
                } else {
                    res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                    res.write('<h2>로그인 실패</h2>');
                    res.end();
                }
            } else {
                res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                res.write('<h2>서버오류! 로그인 실패</h2>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결실패</h2>');
        res.end();
    }

});

// localhost:3000/user/list (get)
router.route('/user/list').get((req, res) => {
    if (database) {
        UserModel.findAll((err, result) => {
            if (!err) {
                if (result) {
                    res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                    res.write('<h2>회원리스트</h2>');
                    res.write('<div><ul>');

                    for (let i = 0; i < result.length; i++) {
                        const userid = result[i].userid;
                        const username = result[i].username;
                        const gender = result[i].gender;
                        res.write(`<li>${i} :  ${userid} / ${username} / ${gender}</li>`)
                    }

                    res.write('</ul></div>')
                    res.end();
                } else {
                    res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
                    res.write('<h2>회원정보없음</h2>');
                    res.end();
                }
            } else {
                console.log('리스트 조회 실패')
            }
        });
    } else {
        res.writeHead('200', { 'content-type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결실패</h2>');
        res.end();
    }
})


//--------------------------------------------------------------------------

const joinUser = function (database, userid, userpw, username, gender, callback) {
    console.log('joinUser호출');
    const users = new UserModel({ userid: userid, userpw: userpw, username: username, gender: gender })
    users.save((err, result) => {
        if (!err) {
            console.log('회원 document가 추가되었습니다.');
            callback(null, result);
            return;
        } else {
            callback(err, null);
        }
    })
}

const loginUser = function (database, userid, userpw, callback) {
    console.log('loginUser 호출!');

    UserModel.find({ userid: userid, userpw: userpw }, (err, result) => {
        if (!err) {
            if (result.length > 0) {
                console.log('일치하는 사용자를 찾음');
                callback(null, result);
            } else {
                console.log('일치하는 사용자가 없음');
                callback(null, null);
            }
            return;
        }
        callback(err, null);
    });
}


app.use('/', router);

app.listen(port, () => {
    console.log(`${port}번 포트로 서버 실행중...`);
    connectDB();
})