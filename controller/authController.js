const User = require("../model/User");

async function login(req, res) {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    res.status(400).json({ message: "Email and password is required" });
    return;
  }
  const user = await User.findOne({ userMail: email });
  console.log(user);

  if (user && password === user.userPassword) {
    res.json({ userMail: email, message: "Login successful" });
  } else {
    res.status(401).json({ message: "Login failed" });
  }
}

module.exports = { login };
