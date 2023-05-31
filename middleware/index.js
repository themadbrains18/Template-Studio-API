import jwt from "jsonwebtoken";

export const jwtauth = async (req, res, next) => {
    try {
        if (!req.headers?.token) {
            return res.status(400).json({ success: false, message: "User Not Authorised" });
        }
        jwt.verify(req.headers?.token, process.env.JWT_PRIVATEKEY, async (err, verifiedJwt) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ success: false, message: "User Not Authorised" });
            } else {
    
                if (verifiedJwt === null) {
                    return res.status(400).json({ success: false, message: "User Not Authorised" });
                } else {
                    req.user = verifiedJwt;
                    next();
                }
            }
        });
    } catch (error) {
        console.log(error,'============error');
    }
    
}
