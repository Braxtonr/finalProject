const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nba-league', {useUnifiedTopology:true, useNewUrlParser:true})
.then(()=> console.log("Connected to mongodb..."))
.catch((err => console.error("could not connect to mongodb...", err)));

const teamSchema = new mongoose.Schema({
    name: String,
    location: String,
    conference: String,
    arena:String,
    colors:[String]
});


const Team =  mongoose.model('Team', teamSchema);

async function createTeam(team){
    const result = await team.save();
    console.log(result);
}

function validateTeam(team){
    const schema = {
        name:Joi.string().min(3).required(),
        location:Joi.string(),
        conference:Joi.string(),
        arena:Joi.string(),
        colors:Joi.allow()
    };

    return Joi.validate(team, schema);
}

app.post('/api/nba-league', (req,res)=>{
    const result = validateTeam(req.body);

    if(result.error){
        res.status(400).send(result.err.details[0].message);
        return;
    }

    const team = new Team({
        name:req.body.name,
        location:req.body.location,
        conference:req.body.conference,
        arena:req.body.arena,
        colors:req.body.colors
    });

    createTeam(team);
    res.send(team);
});



//render our html page
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
});


async function getTeams(res){
    const teams = await Team.find();
    console.log("First" + teams);
    res.send(teams);
}

app.get('/api/nba-league', (req,res)=>{
    const teams = getTeams(res);
});

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});