import webToken from "../middlewares/webToken.middleware.js";
import bcryptjs from "bcryptjs";

const userCtrl = {};

userCtrl.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = req.user;
    const matchPassword = bcryptjs.compareSync(password, user.password);
    
    if (!matchPassword) {
      return res.status(401).json({ msg: "Credenciales incorrectas" });
    }
    
    let token = await webToken.generarJWT(user);

    res.status(200).json({
      msg: "Usuario logueado correctamente",
      token,
      email,
      role: user.role,
      name: user.name,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export { userCtrl };
