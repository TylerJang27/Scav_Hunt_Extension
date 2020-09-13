document.addEventListener('DOMContentLoaded', function () {

    const bg = chrome.extension.getBackgroundPage() //gets access to background.js background page window
    const div = document.createElement('div')
    if (bg.clue.error != undefined) {
      div.textContent = 'Keep looking 1!'
    } else if (bg.clue.url != undefined) {
      div.textContent = `${bg.clue.url}: ${bg.clue.text}`
    } else {
      div.textContent = 'Keep looking!'
    }
    document.body.appendChild(div)

    // Object.keys(bg.clue).forEach(function (url) {
    //   const div = document.createElement('div')
    //   div.textContent = `${url}: ${bg.clue[url]}`

    //   //TODO 3: RATHER THAN POPULATE WITH DIV AND STUFF, POPULATE WITH THE CORRECT STUFF

    //   document.body.appendChild(div)
    // })
  



    // document.querySelector('button').addEventListener('click', onclick, false)
    
    // function onclick () {
    //   chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, 'hi', setCount)
    //   })
    // }
    
    // function setCount (res) {
    //   const div = document.createElement('div')
    //   div.textContent = `${res.count} bears`
    //   document.body.appendChild(div)
    // }
  }, false)