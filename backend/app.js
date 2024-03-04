const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const routes = require('./routes/ToDoRoutes')


const cors = require('cors');

const app = express()

const PORT = process.env.PORT ||5000


app.use(express.json())
app.use(cors())


app.get("/",(req,res) =>{
    res.send('hi hi hi...')
})

mongoose
.connect(process.env.MONGO_URl)
.then(() => console.log("Mongoose connected"))
.catch(err => console.log(err));


app.use('/api', routes)

app.listen(PORT, () => console.log(`le serveur demare sur ${PORT}...`))