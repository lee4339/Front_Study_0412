module.exports = (app, fs) => {

    //localhost:3000
    app.get('/', (req, res) => {
        res.render('index.ejs', {
            length: 10
        });
    });

    //localhost:3000/about
    app.get('/about', (req, res) => {
        res.render('about.html');
    })

    //localhost:3000/list
    app.get('/list', (req, res) => {
        fs.readFile(__dirname + "/../data/member.json", "utf-8", (err, data) => {
            if (!err) {
                console.log(data);
                res.writeHead(200, { 'content-type': 'text/json;charset=utf-8' });
                res.end(data);
            } else {
                console(err)
            }
        });
    });

    //http:127.0.0.1:3000/getMember/apple
    app.get('/getMember/:userid', (req, res) => {
        fs.readFile(__dirname + '/../data/member.json', 'utf-8', (err, data) => {
            if (!err) {
                const member = JSON.parse(data);
                //JSON형식으로 불러옴 이렇게 안하면 글자형으로 갖고 오게됨
                res.json(member[req.params.userid])
            } else {
                console.log(err)
            }
        });
    });


    //http://localhost:3000/joinMember/apple 조회 추가
    app.post('/joinMember/:userid', (req, res) => {
        const result = {}; //실제로 데이터를 입력 요소가 수정되는건 상관없음
        const userid = req.params.userid;

        if (!req.body["password"] || !req.body["name"]) {
            result['succes'] = 100; //실패 표시
            result['msg'] = "매개변수가 전달되지 않음";
            res.json(result);
            return false;
        }

        //아이디중복검사
        fs.readFile(__dirname + '/../data/member.json', 'utf-8', (err, data) => {
            const member = JSON.parse(data);
            if (member[userid]) { //apple
                result["success"] = 101; // 중복 101
                result["msg"] = "중복된 아이디"; // 중복된 아이디를 지정
                res.json(result);
                return false; //더이상 진행이 안되게 호출된 위치로 이동
            }
            console.log(req.body); //이름 패스워드 성별

            member[userid] = req.body;
            fs.writeFile(__dirname + "/../data/member.json", JSON.stringify(member, null, '\t'), 'utf-8', (err, data) => {
                if (!err) {
                    result['succes'] = 200;
                    result['msg'] = '성공';
                    res.json(result);
                } else {
                    console.log(err);
                }
            });
        });
    });

    //회원 정보를 수정
    //http://localhost:3000/updateMember/apple
    app.put('/updateMember/:userid', (req, res) => {
        const result = {};
        const userid = req.params.userid

        if (!req.body["password"] || !req.body["name"]) {
            result['succes'] = 100; //실패 표시
            result['msg'] = "매개변수가 전달되지 않음";
            res.json(result);
            return false;
        }

        fs.readFile(__dirname + "/../data/member.json", "utf-8", (err, data) => {
            if(!err) {
                const member = JSON.parse(data); //parse 보낼떄 String --> Object(json객체)로 변환
                member[userid] = req.body

                fs.writeFile(__dirname + "/../data/member.json", JSON.stringify(member, null, '\t'), 'utf-8', (err, data) => {  //stringify 받을때 Object(json객체) --> String로 변환
                    if(!err) {
                        result['succes'] = 200;
                        result['msg'] = "성공";
                        res.json(result);
                        return false;
                    } else {
                        console.log(err);
                    }
                });
            } else {
                console.log(err);
            }
        });
    });


    //회원 삭제
    //http://localhost:3000/deleteMember/apple
    app.delete('/deleteMember/:userid', (req, res) => {
        const result = {};
        const userid = req.params.userid;

        fs.readFile(__dirname + "/../data/member.json", "utf-8", (err, data) => {
            const member = JSON.parse(data);
            if(!member[userid]) {
                result["success"] = 102;
                result["msg"] = "사용자를 찾을 수 없습니다.";
                res.json(result);
                return false;
            }
            delete member[userid];
            fs.writeFile(__dirname + "/../data/member.json", JSON.stringify(member, null, '\t'), "utf-8", (err, data) => {
                result["success"] = 200;
                result["msg"] = "성공";
                res.json(result);
            })
        });
    });

}