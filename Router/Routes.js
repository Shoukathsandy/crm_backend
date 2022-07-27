import express from "express";
import bcrypt from "bcrypt";
import auth from "./auth.js";
import jwt from "jsonwebtoken";
import {   getAllUserDetails,
    addEmpolyee,
    getUserName,
    addleave,
    getleaveDetails,
    updateuserDetails,
    applyservices,
    removeleave,
    removeservice,
    leavelist,
    updateuserLeave,
    updateuserService,
    servicelist,
    passtokenset,
    getUserpasstoken,
    updateuserpassDetails,
    getUserDetails,} from "./helper.js";


const router = express.Router();

 async function genhashpassword(password) {
    //no.of.round salt
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password,salt);
    return hashedpassword;
}

router.get("/", function (req, res) {
    res.send("this page created for crm app");
});

router.post("/register", async function (req, res) {
    try {
        //destructred the body data
        const { first_name, last_name, emp_id, emp_role, email, password } = req.body;
        //password change as hashed password
        const hashedpassword = await genhashpassword(password);
        //checking dublicate 
        const userExist = await getUserName(email);
        console.log(hashedpassword,userExist);
        if (!userExist) {
            const result = await addEmpolyee({
                first_name: first_name,
                last_name: last_name,
                emp_id: emp_id,
                emp_role: emp_role,
                email: email,
                password: hashedpassword

            });
            console.log(result);
            res.status(200).send({ msg: "successfully register" });

        } else {
            res.status(401).send({ error: "already mailid used" });
        }

    } catch (error) {
        res.status(500).send({ error: 'internal server error' });

    };
});


