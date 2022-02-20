const express = require('express');
const router = express.Router();

router.get('/:doctor_id/patientArray',async function(req,res){    
    const doctor=req.params.doctor_id;
    const mongo =req.app.locals.mongodb;
    const response = await mongo.db('test').collection('user').find({ userType: 'patient', "patientInfo.doctorId":doctor } ).project({ name: 1, dob: 1,phoneNumber: 1 ,email: 1 ,_id :0 }).toArray();
    res.status(200).json({data:response})
    
    }
    
    );
    

module.exports = router;