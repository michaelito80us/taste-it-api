const eventsRouter = require('express').Router();
const authMiddleware = require('./middlewares/auth');

const eventsController = require('./controllers/eventsController.js');

eventsRouter.post(
  '/events',
  authMiddleware,
  eventsController.createOrUpdateEvent
); // finished - tested
eventsRouter.put('/events/:slug', authMiddleware, eventsController.updateEvent); // finished - tested
eventsRouter.delete(
  '/events/:slug',
  authMiddleware,
  eventsController.deleteEvent
); // finished - tested

// to find events by creator or attendee
eventsRouter.get(
  '/events/creator',
  authMiddleware,
  eventsController.eventsByCreator
); // finished - tested
eventsRouter.get(
  '/events/attendee',
  authMiddleware,
  eventsController.eventsByAttendee
); // finished - tested
eventsRouter.get('/events/:slug', authMiddleware, eventsController.getEvent); // finished - tested

module.exports = eventsRouter;
