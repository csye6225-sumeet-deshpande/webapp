const Account=require('../models/Account');
const Sequelize=require('sequelize')
const handleError = (error, response) => {
    let errorCode = 400
    if (error == "ID and username do not match" || error == "Provide Basic Auth Credentials"  ) {
        errorCode = 403
        response.sendStatus(errorCode)
    }
    else if (error == "Provided Credentials do not match" || error == "Username does not exist" || error == "Email not verified") {
        errorCode = 401
        response.sendStatus(errorCode)
    }
    else if (error == "Invalid input fields") {
        errorCode = 400
        response.sendStatus(errorCode)
    }
    else if (error == "File not found" || error=="Token not found") {
        errorCode = 404
        response.sendStatus(errorCode)
    }
    console.log(Date().toString() + ' :: Returned '+ errorCode +' :: ' + error )
}


// export const isUserAuthorized = async (request, type) => {
//     // Details received via Basic Auth
//     if (request.headers.authorization == null || !request.headers.authorization.includes('Basic')) {
//         throw "Provide Basic Auth Credentials"
//     }
//     const acc = await auth.parse( request.headers.authorization)
//     const reqUsername = acc.name
//     const reqPass = acc.pass

//     // Data fetched from database
//     const dbAcc = await Account.findOne({
//         where: {
//             email : reqUsername
//         }
//     })
//     if (dbAcc === null) {
//         throw "Username does not exist" // Should return 401
//     }

//     // Verify credentials
//     const reqId = request.params.id
//     const compareResult = await  compare(reqPass,dbAcc.password)
//     if (dbAcc.username === reqUsername &&  compareResult ) {
//         if (reqId == null || type == "document") return dbAcc
//         // Verify if request is made for the correct ID
//         if (dbAcc.id == reqId) {
//             if (dbAcc.isVerified == true) {
//                 return dbAcc
//             } else {
//                 throw "Email not verified"
//             }
//         }
//         else throw "ID and username do not match" // Should return 403
//     } else {
//         throw "Provided Credentials do not match" // Should return 401
//     }

// }


 const setResponseHeader = (res) => {

    res.setHeader("Access-Control-Allow-Credentials", "true");
  
    res.setHeader(
  
      "Access-Control-Allow-Headers",
  
      "X-Requested-With,Content-Type,Accept,Origin"
  
    );
  
    res.setHeader("Access-Control-Allow-Methods", "*");
  
    res.setHeader("Access-Control-Allow-Origin", "*");
  
    res.setHeader("Cache-Control", "no-cache");
  
    return res;
  
  };

module.exports={handleError,setResponseHeader};


