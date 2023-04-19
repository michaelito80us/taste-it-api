const prisma = require('../models/index.js');

const authMiddleware = async (req, res, next) => {
  const { slug } = await req.session;
  console.log('FROM AUTH MIDDLEWARE: ', req.session);
  if (!slug) {
    next();
  } else {
    try {
      const user = await prisma.user.findUnique({
        where: {
          slug,
        },
      });
      // if (!user) throw new Error();
      req.user = user;
      next();
    } catch (err) {
      console.log({ err });
      return res.sendStatus(401);
    }
  }
};

module.exports = authMiddleware;
