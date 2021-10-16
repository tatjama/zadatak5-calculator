//START COLOR THEME MANIPULATION

const userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
const body = document.querySelector("body");
const switcher = document.querySelector(".theme__switcher");
const switcherContainer = document.querySelector(".theme__switcher-container");

/*Start Default Values of Color Theme and Switch Position */

let theme = (!userPrefersLight)? "dark-mode": "light-mode";
let themeCounter = (theme == "dark-mode")? 0: 1;
let switcherPosition =  (theme == "dark-mode")? "0" : "22px";
body.classList.add(theme);
switcher.style.marginLeft = switcherPosition;

/**End Default Values of Color Theme */

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

/*END COLOR THEME MANIPULATION*/

/*START CALCULATOR */

const inputField = document.querySelector("input");
const btns = document.querySelectorAll(".calculator__btn");
const displayMemory = document.querySelector(".display__memory");

let memory = "0";
let lastCharacter = "0";
let lastIsNumber =true;
let noDots = true;
let result = null;
let deletedCharacter = "";
let sizeOfScreen = (window.innerWidth > 600)? 15: 12;

/**Start Input values through numeric keyboard */

const handleKeyDown = (e) => {
    e.preventDefault();
    let newKey; 
    switch(e.key){
        case "*" : newKey = "x";
        break; 
        case "Enter": newKey = "=";
        break;
        case "Backspace": newKey = "del";
        break;
        case "Delete": newKey = "reset";
        break;
         default : newKey = e.key
         break;
    }
    getCharacter(newKey)
}

/**End Input values through numeric keyboard */

const countOperation = (first, operator, second) => {
    let res = 0 
    switch(operator){
        case "+": res = (first * 10 + second * 10) / 10;
        break;
        case "-": res = (first * 10 - second * 10) / 10;
        break;
        case "x": res = first * second;
        break;
        case "/": res = first / second;
        break;
        case "x-": res = -1 * first * second;
        break;
        case "/-": res =-1 * first / second;
        break;
        default: res = 0;
            break;
    }
    return res;
}            

const isCharacterNumber = (value) =>{
    return (value*1 || value === "0" )? true: false;
}

const convertInputToValidArray = () => {
    let firstSign = "";
    let element = "";
    let tempLast = "";
    let convertedArray = [];

    //Find if the first element is -

    firstSign = result.shift();
    if(firstSign !== "-"){
        element = firstSign;
        firstSign = "";
    }

    //Convert  array

    while(result.length > 0){
        let temp = result.shift();
        if(!isNaN(temp*1) || temp === "." ){

            // If temp is number or "," 

            element = (element === "")? temp: element + temp;                                
            tempLast = "";
        }else{

            //If temp is operator 

            if(temp === "/" || temp === "x") tempLast = temp;
            if(element) convertedArray.push(parseFloat(element));
            element ="";
            if(temp === "-" && tempLast !== ""){
                convertedArray.pop();
                temp = tempLast + temp;
                tempLast = "";
            }
            convertedArray.push(temp);
        }
    }

    //Adding last element of result into convertedArray. 

    if(element !== "")convertedArray.push(parseFloat(element));
    element ="";

    //Adding minus sign on first element of convertedArray. 

    if(firstSign !== "")convertedArray[0] = convertedArray[0] * (-1);
    
    // Make calculation
    
    let counter = convertedArray.length
    let newElement;
    
    //First calculate operations * and / 
    
    for(let i = 0; i < convertedArray.length; i++){
        if(convertedArray[i] == "x" || convertedArray[i] == "/" 
        || convertedArray[i] == "x-" || convertedArray[i] == "/-"){                    
            newElement =  countOperation(convertedArray[i-1], convertedArray[i], convertedArray[i+1])
            convertedArray.splice(i,2);
            convertedArray[i-1] = newElement;
            counter = counter-2;
            i--;
        }
        if(i == counter )break ;
    }

    //Second calculate operations + and - 
    
    if(convertedArray.length > 1){
        while(convertedArray.length > 1){
           newElement = countOperation(convertedArray.shift(), convertedArray.shift(), convertedArray.shift());
            convertedArray.unshift(newElement);
        }                
    }
    
    return convertedArray;
}

/*Start Calculate Equal btn */

const calculate = () => {
    memory = memory.toString().replace(/,/g, ".");
    result = memory.split("");        
    return parseFloat(convertInputToValidArray()[0].toFixed(2));
}

/**Start Validation of Expression */

function getCharacter(btn){
    let pattern = /[0-9-/+x.,=]/;
    let pattern1 = /reset/;
    let pattern2 = /del/;

    //Validation of input characters only numbers, operations, del, reset and .

    if(!pattern.test(btn) && !pattern1.test(btn) && !pattern2.test(btn)){return}
    let newIsNumber = isCharacterNumber(btn); 

    const displayResult = () =>{      
        displayMemory.innerHTML = memory;  
        let resultOfCalculation = calculate();
        memory = resultOfCalculation.toString();
        btn = memory;
        noDots = true;        
        inputField.value =  memory;
    }
    
    if(btn === "del"){
        if (memory == NaN){
            displayMemory.innerHTML = memory;
            inputField.value = "0";
            memory ="";
        }else{
            result = null;        
        lastCharacter = memory[memory.length - 2];
        lastIsNumber = isCharacterNumber(lastCharacter);  
        deletedCharacter = memory[memory.length -1];
        memory = memory.slice(0,memory.length-1);
        let arrayOfDots = memory.split(",");    
        if(arrayOfDots.length > 1) noDots = (!isNaN(arrayOfDots[arrayOfDots.length-1]*1) 
        || lastCharacter === "," || lastCharacter === ".")?false : true;    
        if(deletedCharacter === ",") noDots = true;
        inputField.value = (memory.length <= sizeOfScreen)? memory: memory.slice(memory.length-sizeOfScreen);
        return 
        }              
    }

    if(btn === "reset"){
        lastCharacter = null;
        lastIsNumber = true;
        noDots = true;
        result = null;  
        memory = "";
        displayMemory.innerHTML = inputField.value;  
        inputField.value = "0";        
        return 
    }        
    
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
                memory = (lastCharacter == "-")? memory: 
                (lastCharacter == "+" || lastCharacter == "." || lastCharacter =="," || memory == "0")
                ? (memory.slice(0, memory.length-1) + btn)  : (memory + btn);
                noDots = true;
            break;           
            case "=": 
                (lastIsNumber)&& displayResult() ;
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

    /**End Validation of Expression */    
    
    inputField.value = (memory.length <= sizeOfScreen)? memory: memory.slice(memory.length-sizeOfScreen);
    lastCharacter = btn;
    lastIsNumber = isCharacterNumber(lastCharacter);
}

/**Add Event listeners */

btns.forEach(btn => btn.addEventListener("click",() => getCharacter(btn.innerHTML)))
inputField.addEventListener("keydown", handleKeyDown);

/**END CALCULATOR */