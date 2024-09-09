const User = require("../models/users.model");

// Create User
exports.createUser = async (req, res) => {
  try {
    const { client_id, client_secret, refresh_token, resource_id, email } =
      req.body;

    // Check if all required fields are present
    if (
      !client_id ||
      !client_secret ||
      !refresh_token ||
      !resource_id ||
      !email
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user with the same resource_id already exists
    const existingUser = await User.findOne({ resource_id });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this resource ID already exists." });
    }

    // Create a new user
    const newUser = new User({
      client_id,
      client_secret,
      refresh_token,
      resource_id,
      email,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Update User by resource_id
exports.updateUser = async (req, res) => {
  try {
    const { resource_id } = req.params;
    const { client_id, client_secret, refresh_token, email } = req.body;

    // Find the user by resource_id
    const user = await User.findOne({ resource_id });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update user details
    if (client_id) user.client_id = client_id;
    if (client_secret) user.client_secret = client_secret;
    if (refresh_token) user.refresh_token = refresh_token;

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
