const express = require('express');
const app = express();
var cors = require('cors');
const SERVER_PORT = process.env.SERVER_PORT || 3001;
const sessions = require('express-session');
const cookieParser = require('cookie-parser');

const router = require('./router');

const corsConfig = {
  origin: 'http://localhost:3000',
  credentials: true,
};

const corsConfig2 = {};

app.use(cors());
app.use(express.json());

app.use(cookieParser());

app.use(
  sessions({
    name: 'sid',
    saveUninitialized: false,
    resave: true,
    secret: process.env.SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1yr
      sameSite: false,
      httpOnly: true,
      // we would want to set secure=true in a production environment
      secure: false,
    },
  })
);

app.use(router);
app.get('*', (req, res) => {
  res.status(404).send('Sorry, not found 😞');
});

app.listen(SERVER_PORT, () => {
  console.log(`🚀 Amazing app listening on port ${SERVER_PORT}`);
});
