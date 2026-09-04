const Project = require('../models/Project');
const User = require('../models/User');
const TestCase = require('../models/TestCase');



async function createProject(req, res) {
    try {
        const {name, description } = req.body;

        const newProject = new Project ({
            name,
            description,
            owner: req.user.id,
        });

        await newProject.save();
        return res.status(201).json({
            message: `Project ${name} has been successfully created`,
        });
    }catch(err) {
        console.error("Project Creating Error:", err);
        return res.status(500).json({ error: err.message });
    }
}

async function getProjects(req, res) {
    try {
        const projects = await Project.find({
            $or: [
                { owner: req.user.id },
                { members: req.user.id }
            ]
        });

        return res.status(200).json(projects);
    } catch (err) {
        console.error("Get Projects Error:", err);
        return res.status(500).json({ error: err.message });
    }
}

async function getProjectById(req, res) {
    try {
        const project = await Project.findById(req.params.id);
        if(project === null){
            return res.status(404).json({ error: "This id doesn`t exist" });
        }
        if(project.owner.equals(req.user.id) || project.members.some(memberId => memberId.equals(req.user.id))){
            return res.status(200).json(project);
        }else{
            return res.status(403).json({ error: "You don`t have permission to interact with this project" });
        }

    } catch (err) {
        console.error("Get Project Error:", err);
        return res.status(500).json({ error: err.message });
    }
}

async function updateProject(req, res) {
    try {
        const project = await Project.findById(req.params.id);
        if(project === null){
            return res.status(404).json({ error: "Project with this id doesn`t exist" });
        }

        if(!project.owner.equals(req.user.id)){
            return res.status(403).json({ error: "You don`t have permission to update this project" });
        }else{

            const {name, description,members} = req.body;
            if(name !== undefined){
                project.name = name;
            }
            if(description !== undefined){
                project.description = description;
            }
            if(members !== undefined){
                const existingUsers = await User.find({ _id: { $in: members } });
                if(existingUsers.length !== members.length){
                    return res.status(400).json({ error: "One or more member IDs do not exist" });
                }
                project.members = members;
            }
            await project.save();
            return res.status(200).json({project});
        }

    }catch(err) {
        if(err.name === "ValidationError") {
            console.error("Project Updating Error:", err);
            return res.status(400).json({ error: err.message });
        }else{
            console.error("Project Updating Error:", err);
            return res.status(500).json({ error: err.message });
        }
    }

}

async function deleteProject(req, res) {
    try {
        const project = await Project.findById(req.params.id);
        if(project === null){
            return res.status(404).json({ error: "Project with this id doesn`t exist" });
        }

        if(!project.owner.equals(req.user.id)){
            return res.status(403).json({ error: "You don`t have permission to delete this project" });
        }else{
            await TestCase.deleteMany({project:req.params.id});
            await project.deleteOne()
            return res.status(200).json({ message: "Project successfully deleted" });
        }

    }catch(err) {
            console.error("Project Deleting Error:", err);
            return res.status(500).json({ error: err.message });
    }

}

module.exports = {createProject, getProjects, getProjectById,updateProject, deleteProject};