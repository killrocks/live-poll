const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const router = require("./routes");

const app = express();
//body parser
app.use(bodyParser.urlencoded({extended: true}));
//views
app.use(express.static(__dirname + "/views"));
//assets
app.use(express.static(__dirname + "/assets"));
//ejs
app.set('view engine', 'ejs');
//routes
app.use(router);
//port
const server = app.listen(8000, function() {
	console.log("listening on port 8000");
});

let polls = []; /* DOCU: This function is responsible for adding a user to the database :: Owner: Cesar Francisco */
function randomUrl(urlExist){ /* DOCU: This creates a random string that will be passed in the url :: Owner: Cesar Francisco */
    let randomUrl = Math.random().toString(36).substring(7);
    if(randomUrl != urlExist){
        return randomUrl;
    }
    randomUrl(urlExist);
}
const io = require('socket.io')(server); /* DOCU: Socket.io connection :: Owner: Cesar Francisco */
io.sockets.on('connection', function(socket) {  /* DOCU: Establishing a connection with user :: Owner: Cesar Francisco */
	console.log("Connected: "+ socket.connected);
    socket.on('create_poll', function(){ /* DOCU: This handles the creation of live poll :: Owner: Cesar Francisco */
        let id = randomUrl();
        if(polls.length>0){
            for(let i = 0; i < polls.length; i++){
                if(id == polls[i].socketId){
                    id = randomUrl(polls[i].socketId);
                }
            }
            polls.push({id: id, socketId: socket.id, vote_count: 0});
            socket.join(id);
            socket.emit('poll_created', id);
        }
        else{
            polls.push({id: id, socketId: socket.id, vote_count: 0});
            socket.join(id);
            socket.emit('poll_created', id);
        }
    });
    socket.on('student_join', function(id){ /* DOCU: This handles student joining a room in a created live poll :: Owner: Cesar Francisco */
        let user_id = id;
        socket.join(user_id);
        for(let i = 0; i < polls.length; i++){
            if(polls[i].id == user_id && (polls[i].question || polls[i].opt)){
                socket.emit('show_question', polls[i]);
            }
        }
    });
    socket.on('update_answer', function(data){ /* DOCU: This handles the insertion/deletion of question and option :: Owner: Cesar Francisco */
        for(let i = 0; i < polls.length; i++){
            if(polls[i].id == data.id){
                polls[i].question = data.question;
                polls[i].opt = data.opt;
            }
        }
        socket.to(data.id).emit('update_answer', data);
    });
    socket.on('vote_submitted', function(data){ /* DOCU: This handles student voting in a created live poll :: Owner: Cesar Francisco */
        for(let i = 0; i < polls.length; i++){
            if(polls[i].id == data.id){
                polls[i].vote_count += 1;
                for(let j in polls[i].opt){
                    if(polls[i].opt[j].option == data.selected_option)
                    polls[i].opt[j].vote_count+= 1;
                }
            }
        }
        socket.to(data.id).emit('vote_add');
    });
    socket.on('poll_result', function(id){ /* DOCU: This handles the voting results of a student :: Owner: Cesar Francisco */
        id = id;
        socket.join(id);
        for(let i = 0; i < polls.length; i++){
            if(polls[i].id == id){
                socket.emit('results', polls[i]);
            }
        }
    });
});