router.post("/login", async function(req,res){
    try {
        const {email,password} = req.body;
    const userExist = await getUserName(email);
    if(!userExist){
            res.status(401).send({error:"credential are not match"});

    }else{
        const storedpassword = userExist.password;
        const ispasswordmatch = await bcrypt.compare(password,storedpassword);
        if(ispasswordmatch){
            const token = jwt.sign({id:userExist.password},process.env.SECRET_KEY);
            res.status(200).send({token:token,email:userExist.email});
        }else{
            res.status(401).send({error:"invalid login id or password"});
        }
    }
        
    } catch (error) {
        res.status(500).send({error:"internal server error"});
    }
    
})
//current user details method
router.get("/userdetails/:email", auth, async function (req, res) {
    try {
      const { email } = req.params;
      //user exists or not function
      const isuserexist = await getUserName(email);
  
      if (!isuserexist) {
        res.status(401).send({ error: "invalid credentials" });
      } else {
        res.status(200).send(isuserexist);
      }
    } catch (error) {
      res.status(500).send({ error: "interval error" });
    }
  });
  // apply leave method
  router.post("/applyleave/:email", auth, async function (req, res) {
    try {
      const data = req.body;
      const email = req.params.email;
      
      const id = Math.floor(Math.random() * (999 - 100 + 1) + 100);
  
      const applyleave = await addleave(email, data);
      res.status(200).send({ msg: "successfully" });
    } catch (error) {
      res.status(500).send({ error: "interval error" });
    }
  });
  // get leave list of current user
  router.get("/leavelist/:email", async function (req, res) {
    try {
      const email = req.params.email;
      const leavelist = await getleaveDetails(email);
      if (leavelist === null) {
        res.status(403).send({ error: "No such data found" });
      } else {
        res.status(200).send(leavelist);
      }
    } catch (error) {
      res.status(500).send({ error: "interval error" });
    }
  });
  // profile edit method
  router.put("/updatedetails/:email", auth, async function (req, res) {
    try {
      const { email } = req.params;
  
      const data = req.body;
  
      const isuserexist = await getUserName(email);
  
      if (!isuserexist) {
        res.status(401).send({ error: "invalid credentials" });
      } else {
        const updatedetails = await updateuserDetails(email, data);
  
        res.status(200).send({ msg: "updated successfully" });
      }
    } catch (error) {
      res.status(500).send({ error: "interval error" });
    }
  });
  // get all user details
  router.get("/userdetails", async function (req, res) {
    const result = await getAllUserDetails();
    if (result.length > 0) {
      res.status(200).send(result);
    } else {
      res.status(401).send({ error: "no user details" });
    }
  });
  // apply service
  router.post("/applyservices/:email", auth, async function (req, res) {
    try {
      const data = req.body;
      const email = req.params.email;
  
      const services = await applyservices(email, data);
      res.status(200).send({ msg: "successfully" });
    } catch (error) {
      res.status(500).send({ error: "interval error" });
    }
  });
  //delete leave method
  router.delete("/removeleave/:email/:id", async function (req, res) {
    try {
      const email = req.params.email;
      const id = req.params.id;
      const isuserexist = await getUserName(email);
      
      if (!isuserexist) {
        res.status(401).send({ error: "no user found" });
      } else {
        const isleaveremoved = await removeleave(email, id);
        
        res.status(200).send({ msg: "deleted successfully" });
      }
    } catch (error) {
      res.status(500).send({ error: "interval error" });
    }
  });
  //delete service method
  router.delete("/removeservice/:email/:id", async function (req, res) {
    try {
      const email = req.params.email;
      const id = req.params.id;
      const isuserexist = await getUserName(email);
      
      if (!isuserexist) {
        res.status(401).send({ error: "no user found" });
      } else {
        const isservicemoved = await removeservice(email, id);
  
        res.status(200).send({ msg: "deleted successfully" });
      }
    } catch (error) {
      res.status(500).send({ error: "interval error" });
    }
  });
  //get leave list
  router.get("/leavelist", async function (req, res) {
    try {
      const isleavelist = await leavelist();
      if (isleavelist === null) {
        res.status(401).send({ error: "no data found" });
      } else {
        res.status(200).send(isleavelist);
      }
    } catch (error) {
      res.status(500).send({ error: "interval error" });
    }
  });
  //approve leave method
  router.put("/updateapproveleave", auth, async function (req, res) {
    try {
      const { emp_id, id, status } = req.body;
  
      const updateLeave = await updateuserLeave(emp_id, id, status);
  
      res.status(200).send({ msg: "data add successfully" });
    } catch (error) {
      res.status(500).send({ error: "interval error" });
    }
  });
  //service list method
  router.get("/servicelist", async function (req, res) {
    try {
      const isservicelist = await servicelist();
      if (servicelist === null) {
        res.status(401).send({ error: "no data found" });
      } else {
        res.status(200).send(isservicelist);
      }
    } catch (error) {
      res.status(500).send({ error: "interval error" });
    }
  });
  //approve service method
  router.put("/updateapproveservice", auth, async function (req, res) {
    try {
      const { emp_id, id, status } = req.body;
  
      const updateService = await updateuserService(emp_id, id, status);
  
      res.status(200).send({ msg: "data add successfully" });
    } catch (error) {
      res.status(500).send({ error: "interval error" });
    }
  });
  //forgotpassword method
  router.post("/forgotpassword", async function (req, res) {
    try {
      const email = req.body.email;
      let randomString = randomstring.generate();
      const isuserexist = await getUserName(email);
  
      if (!isuserexist) {
        res.status(401).send({ error: "invalid credentials" });
      } else {
        let transporter = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "e3640a19473a56",
            pass: "8c72472b0a0da3",
          },
        });
        //Mail options
        let mailOptions = {
          from: "nodemaililavenil@gmail.com",
          to: email,
          subject: "Reset Password - BrandFP",
          html: `<h4>Hello,</h4><p>We've received a request to reset the password for the AdminFP 
          account. You can reset the password by clicking the link below.
        <a href=${process.env.FRONTEND_URL}/${randomString}>click to reset your password</a></p>`,
        };
        //Send mail
        transporter.sendMail(mailOptions, async (err, data) => {
          if (err) {
            res.status(401).send({ error: "email not send" });
          } else {
            const ispasstoken = await passtokenset(email, randomString);
            
            res
              .status(200)
              .send({
                msg: "email sended successfully",
                pass_token: randomString,
              });
          }
        });
      }
    } catch (error) {
      res.status(500).send({ error: "interval error" });
    }
  });
  // resetpassword method
  router.post("/resetpassword", async function (req, res) {
    try {
      const pass_token = req.body.pass_token;
      const password = req.body.password;
      const confirmpassword = req.body.confirmpassword;
      const isuserpasstokenexist = await getUserpasstoken(pass_token);
  
      if (!isuserpasstokenexist) {
        res.status(401).send({ error: "invalid credentials" });
      } else {
        if (password === confirmpassword) {
          const hashpass = await hashingpassword(password);
  
          const ispasstoken = await updateuserpassDetails(pass_token, hashpass);
  
          res.status(200).send({ msg: "password set successfully" });
        } else {
          res.status(200).send({ error: "confirmed password not match" });
        }
      }
    } catch (error) {
      res.status(500).send({ error: "interval error" });
    }
  });
  router.get("/username", auth, async function (req, res) {
    try {
      const username = await getUserDetails();
      
      res.status(200).send(username);
    } catch (error) {
      res.status(500).send({ error: "interval error" });
    }
  });
  
  export const CRMrouter = router;
  


export const CrmTask = router;