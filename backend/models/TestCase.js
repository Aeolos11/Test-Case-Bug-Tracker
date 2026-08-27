const mongoose = require('mongoose')

const testCaseSchema = mongoose.Schema({
   title: {type: String, required: true, trim: true},
   description: {type: String},
   status: { type: String, enum: [`pending`, `passed`, `failed`, `blocked`] },
    steps: [{stepNum:{type:Number,required:true}, action:{type:String,required:true}, expectedResult:{type:String,required:true}}],
    expectedResult: {type: String, required: true},
    priority: {type: String, enum: [`low`, `medium`, `high`, `critical`]},
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true }
);

const TestCaseModel = mongoose.model('TestCase', testCaseSchema)

module.exports  = TestCaseModel;