const CCTV = require("../model/CCTV");
const UserProfile = require("../model/UserProfile");
const User = require("../model/User");
const Admin = require("../model/Admin");

async function getUserDetails(req, res) {
  const _userMail = req.body.userMail;
  const isAdmin = req.body.isAdmin;

  if (isAdmin) {
    const adminProfile = await Admin.findOne({
      adminMail: _userMail,
    }).exec();
    res.json({
      fullName: adminProfile.adminName,
      city: adminProfile.adminCity,
      email: adminProfile.adminMail,
    });
    return;
  }

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

async function getAllUserDetails(req, res) {
  try {
    // Fetch all user profiles
    const userProfiles = await UserProfile.find().exec();

    // Fetch CCTV data for each user
    const userDetails = await Promise.all(
      userProfiles.map(async (profile) => {
        const cctvData = await CCTV.findOne({
          userMail: profile.userMail,
        }).exec();
        return {
          name: profile.userName,
          city: profile.userCity,
          email: profile.userMail,
          password: "*********",
          cctvIp: cctvData.ips || {}, // Provide an empty object if CCTV data is not found
        };
      })
    );

    res.json(userDetails);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
async function createUser(req, res) {
  try {
    const { userName, userCity, userMail, password, cctvIp } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ userMail }).exec();
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user profile
    const userProfile = new UserProfile({
      userName,
      userCity,
      userMail,
      noOfCCTV: cctvIp.length,
    });
    await userProfile.save();

    // Create CCTV data for the user
    const cctvData = new CCTV({
      userMail,
      ips: cctvIp,
    });
    await cctvData.save();

    // Create a new user in the Users collection
    const user = new User({
      userMail,
      userPassword: password,
    });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function removeUser(req, res) {
  try {
    const userMail = req.body.userMail;
    console.log(userMail);
    // Remove user profile
    await UserProfile.deleteMany({ userMail }).exec();

    // Remove CCTV data
    await CCTV.deleteMany({ userMail }).exec();

    // Remove user from Users collection
    await User.deleteMany({ userMail }).exec();

    res.status(200).json({ message: "User data removed successfully" });
  } catch (error) {
    console.error("Error removing user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateAdminDetails(req, res) {
  try {
    const { adminMail, fullName, city } = req.body;

    console.log(adminMail, fullName, city);
    // Find the admin profile
    let adminProfile = await Admin.findOne({ adminMail }).exec();
    if (!adminProfile) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update admin details
    adminProfile.adminName = fullName;
    adminProfile.adminCity = city;
    await adminProfile.save();

    res.status(200).json({ message: "Admin details updated successfully" });
  } catch (error) {
    console.error("Error updating admin details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getUserDetails,
  getAllUserDetails,
  createUser,
  removeUser,
  updateAdminDetails,
};
