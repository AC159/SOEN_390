
class AdminRepository {

    constructor(mongo) {
        this.mongo = mongo;
    }

    getAdmin(adminId) {
        return this.mongo.db('test').collection('user').findOne({ uid:adminId }, { userType: 1, userStatus: 1 });
    }

    async fetchPendingPatients(adminId) {
        // verify that this administrator is truly an admin
        const adminData = this.getAdmin(adminId);
        if (adminData.userType.toLowerCase() !== 'administrator' || adminData.userStatus.toLowerCase() !== 'approved') {
            throw new Error('Not a valid administrator');
        } else {
            // todo: implement pagination for many users?
            const response = await this.mongo.db('test').collection('users').find({ userType: 'patient', userStatus: 'PENDING' }, { name: 1, email: 1 });
            return response.toArray();
        }
    }

}
