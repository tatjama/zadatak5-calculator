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

//TODO const validInput = /^[-+]?[0-9]+([-+*/]+[-+]?[0-9]+)*$/;

const inputField = document.querySelector("input");
const btns = document.querySelectorAll(".calculator__btn");
const displayMemory = document.querySelector(".display__memory");
//const btnsValues = [7,8,9,"del", 4, 5, 6, "+", 1, 2, 3, "-", ".", 0, "/", "x", "reset", "=" ];

let memory = "0";
let lastCharacter = "0";
let lastIsNumber =true;
let noDots = true;
let result = null;
let deletedCharacter = "";
function getCharacter(btn){
    if(btn === "del"){
        result = null;        
        lastCharacter = memory[memory.length - 2];
        lastIsNumber = isCharacterNumber(lastCharacter);  
        deletedCharacter = memory[memory.length -1];
        memory = memory.slice(0,memory.length-1);
        let arrayOfDots = memory.split(",");    
        if(arrayOfDots.length > 1) noDots = (!isNaN(arrayOfDots[arrayOfDots.length-1]*1) 
        || lastCharacter === "," || lastCharacter === ".")?false : true;    
        if(deletedCharacter === ",") noDots = true;
        inputField.value = memory;
        return memory        
    }
    if(btn === "reset"){
        memory = "0";
        lastCharacter = "0";
        lastIsNumber = true;
        noDots = true;
        result = null;
        inputField.value = memory; 
        displayMemory.innerHTML = memory;       
        return memory;
    }
    
    let newIsNumber = isCharacterNumber(btn);   
    
    
    if(newIsNumber){  
        if(result || memory == "0"){
            memory = "";
            result = null;
        }
        memory += btn;         
    }else{
        result = null;
        switch(btn){           
            case "-":
                console.log(lastCharacter)
                memory = (lastCharacter == "-")? memory: 
                (lastCharacter == "+" || lastCharacter == "." ||lastCharacter =="," || memory == "0")
                ? (memory.slice(0, memory.length-1) + btn)  : (memory + btn);
                noDots = true;
            break;           
            case "=": 
                (lastIsNumber)&& calculate() ;
            break;
            case ".":                
                memory = (lastIsNumber && noDots)? (memory + ","): (noDots)? memory + "0,": memory;
                noDots = false;
            break;           
            default:
                memory = (lastIsNumber)? (memory + btn): (memory.slice(0, memory.length-1) + btn);
                noDots = true;
                break;  
        }
    }    
//TODO
    function calculate() {
        result = memory.split("");
        
        console.log(result);  
        let first = "";
        let element = "";
        let arrayOfNumbers = [];
        let arrayOfOperators = [];
        let tempLast = "";
        //Find if the first element is -
            first = result.shift();
            console.log("first= " +first)
            if(first !== "-"){
                element = first;
                first = "";
            } 
        console.log(result)
        //Separate numbers and operators in two arrays
        while(result.length > 0){
            let temp = result.shift();
            if(!isNaN(temp*1) || temp === "," ){
                if(element === ""){
                    element = temp;
                }else{
                    element += temp;
                }                
                tempLast = "";
            }else{
                if(temp === "/" || temp === "x") tempLast = temp;
                console.log(element)
                if(element) arrayOfNumbers.push(parseFloat(element.replace(",",".")));
                element ="";
                if(temp === "-" && tempLast !== ""){
                    arrayOfOperators.pop();
                    temp = tempLast + temp;
                    tempLast = "";
                }
                arrayOfOperators.push(temp);
            }
        }
        if(element !== "")arrayOfNumbers.push(parseFloat(element.replace(",",".")));
        element ="";
        
        // Make calculation
        console.log(first)
        console.log(arrayOfOperators);
        console.log(arrayOfNumbers);
        console.log(element);
        memory = result[0]+"";
        btn = memory;
        noDots = true;
        displayMemory.innerHTML = inputField.value
        inputField.value = memory;
    }
    function isCharacterNumber(value){
        return (value*1 || value === "0" )? true: false;
    }

    inputField.value = memory;
    lastCharacter = btn;
    lastIsNumber = isCharacterNumber(lastCharacter);
}
btns.forEach(btn => btn.addEventListener("click",() => getCharacter(btn.innerHTML)))
