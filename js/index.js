let userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

const body = document.querySelector("body");
const switcher = document.querySelector(".theme__switcher");
const switcherContainer = document.querySelector(".theme__switcher-container");

let theme = (!userPrefersLight)? "dark-mode": "light-mode";
let themeCounter = (theme == "dark-mode")? 0: 1;
let switcherPosition =  (theme == "dark-mode")? "0" : "22px";

body.classList.add(theme);
switcher.style.marginLeft = switcherPosition;
switcherContainer.addEventListener("click",changeTheme);

function changeTheme() {
    themeCounter++;    
     switch(themeCounter % 3 ){       
        case 1: theme = "light-mode"; switcherPosition = "22px";
        break;
        case 2: theme = "violet-mode"; switcherPosition = "44px";
        break; 
        default: theme = "dark-mode" ; switcherPosition = "0";
        break;
    }
    let lastTheme = body.className;
    body.classList.remove(lastTheme);
    body.classList.add(theme);
    switcher.style.marginLeft = switcherPosition;
}
