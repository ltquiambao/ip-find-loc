const path = require("path");
const debug = require("debug")(
  `ip-find-loc:${path.dirname(__filename)}/${path.basename(__filename)}`
);
const axios = require("axios");
const jwt = require("jsonwebtoken");
const IpFindApiRequest = require("../lib/IpFindApiRequest");

async function getLocationFromIp(req, res, next) {
  const { ip: ipToFetch } = req.params;

  const apiReq = new IpFindApiRequest();
  if (ipToFetch) {
    apiReq.setIp(ipToFetch);
  } else {
    apiReq.setOwnIp();
  }

  const url = apiReq.setApiKey().build();
  debug(`[getLocationFromIp]: url: ${url}`);
  try {
    const response = await axios.get(url);
    const data = response.data;
    debug(`[getLocationFromIp][success]: ${data.ip_address}`);
    res.status(200).json(data);
  } catch (err) {
    debug(`[getLocationFromIp][failed]: ${err.message}`);
    next(err);
  }
}

// Authentication

async function registerUser(req, res, next) {
  res.json({});
}

async function loginUser(req, res, next) {
  // Authenticate User
  const { email, password } = req.body;
  const users = require("../db/mock/users.json");
  const registeredUser = users.find(
    (user) => user.email === email && user.password === password
  );

  if (registeredUser) {
    const accessToken = generateAccessToken(registeredUser);
    res.json({ auth: true, accessToken });
  } else {
    res
      .status(400)
      .json({ auth: false, message: "incorrect email and password" });
  }
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "60s",
  });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    debug(`[authenticateToken][success]: ${user.username}`);
    req.username = user.username;
    next();
  });
}

module.exports = {
  getLocationFromIp,
  registerUser,
  loginUser,
  authenticateToken,
};
