const express = require('express');
const app = express();
var cors = require('cors');
const SERVER_PORT = process.env.SERVER_PORT || 3001;
const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');

const router = require('./router');
const eventsRouter = require('./eventsRouter');

// TODO: add cors config
const corsConfig = {
  origin: [
    'http://localhost:3000',
    'https://go-taste.it',
    'https://go-taste.it/',
    'https://www.go-taste.it',
    'https://master--fanciful-snickerdoodle-5bb1b6.netlify.app',
    'https://fanciful-snickerdoodle-5bb1b6.netlify.app',
    'https://6cbc-45-133-139-102.ngrok-free.app',
  ],
  credentials: true,
};

app.use(cors(corsConfig));
app.use(express.json());

// TODO: modify the sessions security settings
app.enable('trust proxy');

app.use(
  session({
    name: 'sid',
    saveUninitialized: false,
    resave: false,
    secret: process.env.SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1yr
      sameSite: false,
      // sameSite: 'none',
      httpOnly: false,
      // we would want to set secure=true in a production environment
      secure: false,
      // secure: true,
    },
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

// app.use('/events', eventsRouter);

app.use(router);
app.get('*', (req, res) => {
  res.status(404).send('Sorry, not found 😞');
});

app.listen(SERVER_PORT, () => {
  console.log(`🚀 Amazing app listening on port ${SERVER_PORT}`);
});
