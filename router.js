const express = require('express');
const router = express.Router();

const eventsController = require('./controllers/eventsController.js');
const usersController = require('./controllers/usersController.js');
const attendeesController = require('./controllers/attendeesController.js');
const sessionsController = require('./controllers/sessionsController.js');

router.get('/', (req, res) => {
  res.send('Hello World!, can you log in?');
});

// for logging in and out and session management
router.post('/login', sessionsController.login);
router.get('/logout', sessionsController.logout);
router.get('/auth', sessionsController.auth);

// for creating and managing events
router.post('/events', eventsController.createEvent);
router.put('/events/:slug', eventsController.updateEvent);
router.delete('/events/:slug', eventsController.deleteEvent);

// to find events by creator or attendee
router.get('/events/:slug', eventsController.getEvent);
router.get('/events/creator/:slug', eventsController.eventsByCreator);
router.get('/events/attendee/:slug', eventsController.eventsByAttendee);

// for creating and managing users
router.post('/users', usersController.createUser);
router.put('/users/:slug', usersController.updateUser);

// joining and leaving events
router.post('/attendees', attendeesController.joinEvent);
router.delete('/attendees/:slug', attendeesController.leaveEvent);

module.exports = router;
