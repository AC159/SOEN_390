const Patient = require('../domain/patient')

const updateProfile = () => {

}

const addProfile = async (req, patient) => {

}

const viewProfile = async (req, res) => {
    await getCollection(req).findOne({}, (error, patient) => {
        if (error)
            console.log(error)
        else res.send(patient)
    })
}

const getCollection = async (req) => {
    const mongodb = await req.app.locals.mongo
    const db = mongodb.db('test')
    return await db.collection('patients')
}
module.exports = {updateProfile, addProfile, viewProfile}