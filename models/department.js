var mongoose = require('mongoose');

var DepartmentShema = mongoose.Schema({
	name: String
})

var Department = module.exports = mongoose.model('Department', DepartmentShema);

module.exports.getAllDepartments = function(callback) {
	Department.find(callback);
}
