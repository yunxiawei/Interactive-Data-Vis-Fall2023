console.log('hello world');

const string = "string"
const number = 5;
const boolean = true; //false
const string_not_boolean ="false";
const array = [1,2,3] //["one", "two"]
const object ={
    "key": "value",
    "key": "value",
}

const thing = 1;
const thingTwo = 1;

const obj = { key: "value" }
const objTwo = { key: "value" }

const arrayTwo = ["one", "two", "three"]
const arrayThree = arrayTwo.forEach(d => console.log(d + "way"))
console.log(arrayTwo, arrayThree)


let arrayFour = [];
arrayTwo.forEach(d => arrayFour.push(d))
console.log(arrayFour)
//chatgpt like to do in this way


let changedableGlobal =true;
const constantGlobal = true;
const changeEmUp = () => {
    changedableGlobal =false;
    console.log('changeableGlobal', changedableGlobal)
    const constantGlobal =false;
    console.log('constantGlobal', constantGlobal)
};
changeEmUp();
console.log('constantGlobal', constantGlobal)

const varying = 10;
const stringTwo =`string part with a ${varying} part`
console.log('stringTwo', stringTwo)
//above are practicing section during class


//for assignment 1_3_basic_html: to create clicks
let yesCount = 0;
let noCount = 0;

function onClick(buttonId, counterId) {
    if (buttonId === "yesButton") {
        yesCount++;
        document.getElementById(counterId).innerText = yesCount;
    } else if (buttonId === "noButton") {
        noCount++;
        document.getElementById(counterId).innerText = noCount;
    }
}

document.getElementById("yesButton").addEventListener("click", () => {
    onClick("yesButton", "yesCount");
});

document.getElementById("noButton").addEventListener("click", () => {
    onClick("noButton", "noCount");
});


//to add function for html page created - labels
const input = document.getElementById("seafood")
const label = document.getElementById("label")
//console.log('label', input)
let answer =null;

//way 1
function shareAnswer() {
    answer = input.value
    window.alert(`You could be allergic to seafood: ${answer}`)
    label.innerHTML =`You said ${answer}. Do you want to change it?`
}

// way 2
//const shareAnswer = ()=> {
//  answer = input.value
// window.alert(`You could be allergic to seafood: ${answer}`)
//   label.innerHTML =`You said ${answer}. Do you want to change it?`
//}