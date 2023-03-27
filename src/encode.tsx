import React from "react";
import { createRoot } from "react-dom/client";

function submit() {
  var error = validateInputs();
  if (error == "") {
    const json_gen = generateJson();
    const blob_gen = new Blob([JSON.stringify(json_gen)], {
      type: "application/json",
    });
    const url_gen = URL.createObjectURL(blob_gen);
    chrome.downloads.download({
      url: url_gen,
    });
  } else {
    const status = document.getElementById("status");
    const p = document.createElement("p");
    p.textContent = "Error, missing form content: " + error + ".";
    p.setAttribute("style", "color:red;");
    status?.appendChild(p);
  }
}

function generateJson() {
  var obj: any = {};

  obj["name"] = (document.getElementById("huntName") as any).value;
  var description = (document.getElementById("huntDescription") as any).value;
  if (description != "") {
    obj["description"] = description;
  }
  obj["version"] = "0.9"; //change at each encoding iteration
  var author = (document.getElementById("huntAuthor") as any).value;
  if (author != "") {
    obj["author"] = author;
  }
  var background = (document.getElementById("huntBackground") as any).value;
  if (background != "") {
    obj["background"] = background;
  }
  var beginning = (document.getElementById("huntBeginning") as any).value;
  if (beginning != "") {
    obj["beginning"] = beginning;
  }
  var en = (document.getElementById("encryptYes") as any).checked;
  obj["encrypted"] = en;

  var clues = [];
  for (var i = 0; i < document.getElementsByTagName("tr").length - 1; i++) {
    var clue: any = {};
    clue["id"] = i;
    var url = (document.getElementById("clueURL" + i) as any).value;
    clue["url"] = encryptSoft(url, en);
    var clue_text = (document.getElementById("clueText" + i) as any).value;
    clue["text"] = encryptSoft(clue_text, en);
    var clue_image = (document.getElementById("clueImage" + i) as any).value;
    if (clue_image != "") {
      clue["image"] = encryptSoft(clue_image, en);
    }
    var clue_alt = (document.getElementById("clueAlt" + i) as any).value;
    if (clue_image != "" && clue_alt != "") {
      clue["alt"] = encryptSoft(clue_alt, en);
    }

    var interact_always = (document.getElementById("interaction1" + i) as any)
      .checked;
    var interact_submit = (document.getElementById("interaction2" + i) as any)
      .checked;

    if (interact_always) {
      clue["interact"] = "always";
    } else if (interact_submit) {
      clue["interact"] = "submit";
      var submit_key = (document.getElementById("clueKey" + i) as any).value;
      clue["key"] = encryptSoft(submit_key, en);
      var submit_prompt = (document.getElementById("cluePrompt" + i) as any)
        .value;
      clue["prompt"] = encryptSoft(submit_prompt, en);
    }
    clues.push(clue);
  }

  obj["clues"] = clues;
  return obj;
}

// Just checks for content, no URL validation
function validateInputs() {
  if ((document.getElementById("huntName") as any).value == "") {
    return "Hunt Name";
  }
  var rows = document.getElementsByTagName("tr");
  for (var i = 1; i < rows.length; i++) {
    var id = i - 1;
    var urlInput = (document.getElementById("clueURL" + id) as any).value;
    var clueInput = (document.getElementById("clueText" + id) as any).value;
    //var clueImage = document.getElementById("clueImage" + id).value;
    if (urlInput == "") {
      return "Clue " + id + " URL";
    }
    if (clueInput == "") {
      return "Clue " + id + " Clue Text";
    }
    var submitChecked = (document.getElementById("interaction2" + id) as any)
      .checked;
    var keyInput = (document.getElementById("clueKey" + id) as any).value;
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
    rows[rows.length - 1].remove();
  }
}

function addClue() {
  var rows = document.getElementsByTagName("tr");
  var table = document.getElementById("clues") as any;
  var new_row = table.insertRow(rows.length);
  generateRow(new_row, rows.length - 2);
}

