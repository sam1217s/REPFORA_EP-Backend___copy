import newModels from "../models/new.model.js";

const newCtrl = {};

newCtrl.listNew = async (req, res) => {
  try {
    const news = await newModels.find({}).skip().limit(50);
    res.status(200).json({ msg: news });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export { newCtrl };
