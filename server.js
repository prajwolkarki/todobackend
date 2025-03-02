const express = require('express'); 
require('dotenv').config();
const connectToDatabase = require('./config/dbConnection');
const routes = require('./routes');
const passport = require('passport');
const session = require('express-session');
require('./config/passportConfig')
const cookieParser = require('cookie-parser');
const cors = require('cors');
//connect to database
connectToDatabase();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionSuccessStatus: 200
};


app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true, 
        secure: false,   
        sameSite: 'lax'  
     }
  }));
  

//middleware  
app.use(cors(corsOptions));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());




app.use('/api',routes);
app.get('/' ,(req,res)=>{
    res.send("Welcome to TODO Application Backend!!!!!!");
})


app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})