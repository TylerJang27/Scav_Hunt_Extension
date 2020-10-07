function submit() {
    var error = validateInputs();
    if (error == "") {
        const json_gen = generateJson();
        const blob_gen = new Blob([JSON.stringify(json_gen)], {type: 'application/json'});
        const url_gen = URL.createObjectURL(blob_gen);
        chrome.downloads.download({
            url: url_gen
        });
    } else {
        const status = document.getElementById('status');
        const p = document.createElement('p');
        p.textContent = 'Error, missing form content: ' + error + ".";
        p.setAttribute('style', 'color:red;');
        status.appendChild(p);
    }
}

function generateJson() {
    var obj = {};

    obj["name"] = document.getElementById("huntName").value;
    var description = document.getElementById("huntDescription").value;
    if (description != "") {
        obj["description"] = description;
    }
    obj["version"] = "0.9"; //change at each encoding iteration
    var author = document.getElementById("huntAuthor").value;
    if (author != "") {
        obj["author"] = author;
    }
    var background = document.getElementById("huntBackground").value;
    if (background != "") {
        obj["background"] = background;
    }
    var beginning = document.getElementById("huntBeginning").value;
    if (beginning != "") {
        obj["beginning"] = beginning;
    }
    var en = document.getElementById("encryptYes").checked;
    obj["encrypted"] = en;

    var clues = [];
    for (i = 0; i < document.getElementsByTagName("tr").length - 1; i++) {
        clue = {};
        clue["id"] = i;
        var url = document.getElementById("clueURL" + i).value;
        clue["url"] = encryptSoft(url, en);
        var clue_text = document.getElementById("clueText" + i).value;
        clue["text"] = encryptSoft(clue_text, en);
        var clue_image = document.getElementById("clueImage" + i).value;
        if (clue_image != "") {
            clue["image"] = encryptSoft(clue_image, en);
        }
        var clue_alt = document.getElementById("clueAlt" + i).value;
        if (clue_image != "" && clue_alt != "") {
            clue["alt"] = encryptSoft(clue_alt, en);
        }

        var interact_always = document.getElementById("interaction1" + i).checked;
        var interact_submit = document.getElementById("interaction2" + i).checked;
        
        if (interact_always) {
            clue["interact"] = "always";
        } else if (interact_submit) {
            clue["interact"] = "submit";
            var submit_key = document.getElementById("clueKey" + i).value;
            clue["key"] = encryptSoft(submit_key, en);
            var submit_prompt = document.getElementById("cluePrompt" + i).value;
            clue["prompt"] = encryptSoft(submit_prompt, en);
        }
        clues.push(clue);
    }

    obj["clues"] = clues;
    return obj;
}

// Just checks for content, no URL validation
function validateInputs() {
    if (document.getElementById("huntName").value == "") {
        return "Hunt Name";
    }
    var rows = document.getElementsByTagName("tr");
    for (i = 1; i < rows.length; i++) {
        var id = i - 1;
        var urlInput = document.getElementById("clueURL" + id).value;
        var clueInput = document.getElementById("clueText" + id).value;
        //var clueImage = document.getElementById("clueImage" + id).value;
        if (urlInput == "") {
            return "Clue " + id + " URL";
        }
        if (clueInput == "") {
            return "Clue " + id + " Clue Text";
        }
        var submitChecked = document.getElementById("interaction2" + id).checked;
        var keyInput = document.getElementById("clueKey" + id).value;
        if (submitChecked && keyInput == "") {
            return "Clue " + id + " Key";
        }
    }

    return "";
}

function restore_options() {
    location.reload();
}

function removeClue() {
    var rows = document.getElementsByTagName("tr");
    if (rows.length > 1) {
        rows[rows.length-1].remove();
    }    
}

function addClue() {
    var rows = document.getElementsByTagName("tr");
    var table = document.getElementById("clues");
    var new_row = table.insertRow(rows.length);
    generateRow(new_row, rows.length-2);
}

