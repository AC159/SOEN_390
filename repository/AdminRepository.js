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
        try {
            await this.verifyAdmin(adminId);
            // todo: implement pagination for many patients?
            const response = await this.mongo.db('test').collection('user').find({ userType: 'patient', userStatus: 'PENDING' }, { name: 1, email: 1 });
            return response.toArray();
        } catch (error) {
            throw error;
        }

    }

    async approvePatient(patientId, adminId) {
        try {
            await this.verifyAdmin(adminId);
            return await this.mongo.db('test').collection('user').updateOne({ uid: patientId }, { $set: { userStatus: 'APPROVED' } });
        } catch (error) {
            throw error;
        }
    }

    async rejectPatient(patientId, adminId) {
        try {
            await this.verifyAdmin(adminId);
            return await this.mongo.db('test').collection('user').updateOne({ uid: patientId }, { $set: { userStatus: 'REJECTED' } });
        } catch (error) {
            throw error;
        }
    }

    async fetchPendingDoctors(adminId) {
        try {
            await this.verifyAdmin(adminId);
            // todo: implement pagination for many doctors?
            const response = await this.mongo.db('test').collection('user').find({ userType: 'doctor', userStatus: 'PENDING' }, { name: 1, email: 1 });
            return response.toArray();
        } catch (error) {
            throw error;
        }
    }

    async approveDoctor(doctorId, adminId) {
        try {
            await this.verifyAdmin(adminId);
            return await this.mongo.db('test').collection('user').updateOne({ uid: doctorId }, { $set: { userStatus: 'APPROVED' } });
        } catch (error) {
            throw error;
        }
    }

    async rejectDoctor(doctorId, adminId) {
        try {
            await this.verifyAdmin(adminId);
            return await this.mongo.db('test').collection('user').updateOne({ uid: doctorId }, { $set: { userStatus: 'REJECTED' } });
        } catch (error) {
            throw error;
        }
    }

    async fetchPendingHealthOfficers(adminId) {
        try {
            await this.verifyAdmin(adminId);
            const response = await this.mongo.db('test').collection('user').find({ userType: 'healthOfficer', userStatus: 'PENDING' }, { name: 1, email: 1 });
            return response.toArray();
        } catch (error) {
            throw error;
        }
    }

    async approveHealthOfficer(officerId, adminId) {
        try {
            await this.verifyAdmin(adminId);
            return await this.mongo.db('test').collection('user').updateOne({ uid: officerId }, { $set: { userStatus: 'APPROVED' } });
        } catch (error) {
            throw error;
        }
    }

    async rejectHealthOfficer(officerId, adminId) {
        try {
            await this.verifyAdmin(adminId);
            return await this.mongo.db('test').collection('user').updateOne({ uid: officerId }, { $set: { userStatus: 'REJECTED' } });
        } catch (error) {
            throw error;
        }
    }

    async fetchPendingImmigrationOfficers(adminId) {
        try {
            await this.verifyAdmin(adminId);
            const response = await this.mongo.db('test').collection('user').find({ userType: 'immigrationOfficer', userStatus: 'PENDING' }, { name: 1, email: 1 });
            return response.toArray();
        } catch (error) {
            throw error;
        }
    }

    async approveImmigrationOfficer(officerId, adminId) {
        try {
            await this.verifyAdmin(adminId);
            return await this.mongo.db('test').collection('user').updateOne({ uid: officerId }, { $set: { userStatus: 'APPROVED' } });
        } catch (error) {
            throw error;
        }
    }

    async rejectImmigrationOfficer(officerId, adminId) {
        try {
            await this.verifyAdmin(adminId);
            return await this.mongo.db('test').collection('user').updateOne({ uid: officerId }, { $set: { userStatus: 'REJECTED' } });
        } catch (error) {
            throw error;
        }
    }

}

module.exports = AdminRepository;
