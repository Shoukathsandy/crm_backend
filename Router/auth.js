import jwt from "jsonwebtoken";


//jwt token verify 
export default function auth(req,res,next){
    try {
        const data = req.header("x-auth-token");
        jwt.verify(data,process.env.SECRET_KEY);
        next();
    } catch (error) {
        res.status(401).send({"error":err.message});
    }
};