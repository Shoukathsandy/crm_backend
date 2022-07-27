import { client } from "../index.js";

export async function getAllUserDetails() {
    return await client.db("crm").collection("empolyees").find().toArray();
};
export async function addEmpolyee(data){
    return await client.db("crmtask").collection("employees").insertOne(data);
};
   

export async function getUserName(email){
    const result = await client.db("crmtask").collection("employees").findOne({email:email});
    return result;
};

//get user fortget pass word token
export async function getUserpasstoken(pass_token){
    const details=await client.db("crm").collection("empolyees").findOne({pass_token:pass_token})
    return details
}
//get all user name function
export async function getUserDetails(){
    const details=await client.db("crm").collection("empolyees").find({}).project({first_name:1,_id:0}).toArray();
  
    return details
}
// apply leave function
export async function addleave(email,data){
    const details=await client.db("crm").collection("empolyees").updateOne({email:email},{ $push: { leave:data }})
    return details
}
//get leave list function
export async function getleaveDetails(email){
    const details=await client.db("crm").collection("empolyees").findOne({email:email});
    
    return details
}
// edit user details function
export async function updateuserDetails(email,data){
   
    const details=await client.db("crm").collection("empolyees").updateOne({email:email},{$set:data});
    return details
}
// apply services function
export async function applyservices(email,data){
    const details=await client.db("crm").collection("empolyees").updateOne({email:email},{ $push: { services:data }})
    return details
}
// delete leave function
export async function removeleave(email,id){
   
      const no=Number(id);
    const details=await client.db("crm").collection("empolyees").updateOne({email:email},{ $pull : {leave:{id:no}}})
    return details
}
//delete service function
export async function removeservice(email,id){
   
    const no=Number(id);
  const details=await client.db("crm").collection("empolyees").updateOne({email:email},{ $pull : {services:{id:no}}})
  return details
}
// get all leave list
export async function leavelist() {
   return await client.db("crm").collection("empolyees").find({leave: { $elemMatch: {status: { $eq: "pending"} } }}).project({leave:1,_id:0,first_name:1,emp_id:1}).toArray();
    //return await client.db("crm").collection("empolyees").find( { leave: { $elemMatch: {status: { $eq: "pending"} } } } ).toArray();;
}
 // permission  for leave function
export async function updateuserLeave(emp_id,id,status) {
   
    const details=await client.db("crm").collection("empolyees").updateOne({emp_id:emp_id,"leave.id":id},{$set:{"leave.$.status":status}});
    
    return details;
}
//permission for service function
export async function updateuserService(emp_id,id,status) {
   
    const details=await client.db("crm").collection("empolyees").updateOne({emp_id:emp_id,"services.id":id},{$set:{"services.$.status":status}});
    
    return details;
}
// get all service list
export async function servicelist() {
    return await client.db("crm").collection("empolyees").find({services: { $elemMatch: {status: { $eq: "pending"} } }}).project({services:1,_id:0,first_name:1,emp_id:1}).toArray();
    
 }
 // add forgotpassword  token function
 export async function passtokenset(email,randomString) {
    return await client.db("crm").collection("empolyees").updateOne({email:email},{$set:{pass_token:randomString}});
    
 }
 //reset password function
 export async function updateuserpassDetails(pass_token,password){
   
    const details=await client.db("crm").collection("empolyees").updateOne({pass_token:pass_token},{$set:{password:password}});
    return details;
}