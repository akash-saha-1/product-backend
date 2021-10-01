const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const userRoutes = require('./routes/users.js');
const productRoutes = require('./routes/products.js');
const cors = require('cors');
require('dotenv').config();
const app = express();

// cors enable
app.use(cors());
app.options('*', cors());

//logging each request in server
app.use(morgan('tiny'));

//static path for serving files
app.use('/uploads', express.static(__dirname + '/uploads'));

// getting response body
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));

// users route
app.use('/user', userRoutes);

// product routes
app.use('/product', productRoutes);

//database connection intialization
mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.j04jo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error('Error occured while db connection due to ' + err);
      return false;
    }
    console.log(`server started at port ${process.env.PORT}`);
  }
);

app.listen(process.env.PORT);
