const nodemailer = require('nodemailer');
const User = require('../models/User');
const Course = require('../models/Course');

exports.getIndexPage = async (req, res) => {
  const courses = await Course.find().sort('-createdAt').limit(2);
  const totalCourses = await Course.find().countDocuments();
  const totalTeachers = await User.find({ role: 'teacher' }).countDocuments();
  const totalStudents = await User.find({ role: 'student' }).countDocuments();

  res.status(200).render('index', {
    page_name: 'index',
    courses,
    totalCourses,
    totalTeachers,
    totalStudents,
  });
};

exports.getAboutPage = (req, res) => {
  res.status(200).render('about', {
    page_name: 'about',
  });
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render('register', {
    page_name: 'register',
  });
};

exports.getLoginPage = (req, res) => {
  res.status(200).render('login', {
    page_name: 'login',
  });
};

exports.getContactPage = (req, res) => {
  res.status(200).render('contact', {
    page_name: 'contact',
  });
};

exports.sendEmail = async (req, res) => {
  try {
    const outputMessage = `
  <h1>Mail Details</h1>
  <ul>
  <li>Name: ${req.body.name}</li>
  <li>E-Mail: ${req.body.email}</li>
  </ul>
  <p>Message: ${req.body.message}</p>
  `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: '', // gmail account
        pass: '', // gmail password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Smart Edu Form" <>', // sender address
      to: '', // list of receivers
      subject: 'Smart Edu Contact Form', // Subject line

      html: outputMessage, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    req.flash('success', 'We received your response!');
  } catch (error) {
    req.flash('error', `Oops! Something went wrong, Please try again later`);

    res.status(200).redirect('contact');
  }
  res.status(400).redirect('contact');
};
