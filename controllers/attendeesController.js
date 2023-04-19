const prisma = require('../models/index.js');

exports.joinEvent = async (req, res) => {
  if (req.user) {
    try {
      const { eventId, numberOfSeats } = req.body;
      const attendee = await prisma.attendee.create({
        data: {
          numberOfSeats,
          user: {
            connect: {
              id: req.user.id,
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
          totalAttendees: {
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
  } else {
    res.status(401).json({ error: 'not logged in' });
  }
};

exports.leaveEvent = async (req, res) => {
  // TODO: FIGURE THIS ROUTE OUT
  // if (req.user) {
  //   try {
  //     const { slug } = req.params;
  //     const attendee = await prisma.attendee.findUnique({
  //       where: {
  //         id,
  //       },
  //     });
  //     const { eventId, numberOfSeats } = attendee;
  //     await prisma.event.update({
  //       data: {
  //         totalAttendees: {
  //           decrement: numberOfSeats,
  //         },
  //       },
  //       where: {
  //         id: eventId,
  //       },
  //     });
  //     await prisma.attendee.delete({
  //       where: {
  //         id,
  //       },
  //     });
  //     res.status(200).json(attendee);
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({ error: err });
  //   }
  // }
};
