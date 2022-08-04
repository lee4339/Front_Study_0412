const { Schema } = require('mongoose');
// npm i crypto
const crypto = require('crypto');//암호화 시키는 모듈
const passport = require('passport');

Schema.createSchema = function(mongoose){
    console.log('createSchema() 호출!');
    const MemberSchema = mongoose.Schema({//객체형태로 스키마 생성 
        userid: {type:String, require:true, default:''},
        //타입은 문자, 데이터는 무조건 들어가야하고 만약 없다면 공백
        hashed_password: {type:String, default:''},
        //  비번을 암호화된 비번임  무조건이 아닌 이유는  sns로그인에서는 아이디로만으로 로그인        
        name: {type:String, default:''},
        salt: {type:String},//비밀번호를 암호화 시킬때 사용
        age: {type:Number, default:0},
        created_at: {type:Date, default:Date.now},//가입한날짜 default:Date.now현재시간을 저장
        updated_at: {type:Date, default:Date.now},//수정된 날짜
        provider: {type:String, default:''},//간단로그인 하는 경로(페이스북등등 제공사의 이름)
        authToken: {type:String, default:''},//간단로그인한 곳에 가입하기 했을때 인증할 코드
        facebook: {}//페이스북에서 날아온 객체를 저장하는 곳
    }); 
    

    //가상함수
    //가상필드 -> 스키마에는 없지만 hashed_password를 만들기 위해서 프로퍼티를 만듬
    MemberSchema.virtual('userpw')
        .set(function(userpw){
            this._userpw = userpw;
            this.salt = this.makeSalt();//함수를 호출하여 얻은 값을 저장
            this.hashed_password = this.encryptPassword(userpw);//함수호출
        })
        .get(function(){
            return this._userpw;//this._userpw을 리턴 
        });

    MemberSchema.method('makeSalt', function(){
        console.log('makeSalt() 호출!');
        return Math.round((new Date().valueOf() * Math.random())) + ''; // 문자열(암호화)
        //오늘 날짜에 무작위의 숫자값을 곱하기해서 숫자로 값을 생성
    });

    MemberSchema.method('encryptPassword', function(plainText, inSalt){
        if(inSalt){ // 로그인
            return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
            //단방향 암호화, 전달받은 inSal값을 합쳐서  plainText를 암호화 ,16진수로 저장
        }else{  // 회원가입
            return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
            // 1234 -> salt에 저장된 값을 가져와서 sha1암호화를 통해 1234를 섞어줌 -> 16진수로 변환
        }
    });
 
    //인증관려함수 스키마 안에서 사용될 함수를 설정 
    MemberSchema.method('authenticate', function(plainText, inSalt, hashed_password){
        if(inSalt){
            console.log('authenticate() 호출! <inSalt 있음>');//아덴티케트
            return this.encryptPassword(plainText, inSalt) == hashed_password;

        }else{
            console.log('authenticate() 호출! <inSalt 없음>');
            return this.encryptPassword(plainText) == this.hashed_password;
        }
    });

    // pre() : 특정 작업이 일어나기 전에 미리 호출되는 메소드입니다. 트리거 역할입니다.
    MemberSchema.pre('save', (next) => {
        if(!this.isNew) return next();

        if(!validatePresenceOf(this.userpw)){//비밀번호 확인하는 함수
            next(new Error('유효하지 않은 password입니다.'));
        }else{
            next();
        }
    });

    const validatePresenceOf = function(value){
        return value && value.length;   // 데이터가 있는지 여부
    }

    console.log('MemberSchema 정의 완료!');
    return MemberSchema;
}

module.exports = Schema;