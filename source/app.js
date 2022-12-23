require('dotenv').config()

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
let stream = require("./stream/stream");
let path = require("path");

const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '603870612904-sv4p7pu7jj9fnplq2sv59u0f7r1h4ktc.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

app.use(express.json());
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/front.html");
});

app.post('/', (req,res)=>{
  let token = req.body.token;

  async function verify() {
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
    }
    verify()
    .then(()=>{
        res.cookie('session-token', token);
        res.send('success')
    })
    .catch(console.error);

})
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const client_cred_access_token = 'fakeToken';

app.get('/index',checkAuthenticated, async function (req, res) {
      let token = req.cookies['session-token'];
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    let user = {};
    const payload = ticket.getPayload();
    user.name = payload.name;
    user.email = payload.email;
    user.picture = payload.picture;
    res.render(path.join(__dirname, 'index.html'), {name: user.name,image:user.picture});
});

// app.get("/index",checkAuthenticated, (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

app.get("/call",checkAuthenticated, async(req, res) => {
  let token = req.cookies['session-token'];
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    let user = {};
    const payload = ticket.getPayload();
    user.name = payload.name;
    user.email = payload.email;
    user.picture = payload.picture;
    res.render(path.join(__dirname, 'call.html'), {name: user.name,image:user.picture});
  // res.sendFile(__dirname + "/call.html");
});

app.get('/logout', (req, res)=>{
  res.clearCookie('session-token');
  res.redirect('/')

})

function checkAuthenticated(req, res, next){

  let token = req.cookies['session-token'];

  let user = {};
  async function verify() {
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      });
      const payload = ticket.getPayload();
      user.name = payload.name;
      user.email = payload.email;
      user.picture = payload.picture;
      // console.log(user.name,user.email,user.picture)
    }
    verify()
    .then(()=>{
        req.user = user;
        next();
    })
    .catch(err=>{
        res.redirect('/')
    })

}



let server = app.listen(process.env.PORT || 3000, () =>
  console.log("Server is running...")
);
let io = require("socket.io").listen(server);

io.of("/stream").on("connection", stream);
