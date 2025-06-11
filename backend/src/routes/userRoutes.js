const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const jwt = require("jsonwebtoken");
const userValidations = require('../validations/userValidations');
const validarCampos = require('../middlewares/validationHandler');
const authMiddleware = require('../middlewares/authMiddleware');
const secretKey = process.env.JWT_SECRET;
const auth = authMiddleware(secretKey);

router.post("/register", userValidations.validarRegistro, validarCampos, UserController.insertUser);
router.post("/login", userValidations.validarLogin, validarCampos, UserController.loginUser);
router.put("/update", auth, userValidations.validarActualizacion, validarCampos, UserController.updateUser );
router.delete('/delete', auth, UserController.deleteUser);


router.get("/check-session", (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Token no encontrado" });

    //jwt.verify(token, process.env.JWT_SECRET);
    //res.status(200).json({ message: "Token válido" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("decoded");
    //console.log(decoded);
    res.status(200).json({ message: "Token válido" ,
      user: {
        _id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      }});
  } catch (err) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Sesión cerrada" });
});

module.exports = router;
