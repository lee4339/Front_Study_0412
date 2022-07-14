const events = require('events'); //모듈요청

//이벤트에 관련된 메소드를 사용할 수 있는 EventEmitter 객체
const eventEmitter = new events.EventEmitter();

//이벤트가 발생했을 때 실행할 함수 선언
const connectHandler = function connected() {
    console.log('연결 성공!');
    eventEmitter.emit('data_received'); //새롭게 이벤트를 지정(생성)
};

//이벤트와 핸들러와 연결
eventEmitter.on('connection', connectHandler); //지정한 이벤트의 리스너를 추가(발생)

//두번째 지정된 이벤트가 발생시 실행될 익명함수와 연결
eventEmitter.on('connection', () => {
    console.log('데이터 수신!');
});

eventEmitter.emit('connection'); //지정한 이벤트를 발생(생성)
