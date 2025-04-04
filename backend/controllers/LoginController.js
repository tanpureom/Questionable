const { UserCollection, validateUser } = require('../models/UserModel');
const { AdminCollection, validateAdmin } = require('../models/AdminSchema.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleRegisterUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate user input using Joi
    const result = validateUser(req.body);
    if (result) {
      return res.status(400).json({ message: result.details[0].message, success: false });
    }

    // Check if the user already exists
    const existingUser = await UserCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists..!!!", success: false });
    }

    // Create new user
    const newUser = new UserCollection({ username, password });
    newUser.password = await bcrypt.hash(password, 10);
    await newUser.save();

    return res.status(201).json({ message: "User created successfully..!!!", success: true });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const handleAdminRegister = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate user input using Joi
    const result = validateAdmin(req.body);
    if (result) {
      return res.status(400).json({ message: result.details[0].message, success: false });
    }

    // Check if the user already exists
    const existingUser = await AdminCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists..!!!", success: false });
    }

    // Create new user
    const newUser = new AdminCollection({ username, password });
    newUser.password = await bcrypt.hash(password, 10);
    await newUser.save();

    return res.status(201).json({ message: "User created successfully..!!!", success: true });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
}

const handleLoginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate user input using Joi
    const result = validateUser(req.body);
    if (result) {
      return res.status(400).json({ message: result.details[0].message });
    }

    // Check if the user already exists
    const existingUser = await UserCollection.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exists..!!!", success: false });
    }

    const isEqual = await bcrypt.compare(password, existingUser.password);

    if (!isEqual) {
      return res.status(400).json({ message: "Password does not match..!!!", success: false });
    }

    const jsonWebToken = jwt.sign(
      { username: existingUser.username, password: existingUser.password },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    return res.status(200).json({
      message: "Login Successfull..!!!",
      user: username,
      token: jsonWebToken,
      success: true,
    })

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleVerifyToken = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({
      message: "Unauthorized, JWT token required..!!!",
      success: false
    })
  }

  try {
    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded) {
      return res.status(200).json({
        message: "Decoded successfully..!!!",
        success: true
      })
    }

  } catch (error) {
    return res.status(401).json({ error: 'Invalid token', success: false });
  }

};

const handleAdminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Login attempt with username:", username);

    // ✅ Step 1: Validate Input
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required." });
    }

    // ✅ Step 2: Check If Admin Exists
    const admin = await AdminCollection.findOne({ username });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found." });
    }

    // ✅ Step 3: Compare Passwords
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid password.", admin: admin.username });
    }

    // ✅ Step 4: Generate JWT Token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // ✅ Step 5: Send Response
    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      data: { username: admin.username }
    });

  } catch (error) {
    console.error("Error in handleAdminLogin:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// const handleAdminLogin = async (req, res) => {
//   try {
//     const { username, password, role } = req.body;

//     // ✅ Step 1: Validate Input
//     if (!username || !password || !role) {
//       return res.status(400).json({ success: false, message: "Username, password and role are required" });
//     }

//     // ✅ Step 2: Check If Admin Exists
//     const admin = await AdminCollection.findOne({ username });

//     if (!admin) {
//       return res.status(404).json({ success: false, message: "Admin not found" });
//     }

//     // ✅ Step 3: Compare Passwords
//     const isPasswordValid = await bcrypt.compare(password, admin.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ success: false, message: "Invalid password" });
//     }

//     // ✅ Step 4: Generate JWT Token
//     const token = jwt.sign(
//       { id: admin._id, username: admin.username, role: admin.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '2h' }
//     );

//     // ✅ Step 5: Send Response
//     res.status(200).json({
//       success: true,
//       message: "Login successful..!!!",
//       token,
//       data: { username: admin.username, role: admin.role }
//     });

//   } catch (error) {
//     console.error("Error in handleAdminLogin:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// const handleAdminRegister = async (req, res) => {
//   try {
//     const { username, password, role } = req.body;

//     console.log(req.body);

//     // ✅ Step 1: Validate Input
//     const error = validateAdmin({ username, password, role });
//     if (error) {
//       return res.status(400).json({ success: false, message: error.details[0].message });
//     }

//     // ✅ Step 2: Check if Admin Already Exists
//     const existingAdmin = await AdminCollection.findOne({ username });
//     if (existingAdmin) {
//       return res.status(409).json({ success: false, message: "Admin with this username already exists." });
//     }

//     // ✅ Step 3: Hash Password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // ✅ Step 4: Create Admin
//     const newAdmin = new AdminCollection({
//       username,
//       password: hashedPassword,
//       role
//     });

//     await newAdmin.save();

//     // ✅ Step 5: Response
//     res.status(201).json({
//       success: true,
//       message: "Admin registered successfully.",
//       data: { username: newAdmin.username, role: newAdmin.role }
//     });

//   } catch (error) {
//     console.error("Error in handleAdminRegister:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };


module.exports = {
  handleRegisterUser,
  handleLoginUser,
  handleVerifyToken,
  handleAdminLogin,
  handleAdminRegister
};