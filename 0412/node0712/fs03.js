const fs = require('fs'); //파일을 다루는 모듈

//비동기처리는 예외처리를 할 필요가 없습니다.
fs.readFile('text11.txt', 'utf-8', (err, data) => {
    if(err) {
        console.log('에러발생! / 비동기');
    } else {
        console.log(data);
    }
});

//동기식은 예외처리를 위해서는 try문을 사용해야함
try {
    const text = fs.readFileSync('text11.txt', 'utf-8'); //동기
    console.log(`동기식으로 읽음 : ${text}`);
} catch(e) {
    console.log('에러발생! / 동기');
}