const express = require("express");
const router = express.Router();
const passport = require("../auth");
const User = require("../models/user.model");

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const user = await User.create({
      first_name,
      last_name,
      email,
      age,
      password,
    });
    res.status(201).json({ status: "success", payload: user });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/login-success",
  })
);

router.get("/login-success", (req, res) => {
  res.json({ status: "success", payload: req.user });
});

router.get("/login-failure", (req, res) => {
  res.json({ status: "error", message: "Usuario o contraseña incorrectos" });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.json({ status: "success", message: "Sesión cerrada" });
});

router.get("/current", (req, res) => {
  if (req.user) {
    res.json({ status: "success", payload: req.user });
  } else {
    res.json({ status: "error", message: "No hay sesión activa" });
  }
});

module.exports = router;
