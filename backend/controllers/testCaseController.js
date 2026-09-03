const TestCase = require('../models/TestCase');
const Project = require('../models/Project');


async function createTestCase(req, res) {
    try {
        const project = await Project.findById(req.params.projectId);
        if(project === null){
            return res.status(404).json({ error: "Project with this id doesn`t exist" });
        }

        if(!project.owner.equals(req.user.id) && !project.members.some(memberId => memberId.equals(req.user.id))){
            return res.status(403).json({ error: "You don`t have permission to create Test Case for this project " });
        }else{
            const {title, description, status, steps, expectedResult, priority} = req.body;
            const newTestCase = new TestCase ({
                title,
                description,
                status,
                steps,
                expectedResult,
                priority,
                project: req.params.projectId,
                createdBy: req.user.id,

            });

            await newTestCase.save();
            return res.status(201).json({
                message: `Test Case "${title}" has been successfully created`,
            });
        }


    }catch(err) {

        if(err.name === "ValidationError") {
            console.error("Test Case Creating Error:", err);
            return res.status(400).json({ error: err.message });
        }else{
            console.error("Test Case Creating Error:", err);
            return res.status(500).json({ error: err.message });
        }
    }
}

async function getTestCasesByProject(req, res) {
    try {
        const project = await Project.findById(req.params.projectId);
        if(project === null) {
            return res.status(404).json({ error: "Project with this id doesn`t exist" });
        }

        if(project.owner.equals(req.user.id) || project.members.some(memberId => memberId.equals(req.user.id))){
            const testCases = await TestCase.find({project: req.params.projectId});
            return res.status(200).json(testCases);
        }else{
            return res.status(403).json({ error: "No access to this project" });
        }

    } catch (err) {
        console.error("Get Test Cases Error:", err);
        return res.status(500).json({ error: err.message });
    }

}

async function getTestCaseById(req, res) {
    try {
        const testCase = await TestCase.findById(req.params.id);
        if(testCase === null){
            return res.status(404).json({ error: "Test Case with this  id doesn`t exist" });
        }
        const project = await Project.findById(testCase.project);
        if(project === null){
            return res.status(404).json({ error: "Project with this id doesn`t exist" });
        }

        if(!project.owner.equals(req.user.id) && !project.members.some(memberId => memberId.equals(req.user.id))){
            return res.status(403).json({ error: "You don`t have permission to interact with this project" });
        }else{
            return res.status(200).json(testCase);
        }
    }catch(err) {
        console.error("Get Test Case by Id Error:", err);
        return res.status(500).json({ error: err.message });
    }

}

async function updateTestCase(req, res) {
    try {
        const testCase = await TestCase.findById(req.params.id);
        if(testCase === null){
            return res.status(404).json({ error: "Test Case with this  id doesn`t exist" });
        }

        const project = await Project.findById(testCase.project);
        if(project === null){
            return res.status(404).json({ error: "Project with this id doesn`t exist" });
        }
        if(!project.owner.equals(req.user.id) && !project.members.some(memberId => memberId.equals(req.user.id))){
            return res.status(403).json({ error: "You don`t have permission to interact with this project" });
        }else{
            const {title, description, status, steps, expectedResult, priority} = req.body;
            if(title !== undefined){
                testCase.title = title;
            }
            if(description !== undefined){
                testCase.description = description;
            }
            if(status !== undefined){
                testCase.status = status;
            }
            if(steps !== undefined){
                testCase.steps = steps;
            }
            if(expectedResult !== undefined){
                testCase.expectedResult = expectedResult;
            }
            if(priority !== undefined){
                testCase.priority = priority;
            }

            await testCase.save();

            return res.status(200).json(testCase);
        }
    } catch(err) {
        if(err.name === "ValidationError") {
            console.error("Test Case Updating Error:", err);
            return res.status(400).json({ error: err.message });
        }else{
            console.error("Test Case Updating Error:", err);
            return res.status(500).json({ error: err.message });
        }
    }
}

async function deleteTestCase(req, res) {
    try {
        const testCase = await TestCase.findById(req.params.id);
        if(testCase === null){
            return res.status(404).json({ error: "Test Case with this  id doesn`t exist" });
        }

        const project = await Project.findById(testCase.project);
        if(project === null){
            return res.status(404).json({ error: "Project with this id doesn`t exist" });
        }
        if(!project.owner.equals(req.user.id)){
            return res.status(403).json({ error: "You don`t have permission to delete testcases" });
        }else{
            await testCase.deleteOne();
            return res.status(200).json({ message: "Test case successfully deleted" });
        }

    }catch(err) {
            console.error("Test Case Deleting Error:", err);
            return res.status(500).json({ error: err.message });
    }
}

module.exports = {createTestCase,getTestCasesByProject,getTestCaseById,updateTestCase,deleteTestCase};

