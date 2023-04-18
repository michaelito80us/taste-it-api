const prisma = require('../models/index.js');
const randomstring = require('randomstring');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.createUser = async (req, res) => {
  let slug = randomstring.generate(6);
  while (await prisma.slug.findUnique({ where: { slug } })) {
    slug = randomstring.generate(6);
  }

  try {
    const { name, email, password } = req.body;

    bcrypt.hash(password, saltRounds, async function (err, hash) {
      const user = await prisma.user.create({
        data: {
          slug,
          name,
          email,
          password: hash,
        },
      });
      res.status(201).json(user);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const {
      name,
      email,
      username,
      password,
      photoUrl,
      phone,
      instagram,
      twitter,
      facebook,
    } = req.body;
    const user = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        name,
        email,
        username,
        password,
        photoUrl,
        phone,
        instagram,
        twitter,
        facebook,
      },
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
