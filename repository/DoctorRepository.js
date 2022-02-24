class DoctorRepository {

    constructor(mongo) {
        this.mongo = mongo;
    }

    getPatients(doctorId) {
        return this.mongo.db('test').collection('user')
            .find({ userType: 'patient', "patientInfo.doctorId": doctorId } )
            .project({ name: 1, dob: 1,phoneNumber: 1 ,email: 1 ,uid :1 }).toArray();
    }

}

module.exports = DoctorRepository;
