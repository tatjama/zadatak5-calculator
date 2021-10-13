//Start Color Theme Manipulation
const userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
const body = document.querySelector("body");
const switcher = document.querySelector(".theme__switcher");
const switcherContainer = document.querySelector(".theme__switcher-container");

//Default Values of Color Theme and Switch Position 

let theme = (!userPrefersLight)? "dark-mode": "light-mode";
let themeCounter = (theme == "dark-mode")? 0: 1;
let switcherPosition =  (theme == "dark-mode")? "0" : "22px";
body.classList.add(theme);
switcher.style.marginLeft = switcherPosition;

const  changeTheme = () => {
    themeCounter++;    
     switch(themeCounter % 3 ){       
        case 1: theme = "light-mode"; switcherPosition = "22px";
        break;
        case 2: theme = "violet-mode"; switcherPosition = "44px";
        break; 
        default: theme = "dark-mode" ; switcherPosition = "0";
        break;
    }
    //Remove Last Color Theme   
    body.classList.remove(body.className);
    body.classList.add(theme);
    switcher.style.marginLeft = switcherPosition;
}
switcherContainer.addEventListener("click",changeTheme);

//End Color Theme Manipulation

//Calculator 

//const validInput = /^[-+]?[0-9]+([-+*/]+[-+]?[0-9]+)*$/;

const inputField = document.querySelector("input");
const btns = document.querySelectorAll(".calculator__btn");
const displayMemory = document.querySelector(".display__memory");
//const btnsValues = [7,8,9,"del", 4, 5, 6, "+", 1, 2, 3, "-", ".", 0, "/", "x", "reset", "=" ];
//console.log(btns[0]);
let memory = "0";
let lastIsNumber =true;
let lastCharacter = "0";
let noDots = true;
let result = null;
function getCharacter(btn){
    //(result)? console.log("ima result"): console.log("nema")
    if(btn === "del"){
        result = null;
        lastCharacter = memory[memory.length - 1]
        lastIsNumber = (lastCharacter*1 || lastCharacter === "0")? true: false;
        if(lastCharacter === ",")noDots = true;
        memory = memory.slice(0,memory.length-1);
        inputField.value = memory;
        return memory
    }
    if(btn === "reset"){
        lastCharacter = "0";
        lastIsNumber = true;
        noDots = true;
        memory = "0";
        result = null;
        inputField.value = memory; 
        displayMemory.innerHTML = memory;       
        return memory;
    }
    //Find is new Character Number
    let newIsNumber = (btn*1 || btn === "0" )? true: false;
    
    
    if(newIsNumber){        
       /* if(!result && memory !== "0"){
        }else{
            memory = "";
            result = null;
        }  */
        if(result || memory == "0"){
            memory = "";
            result = null;
        }
        memory += btn;
       inputField.value = memory;  
    }else{
        console.log("da li je last number = " + lastIsNumber)
        result = null;
        switch(btn){           
            case "-":
                memory = (lastCharacter == "-")? memory: 
                (lastCharacter == "+")? (memory.slice(0, memory.length-1) + btn)  : (memory + btn);
                noDots = true;
            break;           
            case "=": 
                (lastIsNumber)&& calculate() ;
            break;
            case ".":
                console.log("when dot last character is " + lastIsNumber)
                memory = (lastIsNumber && noDots)? (memory + ","): (noDots)? memory + "0,": memory;
                noDots = false;
            break;           
            default:
                memory = (lastIsNumber)? (memory + btn): (memory.slice(0, memory.length-1) + btn);
                noDots = true;
                break;
            /* case "+": 
                memory = (lastIsNumber)? (memory + btn): (memory.slice(0, memory.length-1) + btn);
                noDots = true;
            break;
            case "x":
                memory = (lastIsNumber)? (memory + btn) : (memory.slice(0, memory.length-1) + btn);
                noDots = true;
            break;
            case "/":
                memory = (lastIsNumber)? (memory + btn) : (memory.slice(0, memory.length-1) + btn);
                noDots = true;
            break;*/    
        }
        inputField.value = memory;
    }
    function calculate() {
        console.log("calculating")
        result = memory.split("");
        memory = result[0]+"";
        btn = memory;
        //lastIsNumber = true;
        noDots = true;
        displayMemory.innerHTML = inputField.value
        inputField.value = memory;
        //return memory;
    }
    lastCharacter = btn;
    //console.log("last character = " +lastCharacter)
    lastIsNumber = (lastCharacter*1  || lastCharacter === "0")? true: false;;    
    //console.log(lastIsNumber)
}
btns.forEach(btn => btn.addEventListener("click",() => getCharacter(btn.innerHTML)/*alert(typeof(btn.innerHTML))*/))
