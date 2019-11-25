async function showTeams(){
    
    let response = await fetch(`api/nba-league/`);
    let teams = await response.json();
    let leagueDiv = document.getElementById("league");
    leagueDiv.innerHTML = "";
    console.log(teams);
    for(i in teams){
        console.log(teams[i]);
        leagueDiv.appendChild(getTeamElem(teams[i]));
    }
}

function getTeamElem(team){
    let teamDiv = document.createElement("div");
    teamDiv.classList.add("teams");
    let teamListDiv = document.createElement("div");
    teamListDiv.classList.add("team-list");
    teamDiv.append(teamListDiv);
    let teamHeader = document.createElement("h3");
    teamHeader.innerHTML = team.name;
    teamListDiv.append(teamHeader);
    teamPara = document.createElement('p');
    teamPara.innerHTML = "Located in" + team.location + ". Representing the " + team.conference + " conference in the " 
    + team.arena + " arena. The team colors are " + team.colors + ".";
    teamListDiv.appendChild(teamPara);
    return teamDiv;
}

function showForm(){
    let teamForm = document.getElementById("add-team");
    teamForm.classList.remove("hidden");
}



async function addTeam(){
    const name = document.getElementById("team-name").value;
    const location = document.getElementById("team-location").value;
    const conference = document.getElementById("team-conference").value;
    const arena = document.getElementById("team-arena").value;
    const directionsText = document.getElementById("team-colors").value;
    const colors = directionsText.split("\n");
    const feedbackP = document.getElementById("feedback");
    feedbackP.classList.remove("error");
    feedbackP.classList.remove("success");
    feedbackP.classList.remove("hidden");

    let team = {"name": name, "location": location, "conference": conference, "arena": arena, "colors":colors};
    console.log(team);

    let response = await fetch('/api/nba-league/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(team),
    });

    if(response.status != 200){
        feedbackP.innerHTML = "Error Adding Team to League";
        feedbackP.classList.add("error");
        feedbackP.classList.add("hidden");
        return;
    }

    let result = await response.json();
    feedbackP.innerHTML = "Successfully Added Team to League";
    feedbackP.classList.add("success");    
}

window.onload = function(){
    this.document.getElementById("show-form").onclick = showForm;
    this.document.getElementById("btn-add-team").onclick = addTeam;
    this.showTeams();
}