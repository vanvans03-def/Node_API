const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name:{
        type:String
    },
    employeeNo:{
        type:Number
    }
});

const Employee = mongoose.model('employee',EmployeeSchema);

module.exports = Employee;