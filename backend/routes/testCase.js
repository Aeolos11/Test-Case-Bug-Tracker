const express = require('express');
const router = express.Router();

const  verifyToken = require('../middleware/authMiddleware')

const {getTestCaseById,updateTestCase,deleteTestCase} = require('../controllers/testCaseController');



router.get('/testcases/:id', verifyToken, (req, res) => {
    getTestCaseById(req, res);
})

router.put('/testcases/:id', verifyToken, (req, res) => {
    updateTestCase(req, res);
})

router.delete('/testcases/:id', verifyToken, (req, res) => {
    deleteTestCase(req, res);
})





module.exports = router;