const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    const token = jwt.sign({ id: user.id }, env('JWT_SECRET'), {
      expiresIn: '7d',
    });
    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.logout = async (req, res) => {
  try {
    res.status(200).json({ message: 'Logged out' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
