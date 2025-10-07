import ficheModels from "../models/fiche.model.js";
const ficheCtrl = {};

ficheCtrl.getFicheId = async (req, res) => {
  try {
    let filtro = {};
    const { number } = req.query;

    if (number) {
      filtro.number = number;
    }

    console.log(filtro);

    const fiche = await ficheModels.find(filtro).populate("owner");
      
    console.log(fiche);
    res.status(200).json({ msg: fiche });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export { ficheCtrl };
