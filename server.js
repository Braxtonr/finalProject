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

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

async function getTeams(res){
    const teams = await Team.find();
    console.log(teams);
    res.send(teams);
}

app.get('/api/nba-league', (req,res)=>{
    let teams = getTeams(res);
});

app.get('/api/nba-league/:id',(req,res)=>{
    let team = getTeam(req.params.id,res)
})

async function getTeam(id,res){
    const team = await Team
    .findOne({_id:id});
    console.log(team);
    res.send(team);
}

app.put('/api/nba-league/:id',(req,res)=>{
    const result = validateTeam(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    updateTeam(res,req.params.id, req.body.name, req.body.location, req.body.conference, req.body.arena, req.body.colors );
});

async function updateTeam(res, id, name, location, conference, arena, colors) {
    //fist param: to find, second update
    const result = await Team.updateOne({_id:id},{
        $set:{
            name: name,
            location: location,
            conference: conference,
            arena:arena,
            colors:colors
        }
    })
    
    res.send(result);
}

app.delete('/api/nba-league/:id',(req,res)=>{
    removeTeam(res, req.params.id);
});

async function removeTeam(res, id) {
    const team = await Team.findByIdAndRemove(id);
    res.send(team);
}

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});