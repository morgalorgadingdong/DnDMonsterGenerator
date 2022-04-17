let monsterArray = []
let monsterArrayRandom = []
let monsterList = []
let counter = 0
let type = []
let typeAll = false //true, false
let size = []
let sizeAll = false //true, false
let challengeRating = 10
let challengeRatingType = 'max' //equal, min, max
let challengeRatingAll = true
let finished
let length
let crMode
const url = `https://www.dnd5eapi.co/api/monsters/`

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
// let idk = document.getElementsByClassName('inactive').addEventListener('click', toggleFilter(idk))

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
        const li = document.createElement('li')
        li.textContent = monsterArrayRandom[num].name
        document.querySelector('ul').appendChild(li)
        li.classList.add("monsterCard")
    } else {
        alert('No results. Please adjust your filters and try again')
    }
}

async function getFetchAll(){
    // if (monsterList.length < 1) {
    //     monsterList = Object.values(localStorage)
    //     console.log(monsterList)
    // }
    let noMonsters = true
    monsterArray.forEach(el => {
        
        let monsterCR = el.challenge_rating
        let monsterType = el.type
        let monsterSize = el.size.toLowerCase()
        if ((checkCR(monsterCR) == true) && (checkType(monsterType) == true) && (checkSize(monsterSize) == true)) {
            const li = document.createElement('li')
            li.textContent = el.name
            document.querySelector('ul').appendChild(li)
            li.classList.add("monsterCard")
            noMonsters = false
        }
    })
    if (noMonsters === true) {
        alert('No matching monsters')
    }
    

    // 

    
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
    let switchInd = false
    if (challengeRatingAll != true) {
        switch (challengeRatingType) {
            case 'equal':
                if (x == challengeRating) {
                    return true
                }
            case 'min':
                if (x >= challengeRating) {
                    return true
                }
            case 'max':
                if (x <= challengeRating) {
                    return true
                }
            }
    } else {
        return true
    }
}

function checkType(x) {
    let typeInd = false
    if (typeAll == true) {
        typeInd = true
    } else {
        type.forEach(el => {
            console.log(el)
            console.log(x)
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
            console.log(el)
            console.log(x)
            if (el == x) {
                sizeInd = true
            }
        })
    }
    return sizeInd
}

function filterToggleType(e, btn, color) {
    let target = e.target,
        count = +target.dataset.count;
    
    if (count === 1) {
        target.style.backgroundColor = "#7FFF00"
        type.push(target.innerHTML.toLowerCase())
        console.log(type)
        target.dataset.count = 0
    } else {
        target.style.backgroundColor = "#FFFFFF"
        type.splice(target.innerHTML, 1)
        console.log(type)
        target.dataset.count = 1
    }
  }

function filterToggleSize(e, btn, color) {
    let target = e.target,
        count = +target.dataset.count;
    
    if (count === 1) {
        target.style.backgroundColor = "#7FFF00"
        size.push(target.innerHTML.toLowerCase())
        console.log(size)
        target.dataset.count = 0
    } else {
        target.style.backgroundColor = "#FFFFFF"
        size.splice(target.innerHTML, 1)
        console.log(size)
        target.dataset.count = 1
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