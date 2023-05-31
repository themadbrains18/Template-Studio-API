import nodemailer from "nodemailer";

export const sendMail = async (email,otp)=>{
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "pankaj@themadbrains.com",
          pass: "bgeruqaodeukefaf", 
        }
    });
    
    await transporter.sendMail({
        from: 'pankaj@themadbrains.com', // sender address
        to: `${email}`, // list of receivers
        subject: "Template Studio", // Subject line
        html: `<h1> Your OTP is ${otp} </h1>`, // html body
    });
}
