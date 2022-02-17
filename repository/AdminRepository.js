const {UserState} = require("../domain/user");

class AdminRepository {

    constructor(mongo) {
        this.mongo = mongo;
    }

    async verifyAdmin(adminId) {
        console.log("AdminId: ", adminId);
        const adminData = await this.mongo.db('test').collection('user').findOne({ uid: adminId }, { userType: 1, userStatus: 1 });
        console.log("adminData: ", adminData);
        if (adminData === null || adminData === undefined) {
            throw new Error('Not a valid administrator');
        }
        else if (adminData.userType.toLowerCase() !== 'administrator' || adminData.userStatus.toLowerCase() !== 'approved') {
            throw new Error('Not a valid administrator');
        }
    }

    async fetchPendingPatients(adminId) {
        // todo: implement pagination for many patients?
        const response = await this.mongo.db('test').collection('user').find({ userType: 'patient', userStatus: 'PENDING' }, { name: 1, email: 1 });
    }

    async approvePatient(patientId, adminId) {
        return await this.mongo.db('test').collection('user').updateOne({ uid: patientId }, { $set: { userStatus: 'APPROVED' } });
    }

    async rejectPatient(patientId, adminId) {
        return await this.mongo.db('test').collection('user').updateOne({ uid: patientId }, { $set: { userStatus: 'REJECTED' } });
    }

    async fetchPendingDoctors(adminId) {
        // todo: implement pagination for many doctors?
        const response = await this.mongo.db('test').collection('user').find({ userType: 'doctor', userStatus: 'PENDING' }, { name: 1, email: 1 });
        return response.toArray();
    }

    async approveDoctor(doctorId, adminId) {
        return await this.mongo.db('test').collection('user').updateOne({ uid: doctorId }, { $set: { userStatus: 'APPROVED' } });
    }

    async rejectDoctor(doctorId, adminId) {
        return await this.mongo.db('test').collection('user').updateOne({ uid: doctorId }, { $set: { userStatus: 'REJECTED' } });
    }

    async fetchPendingHealthOfficers(adminId) {
        const response = await this.mongo.db('test').collection('user').find({ userType: 'healthOfficer', userStatus: 'PENDING' }, { name: 1, email: 1 });
        return response.toArray();
    }

    async approveHealthOfficer(officerId, adminId) {
        return await this.mongo.db('test').collection('user').updateOne({ uid: officerId }, { $set: { userStatus: 'APPROVED' } });
    }

    async rejectHealthOfficer(officerId, adminId) {
        return await this.mongo.db('test').collection('user').updateOne({ uid: officerId }, { $set: { userStatus: 'REJECTED' } });
    }

    async fetchPendingImmigrationOfficers(adminId) {
        const response = await this.mongo.db('test').collection('user').find({ userType: 'immigrationOfficer', userStatus: 'PENDING' }, { name: 1, email: 1 });
        return response.toArray();
    }

    async approveImmigrationOfficer(officerId, adminId) {
        return await this.mongo.db('test').collection('user').updateOne({ uid: officerId }, { $set: { userStatus: 'APPROVED' } });;
    }

    async rejectImmigrationOfficer(officerId, adminId) {
        return await this.mongo.db('test').collection('user').updateOne({ uid: officerId }, { $set: { userStatus: 'REJECTED' } });
    }

}

module.exports = AdminRepository;
