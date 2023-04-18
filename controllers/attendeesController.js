const prisma = require('../models/index.js');

exports.joinEvent = async (req, res) => {
  try {
    const { userId, eventId, numberOfSeats } = req.body;
    const attendee = await prisma.attendee.create({
      data: {
        numberOfSeats,
        user: {
          connect: {
            id: userId,
          },
        },
        event: {
          connect: {
            id: eventId,
          },
        },
      },
    });
    const updateEvent = await prisma.event.update({
      data: {
        currentAttendees: {
          increment: numberOfSeats,
        },
      },
      where: {
        id: eventId,
      },
    });
    await res.status(201).json(attendee);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.leaveEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const attendee = await prisma.attendee.findUnique({
      where: {
        id,
      },
    });
    const { eventId, numberOfSeats } = attendee;

    await prisma.event.update({
      data: {
        currentAttendees: {
          decrement: numberOfSeats,
        },
      },
      where: {
        id: eventId,
      },
    });
    await prisma.attendee.delete({
      where: {
        id,
      },
    });
    res.status(200).json(attendee);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
