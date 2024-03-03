const CCTV = require("../model/CCTV");
const UserProfile = require("../model/UserProfile");

async function getUserDetails(req, res) {
  const _userMail = req.body.userMail;

  const userProfile = await UserProfile.findOne({
    userMail: _userMail,
  }).exec();
  const cctvData = await CCTV.findOne({ userMail: _userMail });

  if (!userProfile) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    userProfile,
    cctvData,
  });
}

module.exports = { getUserDetails };
