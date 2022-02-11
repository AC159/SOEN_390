const {UserState} = require("../domain/user");

class AdminRepository {

    constructor(mongo) {
        this.mongo = mongo;
    }

    verifyAdmin(adminId) {
        const adminData = this.mongo.db('test').collection('user').findOne({ uid:adminId }, { userType: 1, userStatus: 1 });
        if (adminData.userType.toLowerCase() !== 'administrator' || adminData.userStatus.toLowerCase() !== 'approved') {
            throw new Error('Not a valid administrator');
        }
    }

    async fetchPendingPatients(adminId) {
        try {
            this.verifyAdmin(adminId);
            // todo: implement pagination for many patients?
            const response = await this.mongo.db('test').collection('user').find({ userType: 'patient', userStatus: 'PENDING' }, { name: 1, email: 1 });
            return response.toArray();
        } catch (error) {
            throw error;
        }

    }

    async approvePatient(patientId, adminId) {
        try {
            this.verifyAdmin(adminId);
            return await this.mongo.db('test').collection('user').updateOne({ userId: patientId }, { $set: { userStatus: 'APPROVED' } });
        } catch (error) {
            throw error;
        }
    }

    async fetchPendingDoctors(adminId) {
        try {
            this.verifyAdmin(adminId);
            // todo: implement pagination for many doctors?
            const response = await this.mongo.db('test').collection('user').find({ userType: 'doctor', userStatus: 'PENDING' }, { name: 1, email: 1 });
            return response.toArray();
        } catch (error) {
            throw error;
        }
    }

    async approveDoctor(doctorId, adminId) {
        try {
            this.verifyAdmin(adminId);
            return await this.mongo.db('test').collection('user').updateOne({ userId: doctorId }, { $set: { userStatus: 'APPROVED' } });
        } catch (error) {
            throw error;
        }
    }

}

module.exports = AdminRepository;