function generateRow(row: any, id: number) {
  //generate cells for a row
  var idCell = row.insertCell(0);
  idCell.setAttribute("scope", "col");
  idCell.textContent = id;

  var urlCell = row.insertCell(1);
  urlCell.setAttribute("scope", "col");
  urlCell.appendChild(generateInput("clueURL" + id));

  var clueCell = row.insertCell(2);
  clueCell.setAttribute("scope", "col");
  clueCell.appendChild(generateInput("clueText" + id));

  var imageCell = row.insertCell(3);
  imageCell.setAttribute("scope", "col");
  imageCell.appendChild(generateInput("clueImage" + id));

  var altCell = row.insertCell(4);
  altCell.setAttribute("scope", "col");
  altCell.appendChild(generateInput("clueAlt" + id));

  var interactionCell = row.insertCell(5);
  interactionCell.setAttribute("scope", "col");
  interactionCell.appendChild(generateRadioDiv(1, id));
  interactionCell.appendChild(generateRadioDiv(2, id));

  var promptCell = row.insertCell(6);
  promptCell.setAttribute("scope", "col");
  promptCell.appendChild(generateInput("cluePrompt" + id));
  promptCell.getElementsByTagName("input")[0].disabled = true;

  var keyCell = row.insertCell(7);
  keyCell.setAttribute("scope", "col");
  keyCell.appendChild(generateInput("clueKey" + id));
  keyCell.getElementsByTagName("input")[0].disabled = true;
}

function generateRadioDiv(type: number, id: number) {
  var typeName = "Always";
  if (type == 2) {
    typeName = "Submit";
  }
  var div = document.createElement("div");
  div.setAttribute("class", "form-check");

  var radioInput = document.createElement("input");
  radioInput.setAttribute("class", "form-check-input");
  radioInput.setAttribute("type", "radio");
  radioInput.setAttribute("name", "interaction" + id);
  radioInput.setAttribute("id", "interaction" + type + "" + id);
  radioInput.setAttribute("value", typeName);
  if (type == 1) {
    radioInput.checked = true;
    radioInput.addEventListener("click", disableKey);
  } else {
    radioInput.addEventListener("click", enableKey);
  }

  var label = document.createElement("label");
  label.setAttribute("class", "form-check-label");
  label.setAttribute("for", "interaction" + type + "" + id);
  label.textContent = typeName;

  div.appendChild(radioInput);
  div.appendChild(label);
  return div;
}

function generateInput(id: string) {
  var input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("class", "form-control");
  input.setAttribute("id", id);
  return input;
}

function disableKey(this: any) {
  console.log(this.id);
  console.log(this.id.substring(12, this.id.length));
  var num = this.id.substring(12, this.id.length);
  var key = document.getElementById("clueKey" + num) as any;
  key.disabled = true;
  key.value = "";
  var prompt = document.getElementById("cluePrompt" + num) as any;
  prompt.disabled = true;
  prompt.value = "";
}

function enableKey(this: any) {
  console.log(this.id);
  console.log(this.id.substring(12, this.id.length));
  var num = this.id.substring(12, this.id.length);
  (document.getElementById("clueKey" + num) as any).disabled = false;
  (document.getElementById("cluePrompt" + num)! as any).disabled = false;
}

function encryptSoft(text: string, encrypted: boolean) {
  if (encrypted) {
    //version 0.9
    var level1 = btoa(text);
    var level2 = level1.split("");
    var level3 = "";
    for (var k = 0; k < level2.length - 1; k++) {
      level3 += level1.charAt(k) + Math.random().toString(36).charAt(2);
    }
    return level3 + level2[level2.length - 1];
  }
  return text;
}

document.getElementById("submitit")?.addEventListener("click", submit);
document.getElementById("resetit")?.addEventListener("click", restore_options);
document.getElementById("remClue")?.addEventListener("click", removeClue);
document.getElementById("addClue")?.addEventListener("click", addClue);
document.getElementById("interaction10")?.addEventListener("click", disableKey);
document.getElementById("interaction20")?.addEventListener("click", enableKey);

