//Onpage load
//Pull Monsters obj from API
//Store in Local Storage
    //Once done, generate button changes color

//User Clicks button
//Function1 
//  Parses through monsterList obj, visiting each URL from each result and checking it against the supplied criteria
//  if criteria is met, function takes that obj and pushes it onto the results object
//  Once all of the monsters have been checked against the filters, and output array is updated, call second function
//Function2 - all results
//add an li for every monster object (up to 10)

//Function3 - random result
//  let monster count = Count the number of items remaining
//  monsterIndex = math.floor(math.random() * monster count)

let monsterArray = []
let monsterArrayRandom = []
let monsterList = []
let counter = 0
let type = ['undead', 'dragon', 'plant']
let typeAll = false //true, false
let size = ['small', 'medium']
let sizeAll = false //true, false
let challengeRating = 10
let challengeRatingType = 'max' //equal, min, max
let finished
let length
let crMode

const url = `https://www.dnd5eapi.co/api/monsters/`



if (localStorage.getItem("0") === null) {
    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => { 
            for (const key in data.results) {
                localStorage.setItem(counter, data.results[key].url)
                counter++
        }
    })
}

monsterList = Object.values(localStorage)
console.log(monsterList)
// localStorage.setItem('finished', true)



document.getElementById('fetchRandomBTN').addEventListener('click', getFetchRandom)
document.getElementById('fetchAllBTN').addEventListener('click', getFetchAll)
document.getElementById('clearBTN').addEventListener('click', clear)

function clear() {
    const parentId = 'monsterContainer';
    
    let childNodes = document.getElementById(parentId).childNodes;
    for(let i=childNodes.length-1;i >= 0;i--){
        let childNode = childNodes[i];
            childNode.parentNode.removeChild(childNode);
        }
    
}

async function getFetchRandom(){
    monsterArray = []
    if (monsterList.length < 1) {
        monsterList = Object.values(localStorage)
        console.log(monsterList)
    }
    
    let count = 0
    await Promise.all(monsterList.map(async (el) => {
        let url = `https://www.dnd5eapi.co${el}`
        let response = await fetch(url)
        const data = await response.json();    
        monsterArray.push(data)
    }))

    monsterArray.forEach(el => {
        let monsterCR = el.challenge_rating
        let monsterType = el.type
        let monsterSize = el.size.toLowerCase()
        if ((checkCR(monsterCR) == true) && (checkType(monsterType) == true) && (checkSize(monsterSize) == true)) {
            monsterArrayRandom.push(el)
        }
    })
    
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
    if (monsterList.length < 1) {
        monsterList = Object.values(localStorage)
        console.log(monsterList)
    }
    
    //IN PARALLEL
    await Promise.all(monsterList.map(async (el) => {
        let url = `https://www.dnd5eapi.co${el}`
        let response = await fetch(url)
        const data = await response.json();    
        monsterArray.push(data)
    }))

    monsterArray.forEach(el => {
        let monsterCR = el.challenge_rating
        let monsterType = el.type
        let monsterSize = el.size.toLowerCase()
        if ((checkCR(monsterCR) == true) && (checkType(monsterType) == true) && (checkSize(monsterSize) == true)) {
            const li = document.createElement('li')
            li.textContent = el.name
            document.querySelector('ul').appendChild(li)
            li.classList.add("monsterCard")
        }
    })
    

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

function showAllResults(x) {
    console.log(x[0])
    const li = document.createElement('li')
    li.textContent = x[0]
    document.querySelector('ul').appendChild(li)
}

function showRandomResult() {
    
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