const prisma = require('../models/index.js');
const randomstring = require('randomstring');

exports.createEvent = async (req, res) => {
  let slug = randomstring.generate(6);
  while (await prisma.slug.findUnique({ where: { slug } })) {
    slug = randomstring.generate(6);
  }
  try {
    const {
      eventName,
      description,
      startDateTime,
      endDateTime,
      isActive,
      maxAttendees,
      venueName,
      venueAddress,
      pictureUrl,
      eventCreatorId,
    } = req.body;

    const event = await prisma.event.create({
      data: {
        slug,
        eventName,
        description,
        startDateTime,
        endDateTime,
        isActive,
        maxAttendees,
        venueName,
        venueAddress,
        pictureUrl,
        eventCreator: {
          connect: {
            id: eventCreatorId,
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
  try {
    const {
      eventName,
      description,
      startDateTime,
      endDateTime,
      isActive,
      maxAttendees,
      venueName,
      venueAddress,
      pictureUrl,
      isStarted,
      isFinished,
      totalAttendees,
    } = req.body;

    const event = await prisma.event.update({
      where: {
        slug: req.params.slug,
      },
      data: {
        eventName,
        description,
        startDateTime,
        endDateTime,
        isActive,
        maxAttendees,
        venueName,
        venueAddress,
        pictureUrl,
        isStarted,
        isFinished,
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
    res.status(200).json({ event, attendees });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await prisma.event.delete({
      where: {
        slug: req.params.slug,
      },
    });
    res.status(200).json(event);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.eventsByCreator = async (req, res) => {
  try {
    const creator = await prisma.user.findUnique({
      where: {
        slug: req.params.slug,
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
        slug: req.params.slug,
      },
    });
    const events = await prisma.event.findMany({
      where: {
        attendees: {
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
