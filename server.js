const express = require("express");
const doctorsRoutes = require("./routes/doctors"); // Doctors CRUD routes
const hospitalsRoutes = require("./routes/hospitals");
const patientRoutes = require("./routes/patients");
const appointmentRoutes = require("./routes/appointments");
const prescriptionRoutes = require("./routes/prescription");
const feedbackRoutes = require("./routes/feedback");
const billingRoutes = require("./routes/billing");
const login = require("./routes/login");
const cors = require("cors");
const usersRoutes = require("./routes/users");
const receptionistRoutes = require("./routes/receptionists");

const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(cors());

// Use individual routes
app.use("/login", login);
app.use("/doctors", doctorsRoutes);
app.use("/hospitals", hospitalsRoutes);
app.use("/patients", patientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/prescription", prescriptionRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/billing", billingRoutes);
app.use("/users", usersRoutes);
app.use("/receptionists", receptionistRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
