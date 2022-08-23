const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const userRoute = require('./routes/userRoute');
const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const { options } = require('./routes/userRoute');

const app = express();

//Connect DB
mongoose
  .connect('mongodb://localhost:27017/smartEdu-DB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('DB Connected Successfully');
  });

//Template Engine
app.set('view engine', 'ejs');

//Global Variables
global.userIN = null;

//Middlewares

app.use(express.static('public'));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(
  session({
    secret: 'keyboard_cat',
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost:27017/smartEdu-DB',
    }),
    resave: false,
    saveUninitialized: true,
  })
);

//Routes
app.use('*', (req, res, next) => {
  userIN = req.session.UserID;
  next();
});
app.use('/', pageRoute);
app.use('/users', userRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
