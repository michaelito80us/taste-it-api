const prisma = require('../models/index.js');
const randomstring = require('randomstring');

exports.createEvent = async (req, res) => {
  let slug = randomstring.generate(7);
  while (await prisma.slug.findUnique({ where: { slug } })) {
    slug = randomstring.generate(7);
  }
  try {
    console.log('REQ.BODY:::::::::::', req.body);

    const {
      eventName,
      description,
      startDateTime,
      endDateTime,
      isActive,
      hasMaxAttendees,
      maxAttendees,
      venueName,
      venueAddress,
      pictureUrl,
    } = req.body;

    // TODO: check that startDateTime is before endDateTime
    // TODO: make sure that all mandatory fields are present

    const eventCreatorId = req.user.id;

    const event = await prisma.event.create({
      data: {
        slug,
        eventName,
        description,
        startDateTime,
        endDateTime,
        isActive: isActive === 'true',
        hasMaxAttendees: hasMaxAttendees === 'true',
        maxAttendees,
        venueName,
        venueAddress,
        pictureUrl,
        eventCreator: {
          connect: {
            id: Number(eventCreatorId),
          },
        },
      },
    });
    res.status(201).json(event);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.updateEvent = async (req, res) => {
  if (req.user.id !== Number(req.body.eventCreatorId)) {
    return res.status(401).json({ error: 'not your event' });
  }

  // TODO: check that startDateTime is before endDateTime
  // TODO: if changing max attendees, check that there are not more attendees than new max attendees
  //

  try {
    const {
      eventName,
      description,
      startDateTime,
      endDateTime,
      isActive,
      hasMaxAttendees,
      maxAttendees,
      venueName,
      venueAddress,
      pictureUrl,
      isStarted,
      isFinished,
      totalAttendees,
    } = req.body.new;

    const event = await prisma.event.update({
      where: {
        slug: req.params.slug,
      },
      data: {
        eventName,
        description,
        startDateTime,
        endDateTime,
        isActive: isActive === 'true',
        hasMaxAttendees: hasMaxAttendees === 'true',
        maxAttendees,
        venueName,
        venueAddress,
        pictureUrl,
        isStarted: isStarted === 'true',
        isFinished: isFinished === 'true',
        totalAttendees,
      },
    });
    res.status(201).json(event);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: {
        slug: req.params.slug,
      },
    });
    const attendees = await prisma.attendee.findMany({
      where: {
        eventId: event.id,
      },
      include: {
        user: true,
      },
    });
    if (req.user && req.user.id === event.eventCreatorId) {
      res.status(200).json({ event, attendees });
    } else {
      res.status(200).json({ event });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.deleteEvent = async (req, res) => {
  if (req.user.id !== Number(req.body.eventCreatorId)) {
    return res.status(401).json({ error: 'not your event' });
  }

  try {
    const event = await prisma.event.delete({
      where: {
        slug: req.params.slug,
      },
    });
    res.status(200).json(event);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

exports.eventsByCreator = async (req, res) => {
  try {
    const creator = await prisma.user.findUnique({
      where: {
        slug: req.user.slug,
      },
    });
    const events = await prisma.event.findMany({
      where: {
        eventCreatorId: creator.id,
      },
    });
    res.status(200).json(events);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.eventsByAttendee = async (req, res) => {
  try {
    const attendee = await prisma.user.findUnique({
      where: {
        slug: req.user.slug,
      },
    });
    const events = await prisma.event.findMany({
      where: {
        Attendee: {
          some: {
            id: attendee.id,
          },
        },
      },
    });
    res.status(200).json(events);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
