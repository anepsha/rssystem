var mongoose = require('mongoose');

var productShema = mongoose.Schema({
	name: String,
	description: String,
	departmentId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' }],
	departmentName: String
})

var product = module.exports = mongoose.model('Product', productShema);