const Encode = () => {
  return (
    <>
      <head>
        <title>Hunt Generator</title>
        <link
          rel="canonical"
          href="https://getbootstrap.com/docs/4.5/examples/cover/"
        />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
          integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
          crossOrigin="anonymous"
        />
        <link href="assets/encoder.css" rel="stylesheet" />
      </head>
      <body className="text-center">
        <div className="container d-flex w-200 h-100 p-8 mx-auto flex-column">
          <main role="main" className="inner cover">
            <div className="card border-1 shadow my-">
              <h2 className="cover-heading" id="hunt-title">
                Hunt Generator Form
              </h2>
              <p></p>
              <form>
                <div className="container">
                  <div className="row">
                    <div className="col-md-8 center">
                      <h3>Hunt Info</h3>
                      <div className="form-group">
                        <label htmlFor="huntName">Scavenger Hunt Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="huntName"
                          placeholder="Enter Scavenger Hunt Name"
                        />
                        <br />
                        <label htmlFor="huntDescription">
                          Description (Optional)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="huntDescription"
                          placeholder="Enter Scavenger Hunt Description"
                        />
                        <br />
                        <label htmlFor="huntAuthor">Author (Optional)</label>
                        <input
                          type="text"
                          className="form-control"
                          id="huntAuthor"
                          placeholder="Enter Your Name"
                        />
                        <br />
                        <label htmlFor="huntBackground">
                          Clue Background Image (Optional)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="huntBackground"
                          placeholder="Enter an image URL"
                        />
                        <br />
                        <label htmlFor="huntBeginning">
                          Hunt Beginning Prompt (Optional)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="huntBeginning"
                          placeholder="Enter a starting prompt"
                        />
                        <br />
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="encryptYes"
                            id="encryptYes"
                            value="yes"
                            checked
                          />
                          <label
                            className="form-check-label"
                            htmlFor="encryptYes"
                          >
                            Enable clue encryption
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-pad">
                  <div className="row">
                    <div className="col-12 center">
                      <div className="form-group">
                        <h3>Clues</h3>
                        <table className="table-dark" id="clues">
                          <thead>
                            <tr>
                              <th scope="col">ID</th>
                              <th scope="col">URL</th>
                              <th scope="col">Clue (Text)</th>
                              <th scope="col">Image (Optional)</th>
                              <th scope="col">Alt Text (Optional)</th>
                              <th scope="col">Interaction</th>
                              <th scope="col">Prompt (Optional)</th>
                              <th scope="col">Key</th>
                            </tr>
                          </thead>
                          <tr>
                            <td scope="col">0</td>
                            <td scope="col">
                              <input
                                type="text"
                                className="form-control"
                                id="clueURL0"
                              />
                            </td>
                            <td scope="col">
                              <input
                                type="text"
                                className="form-control"
                                id="clueText0"
                              />
                            </td>
                            <td scope="col">
                              <input
                                type="text"
                                className="form-control"
                                id="clueImage0"
                              />
                            </td>
                            <td scope="col">
                              <input
                                type="text"
                                className="form-control"
                                id="clueAlt0"
                              />
                            </td>
                            <td scope="col">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="interaction0"
                                  id="interaction10"
                                  value="Always"
                                  checked
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="interaction10"
                                >
                                  Always
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="interaction0"
                                  id="interaction20"
                                  value="Submit"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="interaction20"
                                >
                                  Submit
                                </label>
                              </div>
                            </td>
                            <td scope="col">
                              <input
                                type="text"
                                className="form-control"
                                id="cluePrompt0"
                                disabled
                              />
                            </td>
                            <td scope="col">
                              <input
                                type="text"
                                className="form-control"
                                id="clueKey0"
                                disabled
                              />
                            </td>
                          </tr>
                        </table>
                        <br />
                        <div className="form-group">
                          <input type="button" id="addClue" value="Add Clue" />
                          <input
                            type="button"
                            id="remClue"
                            value="Remove Clue"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <input type="button" id="submitit" value="Submit" />
                  <input type="button" id="resetit" value="Reset" />
                </div>
              </form>
              <div className="row">
                <div className="col-12 center">
                  <div className="error" id="status"></div>
                </div>
              </div>
            </div>
          </main>

          <footer className="mastfoot mt-auto">
            <div className="inner">
              <p>
                <a href="https://github.com/TylerJang27/Scav_Hunt_Extension">
                  Scavenger Hunt Extension
                </a>
                <br />
                Cover template for{" "}
                <a href="https://getbootstrap.com/">Bootstrap</a>, by{" "}
                <a href="https://twitter.com/mdo">@mdo</a>.
                <br />
                Photo by{" "}
                <a href="https://unsplash.com/photos/J_xAScfz3EE">Anand</a>.
              </p>
            </div>
          </footer>
        </div>
        <script src="encode.js"></script>
      </body>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Encode />
  </React.StrictMode>
);
