const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.engine('html', require('ejs').renderFile);
// view엔진 등록, ejs파일을 자동으로 html로 변환 / views폴더 생성이 공식
app.use(bodyParser.urlencoded({extended:false}));
// url 파싱(분석) qs, query-string ==> 중첩된 객체 표현 허용할지 여부를 체크

const module1 = require('./router/module1')(app, fs); //생성하는 파일에 express()와 fs를 전달




app.listen(port, () => {
    console.log(`${port}번 포트로 서버 실행중...`);
})