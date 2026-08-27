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


module.exports = {createTestCase,getTestCasesByProject};

