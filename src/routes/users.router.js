import { Router } from "express";
import { usersManager } from "../managers/usersManager.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await usersManager.findAll();
    res.status(200).json({ message: "Usuarios", users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:idUser", async (req, res) => {
  const { idUser } = req.params;
  try {
    const user = await usersManager.findById(idUser);
    res.status(200).json({ message: "Usuario", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await usersManager.findByEmail(email);
    res.status(200).json({ message: "Usuario", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:idUser", async (req, res) => {
  const { idUser } = req.params;
  try {
    const user = await usersManager.deleteOne(idUser);
    res.status(200).json({ message: "Usuario Borrado", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "No se encuentra la data" });
  }
  try {
    const createdUser = await usersManager.createOne(req.body);
    res.redirect(`/home/${createdUser._id}`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
