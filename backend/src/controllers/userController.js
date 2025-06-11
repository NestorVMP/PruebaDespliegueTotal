const {
  crearUsuarioService,
  loginUsuarioService,
  actualizarUsuarioService,
  eliminarUsuarioService,
} = require("../services/userServices");

const UserController = {
  insertUser: async (req, res) => {
    try {
      const { user, token } = await crearUsuarioService(req.body);
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 3 * 60 * 1000,
      });
      res
        .status(200)
        .json({ message: "Usuario registrado correctamente", user });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ message: err.message || "Error al registrar el usuario" });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { user, token } = await loginUsuarioService(req.body);
      res.cookie("token", token, {
        httpOnly: true,
        /*secure: true,
        sameSite: "None",*/
        secure: false,
        sameSite: "Lax",
        maxAge: 3 * 60 * 1000,
      });
      res.status(201).json({ message: "Inicio de sesión exitoso", user });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ message: err.message || "Error en el login" });
    }
  },

  updateUser: async (req, res) => {
    try {
      const updatedUser = await actualizarUsuarioService(req.user.id, req.body);
      res
        .status(200)
        .json({
          message: "Usuario actualizado correctamente",
          user: updatedUser,
        });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ message: err.message || "Error al actualizar usuario" });
    }
  },

  deleteUser: async (req, res) => {
    const userId = req.user.id;
    try {
      await eliminarUsuarioService(userId);
      res.clearCookie("token"); // opcional: cerrar sesión al borrar
      res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (err) {
      res.status(500).json({ message: "Error al eliminar el usuario", error: err.message });
    }
  },
};

module.exports = UserController;
