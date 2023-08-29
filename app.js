const app = require('express')();
const http=require('http').Server(app);

const path = require('path');
const io = require('socket.io')(http);
app.get('/', function(req,res){

    var options ={
        root: path.join(__dirname)
    }

    var filename='index.html';
    res.sendFile(filename,options);
});

io.on('connection',function(socket){
    console.log('a user connected');
    socket.on('myCustomEvent',function(data){
        console.log(data.description);
    });//to catch an event on is used 
     

    socket.on('disconnect',function(){
        console.log('A user disconnected');
    });
});

http.listen(3000, ()=>{
    console.log('server ready on 3000');
});