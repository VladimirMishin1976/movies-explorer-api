const allowedCorse = ['http://movies.mishin.nomoredomains.club',
  'https://movies.mishin.nomoredomains.club',
  'https://movies-frontend-git-main-vladimirmishin1976.vercel.app',
  'https://movies-frontend-vladimirmishin1976.vercel.app/',
  'https://movies-frontend-vladimirmishin1976.vercel.app/',
  'http://localhost:3000',
  '*'];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  // const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCorse.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    return res.end();
  }
  return next();
};
