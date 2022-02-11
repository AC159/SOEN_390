const {UserState} = require("../domain/user");

class AdminRepository {

    constructor(mongo) {
        this.mongo = mongo;
    }

    verifyAdmin(adminId) {
        return this.mongo.db('test').collection('user').findOne({ uid:adminId }, { userType: 1, userStatus: 1 });
    }

    async fetchPendingPatients(adminId) {
        // verify that this administrator is truly an admin
        const adminData = this.verifyAdmin(adminId);
        if (adminData.userType.toLowerCase() !== 'administrator' || adminData.userStatus.toLowerCase() !== 'approved') {
            throw new Error('Not a valid administrator');
        } else {
            // todo: implement pagination for many users?
            const response = await this.mongo.db('test').collection('users').find({ userType: 'patient', userStatus: 'PENDING' }, { name: 1, email: 1 });
            return response.toArray();
        }
    }

    async approvePatient(patientId, adminId) {
        const adminData = this.verifyAdmin(adminId);
        if (adminData.userType.toLowerCase() !== 'administrator' || adminData.userStatus.toLowerCase() !== 'approved') {
            throw new Error('Not a valid administrator');
        } else {
            return await this.mongo.db('test').collection('users').updateOne({ userId: patientId }, { $set: { userStatus: 'APPROVED' } });
        }
    }

}

module.exports = AdminRepository;
