let monsterArray = []
let monsterArrayRandom = []
let monsterList = []
let counter = 0
let type = []
let typeAll = true //true, false
let size = []
let sizeAll = true //true, false
let challengeRating1
let challengeRating2
let challengeRatingType = 'range' //equal or range
let challengeRatingAll = true
let finished
let length
const url = `https://www.dnd5eapi.co/api/monsters/`

document.getElementById('challenge1').value = 0
document.getElementById('challenge2').value = 30

// localStorage.clear() //for testing purposes

//If local storage is empty, run load data function. Else if local storage has only partially loaded data, clear and re-load it. Else, re-define monsterList and monsterArray based on the data in local storage 
if (localStorage.length == 0) {
    loadData()
} else if (localStorage.length < 664) {
    localStorage.clear()
    loadData()
} else {
    let temp = Object.values(localStorage)
    temp.forEach(el => {
        if (el.charAt(0) == '/') {
            monsterList.push(el)
        } else if (el.charAt(0) == '{') {
            monsterArray.push(JSON.parse(el))
        } else {
            console.log('check local storage for anomaly')
        }
    })
}

document.getElementById('fetchRandomBTN').addEventListener('click', getFetchRandom)
document.getElementById('fetchAllBTN').addEventListener('click', getFetchAll)
document.getElementById('clearBTN').addEventListener('click', clear)

async function loadData() {
    let response = await fetch(url)
    const data = await response.json();
    for (const key in data.results) {
        localStorage.setItem(`url ${counter}`, data.results[key].url)
        counter++
    }
    monsterList = Object.values(localStorage)
    await Promise.all(monsterList.map(async (el) => {
        let url = `https://www.dnd5eapi.co${el}`
        let response = await fetch(url)
        const data = await response.json();    
        localStorage.setItem(`monster ${counter}`, JSON.stringify(data))
        monsterArray.push(data)
        counter++
    }))
}

function clear() {
    const parentId = 'monsterContainer';
    
    let childNodes = document.getElementById(parentId).childNodes;
    for(let i=childNodes.length-1;i >= 0;i--){
        let childNode = childNodes[i];
            childNode.parentNode.removeChild(childNode);
        }  
}

async function getFetchRandom(){
    monsterArrayRandom = []

    //Create a new array (monsterArrayRandom) filtered against filter criteria
    monsterArray.forEach(el => {
        let monsterCR = el.challenge_rating
        let monsterType = el.type
        let monsterSize = el.size.toLowerCase()
        if ((checkCR(monsterCR) == true) && (checkType(monsterType) == true) && (checkSize(monsterSize) == true)) {
            monsterArrayRandom.push(el)
        }
    })
    
    //Use the new filtered array to pull a random obj from
    if (monsterArrayRandom.length > 0) {
        let num = Math.floor(Math.random() * monsterArrayRandom.length)
        let randomMonster = monsterArrayRandom[num]
        buildMonsterCard(randomMonster)
    } else {
        alert('No results. Please adjust your filters and try again')
    }
}



function buildMonsterCard(monster) {
    let li = document.createElement('li')
    let header = document.createElement('h4')
    header.textContent = monster.name
    let subheader = document.createElement('p')
    subheader.textContent = `${monster.size} ${monster.type}, ${monster.alignment}`
    let subsubheader = document.createElement('p')
    subsubheader.textContent = `${monster.challenge_rating}`
    document.querySelector('ul').appendChild(li)
    li.classList.add("monsterCard")
    li.appendChild(header)
    li.appendChild(subheader)
    li.appendChild(subsubheader)
}

async function getFetchAll(){
    let noMonsters = true
    monsterArray.forEach(el => {
        let monsterCR = el.challenge_rating
        let monsterType = el.type
        let monsterSize = el.size.toLowerCase()
        if ((checkCR(monsterCR) == true) && (checkType(monsterType) == true) && (checkSize(monsterSize) == true)) {
            buildMonsterCard(el)
            noMonsters = false
        }
    })
    if (noMonsters === true) {
        alert('No results. Please adjust your filters and try again')
    }
    
    //IN SERIES
    // let count = 0;
    // for await (const i of monsterList) {
    //     let el = monsterList[count]
    //     let url = `https://www.dnd5eapi.co${el}`
    //     let response = await fetch(url)
    //     const data = await response.json();    
    //     let monsterCR = data.challenge_rating
    //     let monsterType = data.type
    //     let monsterSize = data.size.toLowerCase()
    //     if ((checkCR(monsterCR) == true) && (checkType(monsterType) == true) && (checkSize(monsterSize) == true)) {
    //         const li = document.createElement('li')
    //         li.textContent = data.name
    //         document.querySelector('ul').appendChild(li)
    //         li.classList.add("monsterCard")
    //         console.log(`${data.name} Monster Passed Filters`)
    //     }
    //     count++
    // }
    
}

