const Project = require('../models/Project');



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

module.exports = {createProject, getProjects, getProjectById};