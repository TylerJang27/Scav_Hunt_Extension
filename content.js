//alert('Grrr.')
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     const re = new RegExp('bear', 'gi')
//     const matches = document.documentelement.innerHTML.match(re);
//     sendResponse({count: matches.length})
//     //alert(request)
// })

// const re = new RegExp('bear', 'gi')
// const matches = document.documentElement.innerHTML.match(re) || []

var fs=require('fs'); //TODO: VERIFY FS WORKS
var json_string=fs.readFileSync('res/hunt.json', 'utf8');
var hunt_data=JSON.parse(data);
var clues = hunt_data.clues;

//TODO 1A: LOOP THROUGH CLUES AND DETERMINE A URL MATCH
var re = new RegExp()
var matches = window.location.href.match(re);



//can do highlighting here to, may have to do some request stuff correctly for popups, etc. (but that's stage 2)

//TODO 1B: 
chrome.runtime.sendMessage({
  url: window.location.href,
  count: matches.length
  //url
  //html source (optional)
  //text (optional)
  //number
  //image (optional)
  //type (always, clickable)
})

//need to do some document getElementById or the innerHTML search and stuff



//from https://stackoverflow.com/questions/35412645/automatically-highlight-specific-word-in-browser
// var all = document.getElementsByTagName("*");
// highlight_words('Bryant', all);

// function highlight_words(keywords, element) {
//     if(keywords) {
//         var textNodes;
//         keywords = keywords.replace(/\W/g, '');
//         var str = keywords.split(" ");
//         $(str).each(function() {
//             var term = this;
//             var textNodes = $(element).contents().filter(function() { return this.nodeType === 3 });
//             textNodes.each(function() {
//                 var content = $(this).text();
//                 var regex = new RegExp(term, "gi");
//                 content = content.replace(regex, '<span class="highlight">' + term + '</span>');
//                 $(this).replaceWith(content);
//             });
//         });
//     }
// }