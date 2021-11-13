const { verify } = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) return res.status(401).send({ message: 'unauthorized user' });

  const [, token] = authToken.split(' ');

  try {
    const decoded = verify(token, process.env.TOKEN);

    req.id = decoded['id'];
    return next();
  } catch {
    return res.status(401).send({ message: 'invalid token' });
  }
};
