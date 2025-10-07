import webToken from "../middlewares/webToken.middleware.js";
import bcryptjs from "bcryptjs";

const instrCtrl = {};

instrCtrl.loginInstructor = async (req, res) => {
    try {
    const { password } = req.body;

    let instructor = req.instructor;

    const matchPassword = bcryptjs.compareSync(password, instructor.password);
    if (!matchPassword) {
        return res.status(400).json({ msg: "Credenciales incorrectas" });
    }

    let token = await webToken.generarJWT(instructor);

    res.json({ msg: "Usuario logueado correctamente", token });
} catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
}
};

export { instrCtrl };
