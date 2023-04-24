const router = require('express').Router();
const authMiddleware = require('./middlewares/auth');

const eventsController = require('./controllers/eventsController.js');
const usersController = require('./controllers/usersController.js');
const attendeesController = require('./controllers/attendeesController.js');
const sessionsController = require('./controllers/sessionsController.js');

// for logging in and out and session management
router.post('/login', sessionsController.login); // finished - tested
router.post('/logout', authMiddleware, sessionsController.logout); // finished - tested
router.get('/auth', authMiddleware, sessionsController.auth);

// for creating and managing events
// router.post('/events', authMiddleware, eventsController.createEvent); // finished - tested
router.post('/events', authMiddleware, eventsController.createOrUpdateEvent); // finished - tested
router.put('/events/:slug', authMiddleware, eventsController.updateEvent); // finished - tested
router.delete('/events/:slug', authMiddleware, eventsController.deleteEvent); // finished - tested

// to find events by creator or attendee
router.get('/events/creator', authMiddleware, eventsController.eventsByCreator); // finished - tested
router.get(
  '/events/attendee',
  authMiddleware,
  eventsController.eventsByAttendee
); // finished - tested
router.get('/event/:slug', authMiddleware, eventsController.getEvent); // finished - tested

// for creating and managing users
router.post('/register', usersController.createUser); // finished - tested
router.put('/users/:slug', authMiddleware, usersController.updateUser);

// joining and leaving events
router.post(
  '/attendees',
  authMiddleware,
  attendeesController.createOrUpdateAttendee
);
// router.delete(
//   '/attendees/:slug',
//   authMiddleware,
//   attendeesController.leaveEvent
// );

module.exports = router;
