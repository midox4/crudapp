// imports

require('dotenv').config();
const express = require('express')
const mongose = require('mongoose')
const session = require('express-session');
const { default: mongoose } = require('mongoose');
const fs = require('fs');



const app = express()
app.use(express.static("uploads"));

const PORT = process.env.PORT || 5000 

//database connection 

 mongoose.connect(process.env.DB_URI, {useNewUrlParser: true,
    useUnifiedTopology: true
})
 const db = mongoose.connection;
//connection data base autre code 





db.on("error", (error)=> console.log('error to connect'));
db.once("open",() => console.log('connected to the database '));

// middlewares 

app.use(express.urlencoded({extented: false}));
app.use(express.json());
app.use(session({
    secret:'my secret key',
    saveUninitialized: true,
    resave: false,
}))

app.use((req,res,next)=> {

    res.locals.message= req.session.message;
    delete req.session.message;
    next();
})

// set template engine 

app.set('view engine', 'ejs');


// route prefix
app.use("", require('./routes/routes'))

// app.get("/", (req,res)=>{

//     res.send("hello");
// });



app.listen(PORT,()=>{
    console.log(`server started at http://localhost:${PORT}`)
});
