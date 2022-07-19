module.exports = (app, fs) => {

    //localhost:3000
    app.get('/', (req, res) => {
        res.render('index.ejs', {
            length:10
        });
    });

     //localhost:3000/about
     app.get('/about', (req, res) => {
        res.render('about.html');
     })

     //localhost:3000/list
     app.get('/list', (req, res) => {
        fs.readFile(__dirname + "/../data/member.json", "utf-8", (err, data) => {
            if(!err) {
                console.log(data);
                res.writeHead(200, { 'content-type' : 'text/json;charset=utf-8'});
                res.end(data);
            } else {
                console(err)
            }
        })
     })


}