const sequelize = require('../utils/config');
const { logger } = require('../utils/utils');
const statsd = require('node-statsd')
const client = new statsd({
  host: 'localhost',
  port: 8125,
})
const checkHealthEndpoint=(req, res) =>{
  res.setHeader('Cache-control', 'no-cache');
  console.log(req.method);
 client.increment('endpoint.health')
  logger.info("Received GET: /healthz");
  if( req.body && Object.keys(req.body).length>0){
    return res.status(400).send({"message":"bad request"})
  }
  else if(req.query && Object.keys(req.query).length>0){
    return res.status(400).send({"message":"bad request"});
  }
  else if(req.method !=='GET'){
    res.setHeader('Cache-control' ,'no-cache');
    return res.status(405).send({"message":"method not allowed"});
  }
  else{
  sequelize
    .authenticate()
    .then(() => {
      return res.status(200).send({"message":"ok"});
    })
    .catch((error) => {
      return res.status(503).send({"message":"Service unavailable" })
    });
  }
}

module.exports = checkHealthEndpoint;
