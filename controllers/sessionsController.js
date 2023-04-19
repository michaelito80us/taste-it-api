const bcrypt = require('bcrypt');
const prisma = require('../models/index.js');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.session.slug = user.slug;
    req.session.uid = user.id;
    req.session.save();

    console.log(req.session);

    res.status(200).send({
      message: 'Logged in',
      user: { name: user.name, slug: user.slug },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.logout = async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res
        .status(500)
        .send({ error, message: 'Could not log out, please try again' });
    } else {
      res.clearCookie('sid');
      res.status(200).send({ message: 'Logout successful' });
    }
  });
};
