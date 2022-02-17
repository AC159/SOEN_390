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

    async fetchPendingUsers(userType) {
        // userType can be either administrator, doctor, immigrationOfficer, healthOfficer or patient
        // todo: implement pagination for many users?
        const response = await this.mongo.db('test').collection('user').find({ userType: userType, userStatus: 'PENDING' }, { name: 1, email: 1 });
        return response.toArray();
    }

    async approveUser(userId) {
        return await this.mongo.db('test').collection('user').updateOne({ uid: userId }, { $set: { userStatus: 'APPROVED' } });
    }

    async rejectPatient(patientId) {
        return await this.mongo.db('test').collection('user').updateOne({ uid: patientId }, { $set: { userStatus: 'REJECTED' } });
    }

    async rejectDoctor(doctorId) {
        return await this.mongo.db('test').collection('user').updateOne({ uid: doctorId }, { $set: { userStatus: 'REJECTED' } });
    }

    async rejectHealthOfficer(officerId) {
        return await this.mongo.db('test').collection('user').updateOne({ uid: officerId }, { $set: { userStatus: 'REJECTED' } });
    }

    async rejectImmigrationOfficer(officerId) {
        return await this.mongo.db('test').collection('user').updateOne({ uid: officerId }, { $set: { userStatus: 'REJECTED' } });
    }

}

module.exports = AdminRepository;
