const prisma = require('../models/index.js');
const randomstring = require('randomstring');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.createUser = async (req, res) => {
  let slug = randomstring.generate(6);
  while (await prisma.slug.findUnique({ where: { slug } })) {
    slug = randomstring.generate(6);
  }

  await prisma.slug.create({
    data: {
      slug,
    },
  });

  try {
    const { name, email, password } = req.body;

    if (name && email && password) {
      if (await prisma.user.findFirst({ where: { email } }))
        res.status(409).json({ msg: 'email already in use' });
      else {
        bcrypt
          .hash(password, saltRounds)
          .then(async (hash) => {
            const user = await prisma.user.create({
              data: {
                slug,
                name,
                email,
                password: hash,
              },
            });
            req.session.slug = user.slug;
            req.session.uid = user.id;
            req.session.save();

            console.log('this is the cookie that will be sent: ', req.session);

            res.status(201).json({
              user: { username: user.email, id: user.id, slug: user.slug },
            });
          })
          .catch((err) => console.error(err.message));
      }
    } else {
      res.status(400).json({ msg: 'all fields are mandatory' });
    }
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
