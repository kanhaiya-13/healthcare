const express = require("express");
const connection = require("./db");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const mysql = require("mysql2");

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
const renderInfo = require("./routes/renderInfo");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(cors());
app.use(cookieParser());

const sessionStore = new MySQLStore({}, connection);

app.use(
  session({
    key: "sessions",
    secret: "kanhaiyaaa",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
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
app.use("/renderInfo", renderInfo);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
