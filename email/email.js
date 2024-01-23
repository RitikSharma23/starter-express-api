const nodemailer = require('nodemailer');
const fs=require('fs')
const path=require('path')

const crypto = require('crypto');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ritik.sharma@techglide.in',
      pass: 'Dcba4321@'
    }
});

async function welcomeEmail(req,res,email){
    const templatePath=path.join(__dirname,'Templates','welcome generic','index.html')
    fs.readFile(templatePath, 'utf8', (err, htmlContent) => {
        if (err) {
            return res.json({ status: false, msg: err.message });
        }
        const modifiedHtmlContent = htmlContent;
        const mailOptions = {
          from: 'FindAndConsult@gmail.com',
          to: email,
          subject: 'Welcome To Find And Consult',
          html: modifiedHtmlContent
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error)
          } else {
            console.log("Success")
          }
        });
      });
}

const sendVerificationEmail = async (user) => {
    const templatePath=path.join(__dirname,'Templates','Email Verification','index.html')

    fs.readFile(templatePath, 'utf8', (err, htmlContent) => {
        if (err) {
            console.log(err.message)
            return false
        }
        const modifiedHtmlContent = htmlContent.replace('{{id}}', `http://devapi.findandconsult.com/verify-email?uid=${user._id.toString()}`);
        const mailOptions = {
          from: 'FindAndConsult@gmail.com',
          to: user.email,
          subject: 'Please Verify Your Email Address',
          html: modifiedHtmlContent
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error)
            return false
          } else {
            return true
          }
        });
      });
};






module.exports = {
    sendVerificationEmail,
    welcomeEmail,
   
};
