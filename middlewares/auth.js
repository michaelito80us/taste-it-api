const prisma = require('../models/index.js');

const authMiddleware = async (req, res, next) => {
  try {
    const { slug } = req.session;
    const user = await prisma.user.findUnique({
      where: {
        slug,
      },
    });
    // if (!user) throw new Error();
    req.user = user;
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
};

module.exports = authMiddleware;
