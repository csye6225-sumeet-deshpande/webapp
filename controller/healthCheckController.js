const sequelize = require('../utils/config');
const checkHealthEndpoint=(req, res) =>{
  res.setHeader('Cache-control', 'no-cache');
  console.log(req.method);
  if( req.body && Object.keys(req.body).length>0){
    res.status(400).send({"message":"bad request"})
  }
  else if(req.query && Object.keys(req.query).length>0){
    res.status(400).send({"message":"bad request"});
  }
  else if(req.method !=='GET'){
    res.setHeader('Cache-control' ,'no-cache');
    res.status(405).send({"message":"method not allowed"});
  }
  else{
  sequelize
    .authenticate()
    .then(() => {
      res.status(200).send({"message":"ok"});
    })
    .catch((error) => {
      res.status(503).send({"message":"Service unavailable" })
    });
  }
}

module.exports = checkHealthEndpoint;
