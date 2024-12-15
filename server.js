const express = require("express");
const connection = require("./db"); // MySQL connection
const doctorsRoutes = require("./routes/doctors"); // Doctors CRUD routes
const hospitalsRoutes = require("./routes/hospitals");
const patientRoutes = require("./routes/patients");
const appointmentRoutes = require("./routes/appointments");
const prescriptionRoutes = require("./routes/prescription");
const feedbackRoutes = require("./routes/feedback");
const billingRoutes = require("./routes/billing");
const doctorLogin = require("./routes/doctorLogin");
const cors = require("cors");

const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(cors());

// Use individual routes
app.use("/doctorLogin", doctorLogin);
app.use("/doctors", doctorsRoutes);
app.use("/hospitals", hospitalsRoutes);
app.use("/patients", patientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/prescription", prescriptionRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/billing", billingRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
