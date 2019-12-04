async function showTeams(){
    
    let response = await fetch(`api/nba-league/`);
    let teams = await response.json();
    let leagueDiv = document.getElementById("content");
    console.log(teams);
    leagueDiv.innerHTML = "";
    for(i in teams){
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
    teamPara.innerHTML = "Located in " + team.location + ". Representing the " + team.conference + " conference in the " 
    + team.arena + " arena. The team colors are " + team.colors + ".";
    teamListDiv.appendChild(teamPara);
    let dltBtn = document.createElement("button");
    dltBtn.innerHTML = "Delete";
    dltBtn.onclick = deleteTeam;
    dltBtn.setAttribute("data-id", team._id);
    teamListDiv.append(dltBtn);
    let editBtn = document.createElement("button");
    editBtn.innerHTML = "Edit";
    editBtn.onclick = editTeam
    editBtn.setAttribute("data-id", team._id);
    teamListDiv.append(editBtn);
    return teamDiv;
}

async function editForm(){
    let teamId = this.getAttribute("data-id");
    document.getElementById("edit-team-id").textContent = teamId;

    let response = await fetch(`api/nba-league/${teamId}`);

    if(response.status != 200){
        return;
    }

    let team = await response.json();
    document.getElementById('edit-team-name').value = team.name;
    document.getElementById("edit-team-location").value= team.location;
    document.getElementById("edit-team-conference").value= team.conference;
    document.getElementById("edit-team-arena").value = team.arena;
    
    if(team.colors != null){
        document.getElementById("edit-team-colors").value = team.colors.join('\n');
    }
}
function showAddForm(){
    let teamForm = document.getElementById("add-team");
    teamForm.classList.toggle("hidden");
}

function clearForm(){
    document.getElementById("team-name").value = "";
    document.getElementById("team-location").value = "";
    document.getElementById("team-conference").value = "";
    document.getElementById("team-arena").value = "";
    document.getElementById("team-colors").value = "";
}


async function addTeam(){
    let teamForm = document.getElementById("add-team");
    const name = document.getElementById("team-name").value.trim();
    const location = document.getElementById("team-location").value.trim();
    const conference = document.getElementById("team-conference").value.trim();
    const arena = document.getElementById("team-arena").value.trim();
    const directionsText = document.getElementById("team-colors").value.trim();
    const colors = directionsText.split("\n");
    const message = document.getElementById("feedback");
    message.classList.remove("error");
    message.classList.remove("success");
    message.classList.remove("hidden");

    let team = {"name": name, "location": location, "conference": conference, "arena": arena, "colors":colors};

    let response = await fetch('/api/nba-league/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(team),
    });

    if(response.status != 200){
        message.innerHTML = "Error";
        message.classList.add("error");
        message.classList.add("hidden");
        return;
    }

    let result = await response.json();
    message.innerHTML = "Successful";
    message.classList.add("success"); 
    setTimeout(function(){ message.classList.add("hidden"); }, 1500);
    setTimeout(function(){ teamForm.classList.add("hidden");} ,1500);
    showTeams();
    clearForm();
}

async function editTeam(){
    let id = document.getElementById("edit-workout-id").textContent;
    let name = document.getElementById("edit-team-name").value;
    let location = document.getElementById("edit-team-location").value;
    let conference = document.getElementById("edit-team-conference").value;
    let arena = document.getElementById("edit-team-arena").value;
    let colors = document.getElementById("edit-team-colors").value;
    let team = {"name":name, "location": location, "conference": conference, "arena": arena, "colors": colors};

    let response = await fetch(`api/nba-league/${id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(team),
    });

    if(response.status != 200){
        console.log("Error editing team");
    }
    let result = await response.json;
    showTeams();
}

async function deleteTeam(){
    let teamId = this.getAttribute('data-id');

    let response = await fetch(`/api/nba-league/${teamId}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        }
    });
    if(response.status != 200){
        console.log("Error deleting team");
        return;
    }
    
    let result = await response.json();
    showTeams();
}

window.onload = function(){
    this.document.getElementById("btn-add-team").onclick = addTeam;
    showTeams();
}