function checkCR(x) {
    let crInd = false
    challengeRating1 = document.getElementById('challenge1').value
    if (challengeRatingType == 'equal') {
        if (x == challengeRating1) {
            crInd = true
        }
    } else if (challengeRatingType == 'range') {
        challengeRating2 = document.getElementById('challenge2').value
        if (x >= challengeRating1 && x <= challengeRating2 ) {
            crInd = true
        }
    }
    return crInd
}

function checkType(x) {
    let typeInd = false
    if (typeAll == true) {
        typeInd = true
    } else {
        type.forEach(el => {
            if (el == x) {
                typeInd = true
            }
        })
    }
    return typeInd
}

function checkSize(x) {
    let sizeInd = false
    if (sizeAll == true) {
        sizeInd = true
    } else {
        size.forEach(el => {
            if (el == x) {
                sizeInd = true
            }
        })
    }
    return sizeInd
}

function crRange() {
    let rangeBtn = document.getElementById('rangeCR')
    let equalBtn = document.getElementById('equalCR')
    count = +rangeBtn.dataset.count;
    if (count === 1) {
        rangeBtn.classList.add("active")
        rangeBtn.classList.remove("inactive")
        challengeRatingType = 'range'
        rangeBtn.dataset.count = 0
        document.getElementById('challenge2').disabled = false
        equalBtn.classList.remove("active")
        equalBtn.classList.add("inactive")
        equalBtn.dataset.count = 1
    }
}

function crEqual() {
    let rangeBtn = document.getElementById('rangeCR')
    let equalBtn = document.getElementById('equalCR')
    count = +equalBtn.dataset.count;
    if (count === 1) {
        equalBtn.classList.add("active")
        equalBtn.classList.remove("inactive")
        challengeRatingType = 'equal'
        equalBtn.dataset.count = 0
        document.getElementById('challenge2').disabled = true
        rangeBtn.classList.remove("active")
        rangeBtn.classList.add("inactive")
        rangeBtn.dataset.count = 1
    } 
}

function filterToggleType(e, btn, color) {
    let target = e.target,
        count = +target.dataset.count;
    
    if (count === 1) {
        target.classList.add("active")
        target.classList.remove("inactive")
        type.push(target.innerHTML.toLowerCase())
        target.dataset.count = 0
        let typeAllBtn = document.getElementById('typeAllBtn')
        if (typeAllBtn.dataset.count == 0) {
            typeAllBtn.classList.remove("active")
            typeAllBtn.classList.add("inactive")
            typeAll = false
            typeAllBtn.dataset.count = 1
        }
    } else {
        target.classList.remove("active")
        target.classList.add("inactive")
        type.splice(target.innerHTML, 1)
        target.dataset.count = 1
        if (type.length == 0) {
            let typeAllBtn = document.getElementById('typeAllBtn')
            typeAllBtn.classList.add("active")
            typeAllBtn.classList.remove("inactive")
            typeAll = true
            typeAllBtn.dataset.count = 0
        }
    }
    console.log(type)
    console.log(typeAll)
  }

function filterToggleTypeAll(e, btn, color) {
    let target = e.target,
        count = +target.dataset.count;

    if (count === 1) {
        target.classList.add("active")
        target.classList.remove("inactive")
        typeAll = true
        target.dataset.count = 0
        clearTypeFilters()
    } else {
        target.classList.remove("active")
        target.classList.add("inactive")
        typeAll = false
        console.log(type)
        target.dataset.count = 1
    }
    console.log(type)
    console.log(typeAll)
}

