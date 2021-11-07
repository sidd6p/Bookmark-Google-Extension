const inputBtn = document.getElementById("input-btn");
const inputBtnCurr = document.getElementById("input-btn-curr");
const inputEl = document.getElementById("input-el");
const msgSuccess = document.getElementById("msg-success");
const renderBtn = document.getElementById("render-btn");
const ulE = document.getElementById("ul-l");
const clearAll = document.getElementById("clear-all");


clearAll.addEventListener("click", clearList);
inputBtn.addEventListener("click", submitBtn);
inputBtnCurr.addEventListener("click", submitBtnCurr);
inputEl.addEventListener("click", function(){
    modifyMessage("hide");
    ulE.innerHTML = "";
});
renderBtn.addEventListener("click", renderData);

function checkUrl(link){
    let url;
    try{
        url = new URL(link);
    }
    catch (_){
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

function clearList(){
    if (localStorage.leadKey){
        localStorage.leadKey = "";
        modifyMessage("clearedAll");
    }
    else{
        modifyMessage("emptyAlready")
    }
}

function modifyMessage(event){
    if (event === "show"){
        msgSuccess.textContent="Entered successfully";
    } 
    else if (event === "emptyAlready"){
        msgSuccess.textContent="List is empty"; 
    }
    else if (event === "clearedAll"){
        msgSuccess.textContent="List is empty now"; 
    }
    else if (event === "alreadyHas"){
        msgSuccess.textContent="Already in the list"; 
    }
    else if (event === "invalidLink"){
        msgSuccess.textContent=`Invalid Link: " ${inputEl.value} ". Please check it once`;
    }
    else{
        msgSuccess.textContent="";

    }
    ulE.innerHTML = "";
    inputEl.value = "";
    
}

function submitBtn(){
    if (checkUrl(inputEl.value)){
        submitLink(inputEl.value);
    }
    else{
        modifyMessage("invalidLink");
    }
}

function submitBtnCurr(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        submitLink(tabs[0].url);
    })
}

function submitLink(link){
    let myLeads = [];
    if (localStorage.leadKey){
        myLeads = JSON.parse(localStorage.leadKey);
        if (myLeads.indexOf(link) == -1){
            myLeads.push(link);
            localStorage.leadKey = JSON.stringify(myLeads);
            modifyMessage("show");
        }
        else{
            modifyMessage("alreadyHas");
        }
    }
    else{
        myLeads.push(link);
        localStorage.leadKey = JSON.stringify(myLeads);
        modifyMessage("show");
    }
}
    

function renderData(){
    if (localStorage.leadKey){
        let data = "";
        let myLeads = JSON.parse(localStorage.leadKey);
            for (let i=0; i<myLeads.length; i++){
                data += `
                <li>
                    <a target=_blank href= ${myLeads[i]}>
                        ${myLeads[i]}
                    </a>
                </li>
                `;
            }
        ulE.innerHTML = data;
    }
    else{
        modifyMessage("emptyAlready")
    }
}   

