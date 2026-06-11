OK SO THIS IS A CHAT APP THAT I CREATED... I WILL EXPLAIN IT AS FOLLOWING STEPS....
1.HOW YOU CAN USE AND ACCESS THE APP?
2.THE STRUCTURE OF THE PROGRAMME
3.HOW I CREATED THIS CHAT APP ??
4.THE SERVER AND SOCKET CONNECTION AND HOW I USED SOCKET.IO FOR THIS APP
5.MY FUTURE INTENTIONS WTH THIS APP ..


## HOW YOU CAN USE THIS APP??
  using this app is pretty straightforward ,,i will be deploying this so u can just click on this link 
  here ................... then u can either login or register , if u dont wana register and see how does this work 
  i have demo accs they are {email:son@gmail.com ,pass :john1234} and {email:nahbro@gmail.com,pass:okk} ,, i have chated using these accs
  so there will initially be msges ,, u can message using these accs or register....

  when u login u can see all the register ,,u can see all the registred users when u login and message any registred user ,, I didnt added 
  only friends can message type of thing because i want the users to message any one if registered ,, u can also check inbox to see who message u ,, rn this may not be shown in order coz i havent used sort when finding users from db.. so thats all u can click on any users and send message.


## THE STRUCTURE OF THE PROGRAMME!!!
    evergreen/
    ├── routes/
    │   ├── functionality.js
    │   └── login.js
    ├── .env
    ├── .gitignore
    ├── db.js
    ├── index.html
    ├── main.js
    ├── package.json
    ├── package-lock.json
    └── README.md

    This is the structure of my programme ,, the main.js is the main server file containing socket logic ,,major middlewares and 
    the routes (functionality.js and login.js ) connected to it.

    db.js is basically the file containing the database connection logic and all the models (collections) i created

    index.html is single page frontend ,,and good stuff is i did minimal work in frontend,, claude did the most part of frontend ,, shoutout to claude ..

    and lastly i have routes which contains functionality and login.js rn ,, in functionality.js ,, i have routes that gets registred users (/users),lets us post message to a specefic users (/msg/:email) shows the users who messaged us (loged in user) (/msg), ,, see the msged sent to logedin user by speceic account get (/msg/:email) where we show received and sent msges betn users from msg saved from database ...,, 
    rn the sent msg is saved by the socket implementation ,,rn sockets save the sent message in db as well ,, but i didnt removed the route method as well ,, i haven't implemented the server side logout route ,,and other good functionality ,, these are just addons ,,and i may add these features gradually.. 

## HOW I CRETATED THIS CHATAPP!!!
 creating the routes of the app was straightforward ,, because of my intention ,, i didnt need to takecare of friend system between users ,, 
 so i created these routes and simple server first ,, i created register route first then the login route , then the JWT TOKEN CREATION ,, and a middleware to verify the jwttoken ,,, later i created functionality.js to mmke extra functionality ,, when i didnt had sockets ,, i was sending ,receiveing and rendering msgs from the database ,,and user neded to login again to see the message ,, i checked everything from postman and then i commanded claude to make me frontend dit ltl tweaks ,, and connected the frontend wth server with CORS ,, then i implemented sockets ,, before i didnt know how to setup socket server and all ,, so i looked up the documentation and tried a little implementation of sockets ,,so now i can send and receive msg at realtime .. and now the step is to deploy.


## THE SERVER AND SOCKET CONNECTION AND HOW It works 
  HERE I FIRST DID THE SETUP THING AS SAID BY THE DOCUMENTATION ,, LIKE IMPORTING HTTP ,SOCKET IO ,,CREATING SERVER FOR SOCKET AND WRAPPING OUR EXPRESS APP IN IT ,.. and creating new server obj io .. where i passed the created server and cors.. one thing is the socket can now map socket.id with the jwt token ,, as we have socket.hanshake.auth.token inside io's middleware ,,this token is passed by the client (frontend)...
  in front end the socket sends and receives message like this !!!


  when users is render inside render user func ,,a btn is there that calls open chat  func ,,where the email and name of the person whose chat we click'
  gets passed ,,then the open chat pass that to load users and  ,,, now that we have chat target lets say user2 is pressed by user 1 so chat target is user2 for user 1 ,, 
  we dont have stm of sending msg using websocket when B isnt opening the chat of A at the same time ,,, that task is done by loading db,,, so dont get confused  ,,
  so this means socket is active only when both open each other's chat and A chattarget is B and vice versa ,, so when A decide to send msg to B ,,for B ,A is the chattarget for B as B is 
  opening A's chat also A sends the msg ,, it calls sendMsg of frontend where socket.user is A ,,from that the send msg is emmitted to server ,,where email=socket.user.email that is A's email,,
  which emits a new event but to the user that is online to whom A's chat target is ,, now since it was emmitted TO ,,now the user is B so we use data.from and not directly socket.user.email ,,coz that is B now 
  since server did io.to(receiver).emit(),, so now for b both chat target and data.from =A therefore the last socket.on(newMessage) will be run coz its inside if cndn 

  so this is kinda how socketio sends the message .... 

## MY FUTURE INTENTIONS WTH THIS APP
  I WILL DEF ADD RATELIMITING AND OTHER SAFETY FEATURES ,, I KNOW THAT I HAVE TO ADD IT ,, AND I WILL ,, I DONT WANT SOME DUMB GUY SAYING HAHA 
  WHERE IS RATE LIMITING?? THIS IS HACKED IN SECONDS ... also i may add other functionalities like groups , restrictions, block feature ,,close friend stm and other features like in chatapp ,, BUT THIS IS ME LEARNING AND DISCOVERING SOCKET.IO AND MAKING A PROJECT OUT OF IT ,, THIS IS MY FIRST TIME USING SOCKET.IO ,,SO DONT MIND IF U KNOW MUCH THAN ME !!!!
