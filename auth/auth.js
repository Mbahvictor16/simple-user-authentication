const user = require("../models/user");

function authUser(req, res, next) {
  if (res.json.id == null) {
    res.send("You need to sign in");
  } else {
    next();
  }
}

async function setUser(req, res, next) {
  const userID = res.json.id;

  if (userID) {
    let userId = await user.findById(userID);

    res.json({ userId: userId });
  }

  next();
}

module.exports = { authUser, setUser };
