const Account = require("../models/Account")
const { getUserPasswordAuth, comparePassword } = require('../utils/auth')
const { logger } = require("../utils/utils")

const authorizeToken = async (req, res, next) => {
    const authHeader = req.headers.authorization
    logger.info("Authorize Token");
    if (!authHeader) {
      logger.info("Invalid Authorize Header");
      return res.status(401).json({
        message: 'Missing authorization header',
      })
    }
    const { username, password } = getUserPasswordAuth(authHeader)
    const user = await Account.findOne({
      where: {
        email:username,
      },
    })
    if (!user) {
      logger.info("Unauthorized: Invalid username or password");
      return res.status(401).json({
        message: 'Unauthorized: Invalid username or password',
      })
    }
    const isPasswordMatch = await comparePassword(password, user.password)
    if (!isPasswordMatch) {
      logger.info("Unauthorized: Invalid username or password");
      return res.status(401).json({
        message: 'Unauthorized: Invalid username or password',
      })
    }
    global.email=username;
    next()
  }

 module.exports={authorizeToken}