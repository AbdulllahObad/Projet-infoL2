const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "public")));
const server = http.createServer(app);
const io=require('socket.io')(server);


server.listen(PORT, function(){
  console.log(`lestining on ${PORT}`);
  });

//read from json
  const fs = require('fs');
    let rawdata = fs.readFileSync(path.join(__dirname, '/public/js/jeu1.json'));
    let data = JSON.parse(rawdata);
    const n=personnageChoisi(data);



  app.get('/', (req, res) => {
    console.log("im get");
    res.sendFile(path.join(__dirname, '/public/index2222.html'));
});



let Rooms=[];

io.on('connection', (socket) => {
  
  socket.on('NewPlayer', ()=>{
    console.log("a new player is connected: id "+ socket.id);
  })
  //socket.broadcast.emit('Personnage',n);


 

  socket.on('PlayerData', (player)=>{
 
    let Room=null;
    if(!player.RoomId){
      Room=CreatRoom(player);
      console.log(`[create room ] - ${Room.id} - ${player.UserName}`);
      player.RoomId = Room.id;
    }
    else {
      Room = Rooms.find(r => r.id === player.RoomId);
    if(Room ===undefined){
      return;
    }
    player.RoomId = Room.id;
    Room.players.push(player);

    
    }

    socket.on('getRoomID',()=>{
      socket.emit('roomid',Room.id);
    });

    socket.join(Room.id);
    io.to(socket.id).emit('join room', Room.id); //to() is to send to a particuler client
    if(Room.players.length===2){
      io.to(Room.id).emit('start game',Room.players);
      io.to(Room.id).emit('Personnage',n);
     
    }

  });


//on va ecuter un autre fois un client
socket.on('getRooms', ()=>{ //recive a request from a client
  io.to(socket.id).emit('listRooms', Rooms); //respond to the client's request
});

//on va ecouter un client si il veut se deconnecter
socket.on('disconnect', ()=>{
  console.log(`disconnect ${socket.id}`);
  let rom=null;
  

  Rooms.forEach(r=>{ //foreach room

    if(r.id !=null){
      r.players.forEach(p=>{
      if(p.SocketID==socket.id){
        io.to(r.id).emit('disconnected');
      }
            
    });}


    r.players.forEach(p=>{ //foreach player in this room
      if(p.SocketID===socket.id && p.Host){
        rom=r; //
        Rooms=Rooms.filter(r=>r !==rom); //give all rooms but this room
      }

    });

 


});
});

socket.on('StartPlay', (player)=>{
 


  Rooms.forEach(r=>{ //foreach room
    r.players.forEach(p=>{ //foreach player in this room
      if(p.SocketID !=player.SocketID){
        io.to(p.RoomId).emit('StartPlay',p);
      }});
  
 });});

 socket.on('win',(player)=>{
   console.log("im win")
   io.to(player.SocketID).emit('YouWin',player);

   Rooms.forEach(r=>{ //foreach room
    r.players.forEach(p=>{ //foreach player in this room
      if(p.SocketID !=player.SocketID){
        io.to(p.SocketID).emit('YouLose',player);
      }});
  
 });


 });
 socket.on('lose',(player)=>{
  io.to(player.SocketID).emit('YouLose2',player);
  Rooms.forEach(r=>{ //foreach room
   r.players.forEach(p=>{ //foreach player in this room
     if(p.SocketID !=player.SocketID){
       io.to(p.SocketID).emit('YouWin2',player);
     }});
 
});


 });

 socket.on('AskDeRejouer', (playerid)=>{
  Rooms.forEach(r=>{ //foreach room
    r.players.forEach(p=>{ //foreach player in this room
      if(p.SocketID != playerid){
        console.log("waiting",playerid);
        io.to(playerid).emit('waitingNewGame',p);
       
        io.to(p.SocketID).emit('ask to playAgain',playerid);
      }
    });
 });


 });

 socket.on('Rejouer', (playerid)=>{


  Rooms.forEach(r=>{ //foreach room
    r.players.forEach(p=>{ //foreach player in this room
      console.log(p.SocketID);
      io.to(p.SocketID).emit('croix');
      io.to(p.SocketID).emit('readyToPlay');
        console.log("let's goooooooooo");
        console.log(p.SocketID,playerid);
        if(p.SocketID==playerid){ 
         const NewPersonnage=personnageChoisi(data);
         console.log("hi new",NewPersonnage);
         io.to(r.id).emit('Personnage', NewPersonnage);
         io.to(r.id).emit('rejouer', r.players);
       
      
      }
    });
 });
 });

  });



  function CreatRoom(player){
    const Room={id: CreatRoomId(), players:[]};

    player.RoomId=Room.id;
    Room.players.push(player);
    Rooms.push(Room);

    return Room;
  }
  function CreatRoomId(){
    return Math.random().toString(36).substring(2,9);  }

  ////////*************************************************************************************** */
  
 
  
  function nombrePersonnages(data) {
    return data["ligne"] * data["colonne"];
  }

  function indexPersonnage(data) {
    var nombre_personnages = nombrePersonnages(data);
    return Math.floor((Math.random() * nombre_personnages));}

function personnageChoisi(data) {
  return data["possibilites"][indexPersonnage(data)];}



  