function clearTypeFilters() {
    let btns = document.getElementsByClassName('typeFilterBtn')
    for  (i=0; i < btns.length; i++) {
        if (btns[1].dataset.count = 1) {
            btns[i].classList.remove('active')
            btns[i].classList.add('inactive')
            btns[i].dataset.count = 1
            type.splice(btns.innerHTML, 1)
        }
    }
}

function filterToggleSize(e, btn, color) {
    let target = e.target,
        count = +target.dataset.count;
    
    if (count === 1) {
        target.classList.add("active")
        target.classList.remove("inactive")
        size.push(target.innerHTML.toLowerCase())
        target.dataset.count = 0
        let typeAllBtn = document.getElementById('sizeAllBtn')
        if (typeAllBtn.dataset.count == 0) {
            typeAllBtn.classList.remove("active")
            typeAllBtn.classList.add("inactive")
            sizeAll = false
            sizeAllBtn.dataset.count = 1
        }
    } else {
        target.classList.remove("active")
        target.classList.add("inactive")
        size.splice(target.innerHTML, 1)
        target.dataset.count = 1
        if (size.length == 0) {
            let sizeAllBtn = document.getElementById('sizeAllBtn')
            sizeAllBtn.classList.add("active")
            sizeAllBtn.classList.remove("inactive")
            sizeAll = true
            sizeAllBtn.dataset.count = 0
        }
    }
    console.log(size)
    console.log(sizeAll)
  }

function filterToggleSizeAll(e, btn, color) {
    let target = e.target,
        count = +target.dataset.count;

    if (count === 1) {
        target.classList.add("active")
        target.classList.remove("inactive")
        sizeAll = true
        target.dataset.count = 0
        clearSizeFilters()
    } else {
        target.classList.remove("active")
        target.classList.add("inactive")
        sizeAll = false
        console.log(type)
        target.dataset.count = 1
    }
    console.log(size)
    console.log(sizeAll)
}

function clearSizeFilters() {
    let btns = document.getElementsByClassName('sizeFilterBtn')
    for  (i=0; i < btns.length; i++) {
        if (btns[1].dataset.count = 1) {
            btns[i].classList.remove('active')
            btns[i].classList.add('inactive')
            btns[i].dataset.count = 1
            size.splice(btns.innerHTML, 1)
        }
    }
}





// async function getFetchOld(){
    
//     monsterArray = []
    
//     counter = 0
    
//     //For each 'size selected, push value into the type array

//   //Fetch top Monster level API data
//     await fetch(url)
//     //   .then(res => res.json()) // parse response as JSON
//       .then(data => {
       
//        length = data.results.length
       
//        //Loop through each key in the Monster Object
//        for (const key in data.results) {
//         console.log(length)
//         let monsterURL = data.results[key].url
//         let urli = `https://www.dnd5eapi.co${monsterURL}`
//         //call the function that check the individual monster object against the given criteria
        
        
//         // fetchIndividualMonster(urli)
//       }

//       if (finished == true) {
//           let monsterIndex = Math.floor(Math.random()*monsterArray.length)
//           console.log(monsterIndex)
//           console.log(monsterArray)
//       } 
      
//       console.log(counter)

//     })

//     let test = await fetch(urli)
//       console.log(test)

//     // .catch(err => {
//     //     console.log(`error ${err}`)
//     // }); 
// }

// async function fetchIndividualMonster(x) {
//     await fetch(x)
//         .then(resi => resi.json()) // parse response as JSON
//         .then(datai => {
//             counter++
//             let challengeRating = 10
//             let monsterChallengeRating = datai.challenge_rating;
//             let monsterType = datai.type;
//             let monsterSize = datai.size;
//             if (monsterChallengeRating == challengeRating) {
//                 monsterArray.push(datai)
//                 console.log('This thing on?')
//             }
//             if (counter == length) {
//                 finished = true
//                 console.log(counter)
//             }    
//   })
//   .catch(err => {
//       console.log(`error ${err}`)
//   }); 
// }

//If Challenge rating filter exists
       //remove each item that doesn't pass the challenge filter

//If type filter exists
       //remove each item that doesn't pass the type filter

       //If size filter exists
       //remove each item that doesn't pass the type filter

       //let monster count = Count the number of items remaining
       //monsterIndex = math.floor(math.random() * monster count)

       //let monster = data[monsterIndex]