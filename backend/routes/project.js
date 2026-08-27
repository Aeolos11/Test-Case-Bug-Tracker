const express = require('express');
const router = express.Router();

const  verifyToken = require('../middleware/authMiddleware')
const {createProject, getProjects, getProjectById} = require('../controllers/projectController');
const {createTestCase,getTestCasesByProject} = require('../controllers/testCaseController');


router.post('/create-project', verifyToken, (req, res) => {
    createProject(req, res);
})

router.get('/projects', verifyToken, (req, res) => {
    getProjects(req, res);
})

router.get('/projects/:id', verifyToken, (req, res) => {
    getProjectById(req, res);
})

router.post('/projects/:projectId/create-testcase', verifyToken, (req, res) => {
   createTestCase(req, res);
})

router.get('/projects/:projectId/testcases', verifyToken, (req, res) => {
    getTestCasesByProject(req, res);
})

module.exports = router;