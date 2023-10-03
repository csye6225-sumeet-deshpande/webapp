
const express = require('express');
const router = express.Router();
const assignmentController = require('../controller/assignment-controller');
const { authorizeToken } = require('../middleware/auth');

const validRoutePattern = /^\/v1\/assignments(\/\w+)*$/;


const validateRoute = (req, res, next) => {
  if (validRoutePattern.test(req.path)) {
    next();
  } else {
    res.status(404).send('Not Found');
  }
};


//clearrouter.get('/v1/assignments',assignmentController.createAssignment);
router.route('/v1/assignments').get(authorizeToken,assignmentController.getAssignment);

//By ID
router.route('/v1/assignments/:id').get(authorizeToken,assignmentController.getAssignmentById);

//POST method##
router.route('/v1/assignments').post(authorizeToken,assignmentController.createAssignment);
 
//Delete routes

router.route('/v1/assignments/:id').delete(authorizeToken,assignmentController.deleteAssignment);

// Update 

router.route('/v1/assignments/:id').put(authorizeToken,assignmentController.updateAssignment)

// router.put('/assignments/:id', assignmentController.updateAssignment);
// router.delete('/assignments/:id', assignmentController.deleteAssignment);

module.exports = router;
