function populateDiv(div, clueobj) {
  if (clueobj == undefined || clueobj.beginning == undefined) {
    div.textContent = "An unexpected error has occurred. Please contact the hung manager."
  } else {    
    const p = document.createElement('p');
    p.setAttribute('class', 'lead');

    var clue_content = clueobj.beginning;
    console.log(clue_content);
    if (clue_content.includes("\n")) {
      console.log("splitting");
      clue_lines = clue_content.split("\n");
    } else {
      console.log("not splitting");
      clue_lines = [clue_content];
    }
    console.log(clue_lines);
    
    var lastp = p;
    for (i = 0; i < clue_lines.length; i++) {
      var p2 = document.createElement('p');
      p2.setAttribute('class', 'lead');
      p2.textContent = clue_lines[i];
      lastp.appendChild(p2);
      lastp = p2;
    }
    div.appendChild(p);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.local.get({
      clueobject: {}
    }, function(items) {
      const div = document.createElement('div');
      populateDiv(div, items.clueobject);
      document.getElementById("hunt-clue").appendChild(div);

      var hunt_data = items.clueobject; //TODO: ADD TITLE AND SUCH
      var img = hunt_data.background;
      if (img == undefined) {
        img = "https://images.unsplash.com/photo-1583425921686-c5daf5f49e4a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=889&q=80";
      }
      var sheet = document.styleSheets[2];
      sheet.insertRule("body { ,height: 100%; background: url('" + img + "') no-repeat center; background-size: cover; background-position: cover;}", 0);

      var title = hunt_data.name;
      if (title == undefined) {
        title = "Scavenger Hunt";
      }
      document.getElementById("hunt-title").textContent=title;
    });
}, false);