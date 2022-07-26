const express = require('express');
const bodyParser = require('body-parser');
// npm i mongodb
const MongodbClient = require('mongodb').MongoClient;

const app = express();
const router = express.Router();
const port = 3000;

app.use(bodyParser.urlencoded({ extended : false}));

let database;

// mongodb 연결
function connectDB() {
    const databaseURL = 'mongodb://localhost:27017';
    MongodbClient.connect(databaseURL, (err, db) => {
        if(!err) {
            const tempdb = db.db('frontenddb');
            database = tempdb;
            console.log("mongodb 데이터베이스 연결 성공!");
        } else {
            console.log(err);
        }
    })
}
// 회원가입
//http://localhost:3000/member/regist (post)
router.route('/member/regist').post((req, res) => {
    console.log('/member/regist 호출!');
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const username = req.body.username;
    const age = req.body.age;
    console.log(`userid:${userid}, userpw:${userpw}, username:${username}, age:${age}`);
    
    if(database) {
        //데이터베이스에 연결 성공
        joinMember(database, userid, userpw, username, age, (err, result) => {
            if(!err) { //콜백함수 연결 성공시
                if(result.insertedCount > 0) { //insertedCount 발생
                    res.writeHead('200', { 'content-type' : 'text/html;charset=utf-8' });
                    res.write('<h2>회원가입성공</h2>');
                    res.write('<p>가입이 성공적으로 완료되었습니다.</p>');
                    res.end();
                } else { //insertedCount 발생하지 않은 상태
                    res.writeHead('200', { 'content-type' : 'text/html;charset=utf-8' });
                    res.write('<h2>회원가입실패</h2>');
                    res.write('<p>가입이 실패되었습니다.</p>');
                    res.end();
                }
            } else { //콜백함수 연결 실패시
                res.writeHead('200', { 'content-type' : 'text/html;charset=utf-8' });
                res.write('<h2>회원가입실패</h2>');
                res.write('<p>오류가 발생했습니다.</p>');
                res.end();
            }
        });
    } else { // 데이터베이스에 연결 실패시 응답내용
        res.writeHead('200', { 'content-type' : 'text/html;charset=utf-8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다. </p>');
        res.end();


    }
});

// 로그인
//http://localhost:3000/member/login
router.route('/member/login').post((req, res) => {
    console.log('/member/login 호출');
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    console.log(`userid:${userid}, userpw:${userpw}`);

    if(database) {
        loginMember(database, userid, userpw, (err, result) => {
            if(!err) {
                //콜백함수 연결 성공시
                if(result) {
                    //로그인 성공시
                    console.dir(result); //객체 전달
                    const resultUserid = result[0].userid;
                    const resultUserpw = result[0].userpw;
                    const resultUserName = result[0].username;
                    const resultAge = result[0].age;
    
                    res.writeHead('200', { 'content-type' : 'text/html;charset=utf-8' });
                    res.write('<h2>로그인 성공</h2>');
                    res.write(`<p>${resultUserid}(${resultUserName})님 환영합니다.</p>`);
                    res.write(`<p>나이: ${resultAge}살</p>`);
                    res.end();
                } else {
                    //콜백함수 연결 실패시
                    res.writeHead('200', { 'content-type' : 'text/html;charset=utf-8' });
                    res.write('<h2>로그인 실패</h2>');
                    res.write('<p>아이디 또는 비밀번호를 확인하세요.</p>');
                    res.end();
                }
            } else {
                //로그인 실패시
                res.writeHead('200', { 'content-type' : 'text/html;charset=utf-8' });
                res.write('<h2>로그인 실패</h2>');
                res.write('<p>아이디 또는 비밀번호를 확인하세요.</p>');
                res.end();

            }
        });

    } else {// 데이터베이스에 연결 실패시 응답내용
    res.writeHead('200', { 'content-type' : 'text/html;charset=utf-8' });
    res.write('<h2>데이터베이스 연결 실패</h2>');
    res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다. </p>');
    res.end();
    }
})


// 정보수정
//http://localhost:3000/member/edit
router.route('/member/edit').post((req, res) => {
    console.log('/member/edit호출');

    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const username = req.body.username;
    const age = req.body.age;
    console.log(`userid:${userid}, userpw:${userpw}, username:${username}, age:${age}`);

    if(database) {
        editMember(database, userid, userpw, username, age, (err, result) => {
            if (!err) {
                if (result.modifiedCount > 0) {
                    res.writeHead('200', { 'content-type' : 'text/html;charset=utf-8' });
                    res.write('<h2>회원정보 수정 성공</h2>');
                    res.write('<p>회원정보 수정에 성공했습니다.</p>');
                    res.end();
                } else {
                    res.writeHead('200', { 'content-type' : 'text/html;charset=utf-8' });
                    res.write('<h2>회원정보 수정 실패</h2>');
                    res.write('<p>회원정보 수정에 실패했습니다.</p>');
                    res.end();
                }
            } else {
                res.writeHead('200', { 'content-type' : 'text/html;charset=utf-8' });
                res.write('<h2>회원정보 수정 실패</h2>');
                res.write('<p>서버 오류 발생!  정보 수정에 실패했습니다.</p>');
                res.end();
            }
        });
    } else {// 데이터베이스에 연결 실패시 응답내용
        res.writeHead('200', { 'content-type' : 'text/html;charset=utf-8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다. </p>');
        res.end();

    }
    
});


// 회원삭제

//---------------------------------------------------------------------------------------
const joinMember = function (database, userid, userpw, username, age, callback) {
    console.log('joinMember호출!');
    const members = database.collection('member'); //컬렉션 연결
    members.insertMany([{userid:userid, userpw:userpw, username:username, age:age}], (err, result) => {
        if(!err) {
            //추가객체를 표시하는 메시지 알림을 설정
            if(result.insertedCount > 0) {
                console.log(`사용자 document ${result.insertedCount}명 추가 되었음!`);
            } else {
                console.log(`사용자 document 추가되지 않음!`);
            }
            callback(null, result);
            return;
        } else {
            console.log(err);
            callback(err, null);
        }
    });
}


const loginMember = function (database, userid, userpw, callback) {
    console.log('loginMember 호출!')
    const members = database.collection('member');
    members.find({userid:userid, userpw:userpw}).toArray((err, result) => {
        if(!err) {
            if(result.length > 0) { //조회된 갯수가 1이상
                console.log('사용자를 찾았습니다.');
                callback(null, result);
            } else {
                console.log('일치하는 사용자가 없습니다.');
                callback(null, null);
            }
            return;
        } else {
            console.log(err);
            callback(err, null);
        }
    });
}

const editMember = (database, userid, userpw, username, age, callback) => {
    console.log('editMember호출');
    const members = database.collection('member');
    members.updateOne({userid:userid}, {$set: {userid:userid, userpw:userpw, username:username, age:age}}, (err, result) => {
        if(!err) {
            if (result.modifiedCount > 0) {
                console.log(`사용자 document ${result.modifiedCount}명 수정됨`);
            } else {
                console.log(`수정된 document 없음`);
            }
            callback(null, result)
        } else {
            console.log(err)
            callback(err, null)
        }
    });

};



app.use("/", router);
app.listen(port, () => {
    console.log(`${port}포트로 서버 동작중...`);
    connectDB();
});