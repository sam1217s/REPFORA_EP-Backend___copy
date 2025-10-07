import instructorModels from "../models/instructor.model.js";

const instructorHelper = {}


instructorHelper.valideinstructor = async (document, { req }) => {
    const instructor = await instructorModels.findOne({ numdocument: document })
    if (!instructor) {
        throw new Error("El instructor no existe")
    }


    req.instructor = instructor
}



export {instructorHelper}