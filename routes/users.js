const express = require("express");
const router = express.Router();
const connection = require("../db");
const bcrypt = require("bcrypt");

// GET all users
router.get("/", (req, res) => {
  connection.query(
    "SELECT user_id, email, role, is_active, created_at FROM Users",
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// GET a specific user by ID
router.get("/get", (req, res) => {
  const { user_id } = req.body;

  connection.query(
    "SELECT user_id, email, role, is_active, created_at FROM Users WHERE user_id = ?",
    [user_id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (results.length === 0) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json(results[0]);
      }
    }
  );
});

// CREATE a new user
router.post("/create", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if user already exists
    connection.query(
      "SELECT * FROM Users WHERE email = ?",
      [email],
      async (checkErr, checkResults) => {
        if (checkErr) {
          return res.status(500).json({ error: checkErr.message });
        }

        if (checkResults.length > 0) {
          return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user
        const query = `
          INSERT INTO Users (email, password, role) 
          VALUES (?, ?, ?)
        `;
        const values = [email, hashedPassword, role];

        connection.query(query, values, (err, results) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.status(201).json({
              message: "User added successfully",
              user_id: results.insertId,
            });
          }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE an existing user
router.put("/update", (req, res) => {
  const { user_id, email, role, is_active } = req.body;

  const query = `
    UPDATE Users 
    SET email = ?, role = ?, is_active = ?
    WHERE user_id = ?
  `;
  const values = [email, role, is_active, user_id];

  connection.query(query, values, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({ message: "User updated successfully" });
    }
  });
});

// DELETE a user
router.delete("/delete", (req, res) => {
  const { user_id } = req.body;

  connection.query(
    "DELETE FROM Users WHERE user_id = ?",
    [user_id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json({ message: "User deleted successfully" });
      }
    }
  );
});

// User Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM Users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const user = results[0];

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Update last login
      connection.query(
        "UPDATE Users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?",
        [user.user_id],
        (updateErr) => {
          if (updateErr) {
            console.error("Failed to update last login:", updateErr);
          }
        }
      );

      res.status(200).json({
        message: "Login successful",
        user_id: user.user_id,
        role: user.role,
      });
    }
  );
});

module.exports = router;

// const bcrypt = require("bcrypt");
// const db = require("../config/database");

// // Create User
// exports.createUser = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;

//     // Check if user already exists
//     const [existingUsers] = await db.query(
//       "SELECT * FROM Users WHERE email = ?",
//       [email]
//     );

//     if (existingUsers.length > 0) {
//       return res.status(400).json({
//         message: "User already exists",
//       });
//     }

//     // Hash password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Insert user
//     const [result] = await db.query(
//       "INSERT INTO Users (email, password, role) VALUES (?, ?, ?)",
//       [email, hashedPassword, role]
//     );

//     res.status(201).json({
//       message: "User created successfully",
//       userId: result.insertId,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error creating user",
//       error: error.message,
//     });
//   }
// };

// // Get All Users
// exports.getAllUsers = async (req, res) => {
//   try {
//     const [users] = await db.query(
//       "SELECT user_id, email, role, is_active, created_at FROM Users"
//     );
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({
//       message: "Error fetching users",
//       error: error.message,
//     });
//   }
// };

// // Get User by ID
// exports.getUserById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const [users] = await db.query(
//       "SELECT user_id, email, role, is_active, created_at FROM Users WHERE user_id = ?",
//       [id]
//     );

//     if (users.length === 0) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     res.status(200).json(users[0]);
//   } catch (error) {
//     res.status(500).json({
//       message: "Error fetching user",
//       error: error.message,
//     });
//   }
// };

// // Update User
// exports.updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { email, role, is_active } = req.body;

//     // Check if user exists
//     const [existingUsers] = await db.query(
//       "SELECT * FROM Users WHERE user_id = ?",
//       [id]
//     );

//     if (existingUsers.length === 0) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     // Update user
//     await db.query(
//       "UPDATE Users SET email = ?, role = ?, is_active = ? WHERE user_id = ?",
//       [email, role, is_active, id]
//     );

//     res.status(200).json({
//       message: "User updated successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error updating user",
//       error: error.message,
//     });
//   }
// };

// // Delete User
// exports.deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Check if user exists
//     const [existingUsers] = await db.query(
//       "SELECT * FROM Users WHERE user_id = ?",
//       [id]
//     );

//     if (existingUsers.length === 0) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     // Delete user
//     await db.query("DELETE FROM Users WHERE user_id = ?", [id]);

//     res.status(200).json({
//       message: "User deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error deleting user",
//       error: error.message,
//     });
//   }
// };

// // User Login
// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user
//     const [users] = await db.query("SELECT * FROM Users WHERE email = ?", [
//       email,
//     ]);

//     if (users.length === 0) {
//       return res.status(400).json({
//         message: "Invalid credentials",
//       });
//     }

//     const user = users[0];

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({
//         message: "Invalid credentials",
//       });
//     }

//     // Update last login
//     await db.query(
//       "UPDATE Users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?",
//       [user.user_id]
//     );

//     res.status(200).json({
//       message: "Login successful",
//       userId: user.user_id,
//       role: user.role,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Login error",
//       error: error.message,
//     });
//   }
// };
