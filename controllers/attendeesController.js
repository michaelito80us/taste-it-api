const prisma = require('../models/index.js');

exports.createOrUpdateAttendee = async (req, res) => {
  if (req.user) {
    try {
      const { eventId, numberOfSeats } = req.body;

      // update the existing attendee or add the attendee to the event
      const attendee = await prisma.attendee.upsert({
        where: {
          attendee: {
            eventId,
            userId: req.user.id,
          },
        },
        update: {
          numberOfSeats,
        },
        create: {
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

      // update the total number of attendees for the event
      const aggregations = await prisma.attendee.aggregate({
        where: {
          event: {
            id: eventId,
          },
        },
        _sum: {
          numberOfSeats: true,
        },
      });

      const totalAttendees = aggregations._sum.numberOfSeats;

      const updatedEvent = await prisma.event.update({
        data: {
          totalAttendees: {
            set: totalAttendees,
          },
        },
        where: {
          id: eventId,
        },
      });

      await res.status(201).json({ attendee, updatedEvent });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  } else {
    res.status(401).json({ error: 'not logged in' });
  }
};

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

exports.updateEvent = async (req, res) => {
  if (req.user) {
    try {
      const { eventId, newNumberOfSeats, oldNumberOfSeats } = req.body;
      const attendee = await prisma.attendee.findUnique({
        where: {
          id,
        },
      });
      if (numberOfSeats === 0) {
        await prisma.attendee.delete({
          where: {
            id: req.user.id,
          },
        });
      }
    } catch (error) {}
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
