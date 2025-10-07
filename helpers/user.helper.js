import User from "../models/user.model.js"


const userHelper = {};

userHelper.validateUser = async (email, { req }) => {
    let rol = req.body.role
    const user = await User.findOne({ email: { $regex: email, $options: "i" }, status: 0, role: rol });
    if (!user) {
        throw new Error('El usuario no existe');
    }
    req.user = user
};

export { userHelper };

