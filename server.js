import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload";
import { routerInstructor } from "./routes/instructor.route.js";
import { routerUser } from "./routes/user.route.js";
import { routerFiche } from "./routes/fiche.route.js";
import { routerApprentice } from "./routes/apprentice.route.js";
import { routerCompanie } from "./routes/companie.route.js";
import { routerModalities } from "./routes/modalitie.route.js";
import { routerNew } from "./routes/new.route.js"
import { routerLog } from "./routes/log.route.js";
import { routerParameter } from "./routes/parameter.route.js";
import { routerRegistration } from "./routes/registration.route.js";
import { routerProgram } from "./routes/program.route.js";


const app = express();

app.use(express.json());
app.use(cors());

app.set('trust proxy', true)

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
  createParentPath: true
}))

app.use('/api/instructors', routerInstructor);
app.use('/api/users', routerUser);
app.use("/api/fiches", routerFiche);
app.use("/api/apprentices", routerApprentice)
app.use("/api/companies", routerCompanie)
app.use("/api/modalities", routerModalities)
app.use("/api/news", routerNew)
app.use("/api/logs", routerLog)
app.use("/api/parameters", routerParameter)
app.use("/api/registrations", routerRegistration)
app.use('/api/programs', routerProgram);


app.listen(process.env.PORT, () => {
  console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
})

mongoose.connect(process.env.MONGO).then(() => console.log("conectado a la base de datos"))