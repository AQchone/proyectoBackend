const express = require("express");
const router = express.Router();

router.get("/current", (req, res) => {
  if (req.user) {
    res.json({ status: "success", payload: req.user });
  } else {
    res.json({ status: "error", message: "No hay sesión activa" });
  }
});

module.exports = router;