function generateRow(row, id) {
    //generate cells for a row
    var idCell = row.insertCell(0);
    idCell.setAttribute('scope', 'col');
    idCell.textContent = id;

    var urlCell = row.insertCell(1);
    urlCell.setAttribute('scope', 'col');
    urlCell.appendChild(generateInput("clueURL" + id));

    var clueCell = row.insertCell(2);
    clueCell.setAttribute('scope', 'col');
    clueCell.appendChild(generateInput("clueText" + id));

    var imageCell = row.insertCell(3);
    imageCell.setAttribute('scope', 'col');
    imageCell.appendChild(generateInput("clueImage" + id));

    var altCell = row.insertCell(4);
    altCell.setAttribute('scope', 'col');
    altCell.appendChild(generateInput("clueAlt" + id));

    var interactionCell = row.insertCell(5);
    interactionCell.setAttribute('scope', 'col');
    interactionCell.appendChild(generateRadioDiv(1, id));
    interactionCell.appendChild(generateRadioDiv(2, id));

    var promptCell = row.insertCell(6);
    promptCell.setAttribute('scope', 'col');
    promptCell.appendChild(generateInput("cluePrompt" + id));
    promptCell.getElementsByTagName('input')[0].disabled = true;

    var keyCell = row.insertCell(7);
    keyCell.setAttribute('scope', 'col');
    keyCell.appendChild(generateInput("clueKey" + id));
    keyCell.getElementsByTagName('input')[0].disabled = true;
}

function generateRadioDiv(type, id) {
    var typeName = "Always";
    if (type == 2) {
        typeName = "Submit";
    }
    var div = document.createElement('div');
    div.setAttribute('class', 'form-check');

    var radioInput = document.createElement('input');
    radioInput.setAttribute('class', 'form-check-input');
    radioInput.setAttribute('type', 'radio');
    radioInput.setAttribute('name', 'interaction' + id);
    radioInput.setAttribute('id', 'interaction' + type + "" + id);
    radioInput.setAttribute('value', typeName);
    if (type == 1) {
        radioInput.checked = true;
        radioInput.addEventListener('click', disableKey);
    } else {
        radioInput.addEventListener('click', enableKey);
    }

    var label = document.createElement('label');
    label.setAttribute('class', 'form-check-label');
    label.setAttribute('for', 'interaction' + type + "" + id);
    label.textContent = typeName;

    div.appendChild(radioInput);
    div.appendChild(label);
    return div;
}

function generateInput(id) {
    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('class', 'form-control');
    input.setAttribute('id', id);
    return input;
}

function disableKey(num) {
    console.log(this.id);
    console.log(this.id.substring(12, this.id.length));
    var num = this.id.substring(12, this.id.length);
    var key = document.getElementById("clueKey" + num);
    key.disabled = true;
    key.value = "";
    var prompt = document.getElementById("cluePrompt" + num);
    prompt.disabled = true;
    prompt.value = "";
}

function enableKey(num) {
    console.log(this.id);
    console.log(this.id.substring(12, this.id.length));
    var num = this.id.substring(12, this.id.length);
    document.getElementById("clueKey" + num).disabled = false;
    document.getElementById("cluePrompt" + num).disabled = false;
}

function encryptSoft(text, encrypted) {
if (encrypted) { //version 0.9
    var level1 = btoa(text);
    var level2 = level1.split("");
    var level3 = "";
    for (var k = 0; k < level2.length-1; k++) {
        level3 += level1.charAt(k) + Math.random().toString(36).charAt(2);
    }
    return (level3 + level2[level2.length - 1]);
}
return text;
}

document.getElementById('submitit').addEventListener('click', submit);
document.getElementById('resetit').addEventListener('click', restore_options);
document.getElementById('remClue').addEventListener('click', removeClue);
document.getElementById('addClue').addEventListener('click', addClue);
document.getElementById('interaction10').addEventListener('click', disableKey);
document.getElementById('interaction20').addEventListener('click', enableKey);