const {handleError}=require('../utils/utils');
const sequelize = require('../utils/config');
const {Assignment}=require('../models/Assignment');
const Account = require('../models/Account');
const {Submission}= require('../models/Submission');
const {setResponseHeader,logger,publishMessage}=require('../utils/utils')


const createSubmission = async(req, res) => {
  setResponseHeader(res);


    console.log("req.params.id",req.params.id);
    let assignment;
    try{
    assignment = await Assignment.findOne({
        where: {
          id: req.params.id,
        },
      });
    }
    catch(e){
      return res.status(404).send({ message: 'Not found' });
    }
     if(!assignment){
      return res.status(404).send({ message: 'Not found' });
     }
    const userdata=await Account.findOne({
      where: {
        email: global.email,
      },
    })
    if(userdata.id !== assignment.user_id){
      return res.status(403).send({ message: 'Forbidden' });
    }
    if(!assignment)
    {
      return res.status(404).send({ message: 'Not found' });
    }
    if (!req.body) {
      logger.error("Bad Request for /v1/assignments");
      return res.status(400).send({ message: 'Bad Request!' });;
    }
    else if(req.query && Object.keys(req.query).length>0){
      logger.error("Bad Request for /v1/assignments");
      return res.status(400).send({message:"Bad request"});;
    }
      const requiredkeys = [
      "submission_url",
    ];
    const allowedKeys = [
      "submission_url",   
    ];
    for (const key of requiredkeys) {
      if (!(key in req.body)) {
        logger.error("Bad Request for /v1/assignments");
       return  res.status(400).send({ message: 'Bad Request!' }); 
      }
    }
 
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
    const currentDate = new Date();
    logger.info("Received POST: /v1/assignment/submission");
    console.log("@@@#@!#!@#!@#!#!#!#!#!#!#!#!# attempts",assignment.num_of_attempts);
   
    const msg = {
      email: userdata.email,
      submission_url: req.body.submission_url,
      user_id: userdata.id,
      assignment_id:assignment.id,
    };

    // const param = {
    //   email: userdata.email,
    //   submission_url: req.body.submission_url,
    //   user_id: userdata.id,
    //   assignment_id:assignment.id,
    // };
    // const params ={
    //   Message: JSON.stringify(msg),
    //   Subject: "Prama",
    //   TopicArn: "arn:aws:sns:us-east-1:603832434033:email",
    // };
  
    if(assignment.num_of_attempts<1){
        return res.status(400).send({ message: 'No Attempts left' });
    }
    const submission = {
     assignment_id :assignment.id,
     submission_url : req.body.submission_url,
     submission_date:currentDate.toISOString(),
     assignment_updated:currentDate.toISOString()
    };
   
   
    const assg =  await Submission.create(submission)
      .then(async data => {
        if (data["dataValues"].user_id) {
          delete data["dataValues"].user_id;
        }
        const num_attempts=assignment.num_of_attempts;
        if(num_attempts<1)
        {
          return res.status(400).send({ message: 'No Attempts left' });
        }
       
        Assignment.update(
          {
            num_of_attempts:num_attempts-1
          },
          { // Clause
              where: 
              {
                  id: req.params.id
              }
          }
      ).then(count => {
          console.log('Rows updated ' + count);
      });
        await publishMessage(msg);
        return res.status(201).json(data)
      })
      .catch(err => {
        return res.status(400).send({
          message:
             err.message || "Bad request"
        });
      });
  };

  

  module.exports={createSubmission};