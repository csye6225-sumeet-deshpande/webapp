
const express = require('express');
const router = express.Router();
const assignmentController = require('../controller/assignment-controller');
const submissionController=require('../controller/submission-controller');
const { authorizeToken } = require('../middleware/auth');

const validRoutePattern = /^\/v1\/assignments(\/\w+)*(\/submission)?$/;



const validateRoute = (req, res, next) => {
  if (validRoutePattern.test(req.path)) {
    next();
  } else {
    return res.status(404).send({message:"Not found"});
  }
};

const validateMethod = (req, res, next) => {
  if (req.method === 'GET' || req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    next();
  } else {
    return res.status(405).send({ message: 'Method Not Allowed' });
  }
};

const validateMethod1 = (req, res, next) => {
  if (req.method === 'POST') {
    next();
  } else {
    return res.status(405).send({ message: 'Method Not Allowed' });
  }
};

router.all('/v2/assignments/:id/submission', validateMethod1);

router.all('/v2/assignments*', validateMethod);



//clearrouter.get('/v1/assignments',assignmentController.createAssignment);
router.route('/v2/assignments').get(authorizeToken,assignmentController.getAssignment);

//By ID
router.route('/v2/assignments/:id').get(authorizeToken,assignmentController.getAssignmentById);

//POST method##
router.route('/v2/assignments').post(authorizeToken,assignmentController.createAssignment);
 
//Delete routes

router.route('/v2/assignments/:id').delete(authorizeToken,assignmentController.deleteAssignment);

// Update 

router.route('/v2/assignments/:id').put(authorizeToken,assignmentController.updateAssignment)

router.route('/v2/assignments/:id/submission').post(authorizeToken,submissionController.createSubmission);

// router.put('/assignments/:id', assignmentController.updateAssignment);
// router.delete('/assignments/:id', assignmentController.deleteAssignment);

module.exports = router;
