const mongoose = require('mongoose')


const projectSchema = mongoose.Schema({
    name: {type: String, required: true, trim: true},
    description: {type: String},
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

})

const ProjectModel = mongoose.model('Project', projectSchema)

module.exports = ProjectModel;