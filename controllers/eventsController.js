const prisma = require('../models/index.js');
const randomstring = require('randomstring');

const createSlug = async () => {
  let slug = randomstring.generate(7);
  while (await prisma.slug.findUnique({ where: { slug } })) {
    slug = randomstring.generate(7);
  }

  await prisma.slug.create({
    data: {
      slug,
    },
  });

  return slug;
};

exports.createOrUpdateEvent = async (req, res) => {
  if (req.user) {
    try {
      console.log('REQ.BODY:::::::::::', req.body);

      const {
        id,
        slug,
        eventName,
        description,
        startDate,
        endDate,
        startTime,
        endTime,
        startDateTime,
        endDateTime,
        hasMaxAttendees,
        maxAttendees,
        venueName,
        venueAddress,
        pictureUrl,
      } = req.body;

      if (endDateTime < startDateTime) {
        res
          .status(400)
          .json({
            type: 'endBeforeStart',
            msg: 'end date cannot be before start date',
          });
      }
      // if ()

      const eventCreatorId = req.user.id;

      const event = await prisma.event.upsert({
        where: {
          id,
        },
        update: {
          eventName,
          description,
          startDate,
          endDate,
          startTime,
          endTime,
          startDateTime,
          endDateTime,
          hasMaxAttendees,
          maxAttendees,
          venueName,
          venueAddress,
          pictureUrl,
        },
        create: {
          slug,
          eventName,
          description,
          startDate,
          endDate,
          startTime,
          endTime,
          startDateTime,
          endDateTime,
          hasMaxAttendees,
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
  } else {
    res.status(401).json({ msg: 'unauthorized' });
  }
};

exports.createEvent = async (req, res) => {
  let slug = await createSlug();

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
        isActive: true,
        // isActive: isActive === 'true',
        hasMaxAttendees: hasMaxAttendees === 'true',
        maxAttendees: Number(maxAttendees),
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
        activeEvent: {
          slug: req.params.slug,
          isActive: true,
        },
      },
    });
    console.log('REQ.USER --->', req.user);
    if (req.user && req.user.id === event.eventCreatorId) {
      const event = await prisma.event.findUnique({
        where: {
          slug: req.params.slug,
        },
        include: {
          Attendee: {
            include: {
              user: {
                select: {
                  slug: true,
                  name: true,
                  email: true,
                  photoUrl: true,
                },
              },
            },
          },
        },
      });

      if (event.Attendee.find((attendee) => attendee.userId === req.user.id))
        event['isUserGoing'] = true;
      else event['isUserGoing'] = false;

      console.log('EVENT IF THE USER IS CREATOR:', event);

      res.status(200).json({ event });
    } else if (req.user) {
      const event = await prisma.event.findUnique({
        where: {
          activeEvent: {
            slug: req.params.slug,
            isActive: true,
          },
        },
        include: {
          Attendee: {
            where: {
              userId: req.user.id,
            },
          },
        },
      });

      if (event) {
        if (event.Attendee.find((attendee) => attendee.userId === req.user.id))
          event['isUserGoing'] = true;
        else event['isUserGoing'] = false;

        console.log('EVENT IF THE USER IS NOT CREATOR:', event);

        res.status(200).json({ event });
      } else {
        res.status(400).json({ msg: 'event not found' });
      }
    } else {
      if (event) {
        event['userType'] = 'guest';
        console.log('EVENT IF THE USER IS GUEST:', event);

        res.status(200).json({ event });
      } else {
        res.status(400).json({ msg: 'event not found' });
      }
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
      include: {
        Attendee: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                photoUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDateTime: 'asc',
      },
    });

    const pastEvents = [];
    const futureEvents = [];

    events.forEach((event) => {
      if (event.startDateTime < new Date()) pastEvents.push(event);
      else futureEvents.push(event);
    });
    res.status(200).json({ past: pastEvents, upcoming: futureEvents });
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
            userId: attendee.id,
          },
        },
      },
      orderBy: {
        startDateTime: 'asc',
      },
    });
    const pastEvents = [];
    const futureEvents = [];

    events.forEach((event) => {
      if (event.startDateTime < new Date()) pastEvents.push(event);
      else futureEvents.push(event);
    });
    res.status(200).json({ past: pastEvents, upcoming: futureEvents });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
