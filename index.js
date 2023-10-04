const express= require('express');
const app = express();
const cors=require('cors');
const csv = require('csv-parser');
const fs = require('fs');
const Account =require('./models/Account');
const port = process.env.PORT || 9090;
// app.use(cors());

app.use(express.json())
const healthCheckRoutes = require('./routes/healthCheckRoute');
const assignmentRoutes =require('./routes/assignmentroutes');
app.use('/',assignmentRoutes);
//const Account = require('./models/Account');
app.use('/',healthCheckRoutes);
app.use((req, res) => {
    res.setHeader('Cache-control' ,'no-cache');
    return res.status(404).send({message:"Not found"});
  });



module.exports = app;
async function initializeDatabaseWithCSVData() {
  try {
    await Account.sequelize.sync(); // Sync the database schema

    // Load the CSV file
    fs.createReadStream(process.env.CSVPATH )
      .pipe(csv())
      .on('data', async (row) => {
        const username = row.email;

        try {
          const user = {
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email,
            password: row.password
          };

          const existingUser = await Account.findOne({
            where: { email: row.email },
          });

          if (!existingUser) {
            const acc = await Account.create(user);
          }

        } catch (e) {
          console.log(e);
        }
      })
      .on('end', () => {
        console.log('CSV file successfully loaded.');
      });

  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the function to initialize the database with CSV data
initializeDatabaseWithCSVData();

    // (async () => {
    //     try {
        
    //         Account.sequelize.sync();
    //       // Load the CSV file at application startup
    //       fs.createReadStream('./users.csv')
    //         .pipe(csv())
    //         .on('data', async (row) => {
    //           const username = row.email;
    //           console.log("row")
             
    //           try {
    //               const user = {
    //                   first_name : row.first_name,
    //                   last_name : row.last_name,
    //                   email : row.email,
    //                   password : row.password
    //               }
    //               const existingUser = await Account.findOne({
    //                 where: { email: row.email },
    //               });
    //               if(!existingUser){
    //               const acc =  await Account.create(user);
    //               console.log("acc");
    //               }
                  

    //           } catch (e) {
    //             console.log(e);
    //           }
    //           // const existingUser = await Account.findOne({
    //           //   where: { email: row.email },
    //           // });
    //           // console.log("USERRR:::::",existingUser);
    //           // if (!existingUser) {
    //           //   // Create a new user in the database
    //           //   await User.create({
    //           //     id: row.id, // Automatically generated UUID
    //           //     first_name: row.first_name,
    //           //     last_name: row.last_name,
    //           //     password: row.password,
    //           //     email: row.email,
    //           //     account_created: row.account_created, // Provided date-time
    //           //     account_updated: row.account_updated, // Provided date-time
    //           //   });
    //           // }
    //         })
    //         .on('end', () => {
    //           console.log('CSV file successfully loaded.');
      
           
    //          // userController.loadData(); 
      
            
            
      
             
    //         });
    //     } catch (error) {
    //       //console.error('Error:', error);
    //     }
    //   })();
      


app.listen(port, () => {
  console.log("Server is runing");
})