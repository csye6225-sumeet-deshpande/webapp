const {handleError}=require('../utils/utils');
const sequelize = require('../utils/config');
const {Assignment}=require('../models/Assignment');
const Account = require('../models/Account');
const {setResponseHeader,logger}=require('../utils/utils')
const {Submission}= require('../models/Submission');
// const statsd = require('node-statsd')
// const client = new statsd({
//   host: process.env.stathost || 'localhost',
//   port: process.env.statport || 8125,
// })
const createAssignment = async(req, res) => {
  setResponseHeader(res);
  //client.increment('endpoint.create.assignment')
    console.log("in the assignment"+req);
   // Assignment.sequelize.sync();
    // Validate request
    const userdata=await Account.findOne({
      where: {
        email: global.email,
      },
    })
    if (!req.body) {
      logger.error("Bad Request for /v1/assignments");
      return res.status(400).send({ message: 'Bad Request!' });;
    }
    else if(req.query && Object.keys(req.query).length>0){
      logger.error("Bad Request for /v1/assignments");
      return res.status(400).send({message:"Bad request"});;
    }
      const requiredkeys = [
      "name",
      "points",
      "num_of_attempts",
      "deadline",
    ];
    const allowedKeys = [
      "name",
      "points",
      "num_of_attempts",
      "deadline",
      "assignment_created",
      "assignment_updated",
    ];
    for (const key of requiredkeys) {
      if (!(key in req.body)) {
        logger.error("Bad Request for /v1/assignments");
       return  res.status(400).send({ message: 'Bad Request!' }); 
      }
    }
    // Check if there are any extra keys
    for (const key in req.body) {
    if (!allowedKeys.includes(key)) {
      logger.error("Bad Request for /v1/assignments");
     return  res.status(400).send({ message: 'Bad Request!' });
    }
  }
    if (typeof req.body !== 'object') {
      logger.error("Bad Request for /v1/assignments");
      return res.status(400).json({ error: 'Invalid JSON in request body' });
    }
    else if(req.query && Object.keys(req.query).length>0){
      logger.error("Bad Request for /v1/assignments");
      return res.status(400).send({ message: 'Bad Request!' });
    }

    if(req.body.num_of_attempts < 1 ){
      return res.status(400).send({ message: 'num_of_attempts should be greater or equal to 1' });
    }
   
    console.log("Userdata.id=",userdata.id);
    logger.info("Received POST: /v1/assignment");
    const assignment = {
      user_id :userdata.id,
      name: req.body.name,
      points:req.body.points,
      num_of_attempts:req.body.num_of_attempts,
      deadline:req.body.deadline
    };
  

    const assg =  await Assignment.create(assignment)
      .then(data => {
        if (data["dataValues"].user_id) {
          delete data["dataValues"].user_id;
        }
        return res.status(201).json(data)
      })
      .catch(err => {
        return res.status(400).send({
          message:
             err.message || "Bad request"
        });
      });
  };

  const getAssignment = async(req, res) => {
    setResponseHeader(res);
    //client.increment('endpoint.get.assignment')
    try{
      if(req.body && Object.keys(req.body).length>0)
      {
        logger.error("Bad Request for /v1/assignments");
        return res.status(400).send({ message: 'Bad Request!' });
      }
      else if(req.query && Object.keys(req.query).length>0){
        logger.error("Bad Request for /v1/assignments");
        return res.status(400).send({ message: 'Bad Request!' });;
      }
      const account=await Account.findOne({
        where: {
          email: global.email,
        },
      })
      console.log(account.id)
      logger.info("Received GET: /v1/assignment");
      const assignment = await Assignment.findAll()
      console.log("Filter Assignment:",assignment);
      //if (assignment.length === 0) return res.status(200).send(assignment)
      const result = assignment.map((ac) => {
      return {
        id: ac.id,
        name: ac.name,
        points: ac.points,
        num_of_attempts:ac.num_of_attempts,
        deadline:ac.deadline,
        assignment_created:ac.assignment_created,
        assignment_updated:ac.assignment_updated
      }
    
    })

  
    if(result.length===0) return res.status(200).send({ message: 'No assignment for user' });
    return res.status(200).json(result)
    }catch(e){
      console.log(e);
      logger.error("Bad Request for /v1/assignments");
      return res.status(400).send({ message: 'Bad Request!!' })
    }
    
  };


  const getAssignmentById = async(req, res) => {
    setResponseHeader(res);
    //client.increment('endpoint.get.assignmentbyId')
    try{
     // const assignment = await Assignment.findAll();
     console.log("Acooubnt tb",req.params.id);
       //const acc = await auth.parse( req.headers.authorization)
      if(req.body && Object.keys(req.body).length>0)
      {
        logger.error("Bad Request for /v1/assignments");
        return res.status(400).send({message:"Bad request"});
      }
      else if(req.query && Object.keys(req.query).length>0){
        logger.error("Bad Request for /v1/assignments");
        return res.status(400).send({message:"Bad request"});;
      }
      logger.info("Received GET: /v1/assignment/:id");
      const validDocID = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
        req.params.id
      );
      if (!validDocID) {
        logger.error("Bad Request for /v1/assignments");
        return res.status(404).send({ message: 'Check the Assignment ID' });
      }
      const account=await Account.findOne({
        where: {
          email: global.email,
        },
      })
      console.log("account:",account);
      const assignment = await Assignment.findOne({
        where: {
          id: req.params.id,
        }
      })
      if(assignment===null){
        logger.error("Page not found for /v1/assignments");
        return res.status(404).send({ message: 'Not found' });
      }
      console.log("assig-----nment",assignment);
      // if(assignment[dataValues] && assignment && assignment[dataValues].user_id)
      //   delete assignment["dataValues"].user_id;
      if (assignment["dataValues"].user_id) {
        delete assignment["dataValues"].user_id;
      }
      // const assignmnetdata= assignment.json();
      // delete assignmnetdata.user_id;
      //console.log(assignmnetdata);
      if (assignment.length === 0) return res.status(200).send({message:"No assignment for user"})
      return res.status(200).json(assignment)
      //const filteredAssignmentsuserid = assignment.filter((asg) => account.id === asg.user_id ) ;
      //const filteredAssignments=filteredAssignmentsuserid.filter((asg)=> asg.id===req.param.id);
    //   const result = assignment.map((ac) => {
    //   return {
    //     id: ac.id,
    //     name: ac.name,
    //     points: ac.points,
    //     num_of_attempts:ac.num_of_attempts,
    //     deadline:ac.deadline,
    //     assignment_created:ac.assignment_created,
    //     assignment_updated:ac.assignment_updated
    //   }
    
    // })
  
    // if(result.length===0) return res.status(200).send("No assignment for user");
    // return res.status(201).json(result)
    }catch(e){
      console.log("ErROR===",e);
      logger.error("Bad Request for /v1/assignments");
      return res.status(400).send({ message: 'Bad Request!!' })
    }
    
    
  };


  const deleteAssignment = async(req, res) => {
    setResponseHeader(res);
   
    if(req.body && Object.keys(req.body).length>0)
      {
        logger.error("Bad Request for /v1/assignments");
        return res.status(400).send({message:"Bad request"});
      }
      else if(req.query && Object.keys(req.query).length>0){
        logger.error("Bad Request for /v1/assignments");
        return res.status(400).send({message:"Bad request"});;
      }
    try {
      const userData = await Account.findOne({
        where: {
          email: global.email,
        },
      })
      const { id } = userData 
      const validDocID =
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
          req.params.id
        )
        console.log(validDocID);
      if (!validDocID)
        return res.status(404).send({ message: 'check the Assignment ID' })
      const assignment = await Assignment.findOne({
        where: {
          id: req.params.id,
        }
      })
        
      if (assignment === null)
        return res.status(404).send({ message: 'Not Found!' })
        logger.info("Received Delete: /v1/assignments/:id");

        const existingSubmissions = await Submission.count({
          where: {
            assignment_id: assignment.id,
          },
        });
        if(existingSubmissions >0){
            return res.status(400).send({ message: 'There are submission against assignment' });
        }
      const { name, user_id } = assignment
      try {
        if (id === user_id) {
          await assignment.destroy()
        } else {
          return res.status(403).send({ message: 'Forbidden' })
        }
      } catch (err) {
        logger.error("Bad Request for /v1/assignments");
        return res.status(400).send({ message: 'Bad  request!' })
      }
      return res.status(204).send()
    } catch (err) {
      console.log(err)
      return res.status(400).send({ message: 'Bad Request!' })
    }
  };


  // const updateAssignment = async(req, res) => {
  //   try {
  //     const userData = await Account.findOne({
  //       where: {
  //         email: global.email,
  //       },
  //     })
  //     const { id } = userData 
  //     const validDocID =
  //       /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
  //         req.params.id
  //       )
  //     if (!validDocID)
  //       return res.status(400).send({ message: 'check the Assignment ID' })
  //     const assignment = await Assignment.findOne({
  //       where: {
  //         id: req.params.id,
  //       }
  //     })
  //       if (assignment === null)
  //         return res.status(404).send({ message: 'Not Found!' })
  //     const { id, user_id } = assignment
  //     assignment.set({
  //       name: req.body.name,
  //       points: req.body.points,
  //       num_of_attempts: req.body.num_of_attempts,
  //       deadline: req.body.deadline
  //     });
  //     try {
  //       if (id === user_id) {
  //         await assignment.save();
  //         res.status(204).send()
  //       } else {
  //         return res.status(403).send({ message: 'Unauthorized!' })
  //       }
  //     } catch (err) {
  //       return res.status(400).send({ message: 'bad request' })
  //     }
        
  //     // if (assignment === null)
  //     //   return res.status(404).send({ message: 'Not Found!' })
  //     // console.log("Assignment:::::",assignment)
  //     // const { name, user_id } = assignment
  //     // try {
  //     //   if (id === user_id) {
  //     //     await assignment.destroy()
  //     //   } else {
  //     //     return res.status(401).send({ message: 'Unauthorized!' })
  //     //   }
  //     // } catch (err) {
  //     //   return res.status(500).send({ message: 'Internal server error!' })
  //     // }

  //   } catch (err) {
  //     console.log(err)
  //     return res.status(400).send({ message: 'Bad Request!' })
  //   }
    
    
  // };
  const updateAssignment = async (req, res) => {
    setResponseHeader(res);
   
    if (Object.keys(req.body).length === 0) 
      {
        logger.error("Bad Request for /v1/assignments");
        return res.status(400).send({message:"Bad request"});
      }
      else if(req.query && Object.keys(req.query).length>0){
        logger.error("Bad Request for /v1/assignments");
        return res.status(400).send({message:"Bad request"});
      }
    try {
      const userData = await Account.findOne({
        where: {
          email: global.email,
        },
      });
      const { id } = userData;
      const requiredkeys = [
        "name",
        "points",
        "num_of_attempts",
        "deadline",
      ];
      const allowedKeys = [
        "name",
        "points",
        "num_of_attempts",
        "deadline",
        "assignment_created",
        "assignment_updated",
      ];
      for (const key of requiredkeys) {
        if (!(key in req.body)) {
          logger.error("Bad Request for /v1/assignments");
         return  res.status(400).send({ message: 'Bad Request!' }); 
        }
      }
      // Check if there are any extra keys
      for (const key in req.body) {
      if (!allowedKeys.includes(key)) {
        logger.error("Bad Request for /v1/assignments");
       return  res.status(400).send({ message: 'Bad Request!' });
      }
    }
  
      const validDocID = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
        req.params.id
      );
      if (!validDocID) {
        return res.status(404).send({ message: 'Check the Assignment ID' });
      }
  
      const assignment = await Assignment.findOne({
        where: {
          id: req.params.id,
        },
      });
  
      if (!assignment) {
        return res.status(404).send({ message: 'Not Found!' });
      }
      const existingSubmissions = await Submission.count({
        where: {
          assignment_id: assignment.id,
        },
      });
      if(existingSubmissions >0){
          return res.status(400).send({ message: 'There are submission against assignment' });
      }
      if(req.body.num_of_attempts < 1 ){
        return res.status(400).send({ message: 'num_of_attempts should be greater or equal to 1' });
      }
  
      // Create an object to hold the updated fields from the request body
      const updatedFields = {};
      logger.info("Received PUT: /v1/assignment/:id");
  
      if (req.body.name !== undefined) {
        updatedFields.name = req.body.name;
      }
      if (req.body.points !== undefined) {
        updatedFields.points = req.body.points;
      }
      if (req.body.num_of_attempts !== undefined) {
        updatedFields.num_of_attempts = req.body.num_of_attempts;
      }
      if (req.body.deadline !== undefined) {
        updatedFields.deadline = req.body.deadline;
      }
  
      try {
        if (id === assignment.user_id) {
          // Update only the fields provided in the request body
          await assignment.update(updatedFields);
          return res.status(204).send();
        } else {
          logger.error("Forbidden! Trying to access unauthorize record");
          return res.status(403).send({ message: 'Forbidden!' });
        }
      } catch (err) {
        logger.error("Bad Request for /v1/assignments");
        return res.status(400).send({ message: err.message|| 'Bad Request'  });
      }
    } catch (err) {
      console.log(err);
      logger.error("Bad Request for /v1/assignments");
      return res.status(400).send({ message: err.message || 'Bad Request' });
    }
  };
  

  module.exports={createAssignment,getAssignment,getAssignmentById,deleteAssignment,updateAssignment};