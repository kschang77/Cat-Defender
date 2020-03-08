const startButton = document.getElementById("start-button")
const instructions = document.getElementById("instructions-text")
const mainPlayArea = document.getElementById("main-play-area")
const shooter = document.getElementById("player-controlled-shooter")
const monsterImgs = ['images/mouse.png', 'images/mouse2.png', 'images/mouse3.png']
  

const scoreCounter = document.querySelector('#score span')

//let justice
let monsterInterval


startButton.addEventListener("click", (event) => {
  shooter.style.left="180px"
  shooter.style.top="350px"  
  playGame()
})


function letShipFly(event) {
  if (event.key === "ArrowLeft") {
    event.preventDefault()
    moveLeft()
  } else if (event.key === "ArrowRight") {
    event.preventDefault()
    moveRight()
  } else if (event.key === " ") {
    event.preventDefault()
    fireLaser()
  }
}


function moveLeft() {
  let leftPosition = window.getComputedStyle(shooter).getPropertyValue('left')
  if (shooter.style.left === "0px") {
    return
  } else {
    let position = parseInt(leftPosition)
    position -= 4
    shooter.style.left = `${position}px`
  }
}


function moveRight() {
  let leftPosition = window.getComputedStyle(shooter).getPropertyValue('left')
  if (shooter.style.left === "360px") {
    return
  } else {
    let position = parseInt(leftPosition)
    position += 4
    shooter.style.left = `${position}px`
  }
}


 function fireLaser() {
  let laser = createLaserElement()
  mainPlayArea.appendChild(laser)
  //let lasefunctionrSFX = new Audio('audio/laser-sfx.m4a')
  //laserSFX.play()
  moveLaser(laser)
}


function createLaserElement() {
  let xPosition = parseInt(window.getComputedStyle(shooter).getPropertyValue('left'))
  let yPosition = parseInt(window.getComputedStyle(shooter).getPropertyValue('top'))
  let newLaser = document.createElement('img')
  newLaser.src = 'images/bullet.png'
  newLaser.classList.add('laser')
  newLaser.style.left = `${xPosition+10}px`
  newLaser.style.top = `${yPosition-20}px`
  return newLaser
}


function moveLaser(laser) {
  let laserInterval = setInterval(() => {
    let yPosition = parseInt(laser.style.top)
    let monsters = document.querySelectorAll(".monster")
    monsters.forEach(monster => {
      if (checkLaserCollision(laser, monster)) {
        //let explosion = new Audio('audio/explosion.m4a')
        //explosion.play()
        monster.src = "images/explosion.png"
        monster.classList.remove("monster")
        monster.classList.add("dead-monster")
        scoreCounter.innerText = parseInt(scoreCounter.innerText) + 100
      }
    })
    if (yPosition <= 40) {
      laser.remove()
    } else {
      laser.style.top = `${yPosition - 4}px`
    }
  }, 10) // was 10
}


function createMonster() {
  let newMonster = document.createElement('img')
  let monsterSpriteImg = monsterImgs[Math.floor(Math.random()*monsterImgs.length)]
  newMonster.src = monsterSpriteImg
  newMonster.classList.add('monster')
  newMonster.classList.add('monster-transition')
  newMonster.style.left = `${Math.floor(Math.random() * 330) + 30}px`
  newMonster.style.top = '30px'
  mainPlayArea.appendChild(newMonster)
  moveMonster(newMonster)
}


function moveMonster(monster) {
  let moveMonsterInterval = setInterval(() => {
    let yPosition = parseInt(window.getComputedStyle(monster).getPropertyValue('top'))
    if (yPosition >= 350) {
      if (Array.from(monster.classList).includes("dead-monster")) {
        monster.remove()
      } else {
        gameOver()
      }
    } else {
      monster.style.top = `${yPosition + 2}px`   // set to 1 for debug, should be 2 or 3
    }
  }, 30)  // was 30
}


function checkLaserCollision(laser, monster) {
  let laserLeft = parseInt(laser.style.left)
  let laserTop = parseInt(laser.style.top)
  let laserRight = laserLeft + 20
  let monsterTop = parseInt(monster.style.top)
  let monsterLeft = parseInt(monster.style.left)
  let monsterRight = monsterLeft + 30
  if (laserTop != 340 && laserTop >= monsterTop) {
    if ( (laserRight <= monsterRight && laserLeft >= monsterLeft) ) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}


function gameOver() {
  window.removeEventListener("keydown", letShipFly)
  //justice.pause()
  //let gameOverSfx = new Audio('audio/game-over.m4a')
  //gameOverSfx.play()
  clearInterval(monsterInterval)
  let monsters = document.querySelectorAll(".monster")
  monsters.forEach(monster => monster.remove())
  let lasers = document.querySelectorAll(".laser")
  lasers.forEach(laser => laser.remove())
  setTimeout(() => {
    alert(`Game Over! A mouse made it past you. Your final score is ${scoreCounter.innerText}!`)
    shooter.style.left = "180px"
    startButton.style.display = "block"
    instructions.style.display = "block"
    scoreCounter.innerText = 0
  }, 1100)  // originally 1100
}

function playGame() {
  startButton.style.display = 'none'
  instructions.style.display = 'none'
  window.addEventListener("keydown", letShipFly)
  //justice = new Audio("audio/Justice-One-Minute-To-Midnight.m4a")
  //justice.play()
  monsterInterval = setInterval(() => { createMonster() }, 2100) // originally 2100
}