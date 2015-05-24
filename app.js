var http = require("http");
var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
}).listen(6060);

var io = require('socket.io').listen(server);
var amas = io.of('/ama/');
amas.on('connection', function(socket){
  socket.on('creatorInit', function(data){
      socket.join(data.creatorId);
      console.log('creator init');
  })
  socket.on('init', function(data){
      socket.join(data.seriesId)
  })
  socket.on('question', function(data){
    io.to(data.creatorId).emit(data.question);
    request.post({
                url:'http://0.0.0.0:5000/questions', 
                form: {askerId:data.askerId, seriesId: data.seriesId, question: data.question}
                }, 
                function(err,httpResponse,body){ 
                    if(err) console.log(err);
                    else{
                      console.log(body);
                    }
                }
    );
  })
  socket.on('answer', function(data){
    socket.broadcast.to(data.seriesId).emit('newAnswer', { question: data.question, answer: data.answer} );
    request.post({
                url:'http://0.0.0.0:5000/questionsUpdate/' + data.questionId, 
                form: {answer:data.answer}
                }, 
                function(err,httpResponse,body){ 
                    if(err) console.log(err);
                    else{
                      console.log(body);
                    }
                }
    );
  })
});