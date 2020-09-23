# Scav_Hunt_Extension

Creator: Tyler Jang
Last Updated: 9/22/20
Status: Beta

## Overview

A simple Chrome Extension to create a Scavenger Hunt based on [encoded json](res/hunt.json). Only use Chrome Extensions and JSON created by those you trust.

Upon installing the Chrome Extension, right click on the Extension and open up Options. There, you will have the option to change the JSON source for the scavenger hunt. You can specify the sample JSON, JSON from a URL ([example](https://raw.githubusercontent.com/TylerJang27/Scav_Hunt_Extension/master/res/hunt.json)), or upload JSON directly (*WORK IN PROGRESS*).

For feedback, please see this [survey](https://duke.qualtrics.com/jfe/form/SV_3RgYWhVtf0fHZpr)

*TODO: INCLUDE SCREENSHOTS*

In order to make your own scavenger hunt:
 - Fork off of this branch,
 - Edit [res/hunt.json](res/hunt.json) to include your clues and URLs, in accordance with the guidelines below,
 - Add any additional HTML or image files in `res/`,
 - Change the [popup.html](popup.html) and [popup.css](popup.css) files as you wish, and
 - Have fun!

## JSON Guiddlines
[1] denotes required, [2=_] denotes default value unless specified

See the sample files for examples.

### Top Level

The following top-level Key-Value Pairs should be included in the [json file]](res/hunt.json).
 - name (String)
    - The name of the scavenger hunt
 - description (String)
    - A description of the hunt
 - version (String)
    - Version of the scavenger hunt file
 - author (String)
    - Author of the scavenger hunt
 - encypted (Boolean) [2=false]
    - Whether or not the values in the json are encrypted (see below)
 - clues (List of Objects) [1]
    - The clues to be found along the trail

### Clues

The following key-value pairs are expected as part of clue objects.
 - id (Integer) [1]
    - The step of the clue. 0 denotes the starting point
 - url (String/Regex) [1]
    - The URL Regex where the clue should be found
 - text (String) [1 or html]
    - The text of the clue leading to the next step. Favored over HTML
 - html (String) [1 or text]
    - An HTML file containing a clue. If specified and no text, interact will default to "always"
 - image (String)
    - A path to an image (local or on web) to be displayed with the clue if text is present
 - alt (String)
    - Alternative text to accompany an image if present
 - interact (String) [2=always]
    - always: The clue will always be viewable as long as the user is at the correct URL
    - submit: The clue will require a user-submitted key in order to unlock
    - clickable: *WORK IN PROGRESS*
 - key (String) [1 if interact]
    - If interact is submit, a key to match (ignoring case) to view the next clue for a specified URL

### Encryption

Low-level base64 encryption is made available in order to prevent a curious user from poking the json. Note that a motivated user could still determine the json's contents. To generate the expected json, see *[WORK IN PROGRESS]()*. You should indicate in the json whether or not encryption is enabled at the encryption key.

### References

The following resources were used to create this extension. Thank You :)
 - [kunal-mandalia's Let's Write Code](https://github.com/shama/letswritecode/tree/master/how-to-make-chrome-extensions)
 - [Javascript fetch tutorial](https://www.javascripttutorial.net/javascript-fetch-api/#:~:text=The%20fetch()%20method%20returns,%2F%2F%20handle%20the%20error%20%7D)
 - [Javascript JSON fetch](https://daveceddia.com/unexpected-token-in-json-at-position-0/)
 - [Alert box styling](https://stackoverflow.com/questions/7853130/how-to-change-the-style-of-alert-box)
 - [Creating Options](https://developer.chrome.com/extensions/options)
 - [Downloading with extensions](https://stackoverflow.com/questions/4845215/making-a-chrome-extension-download-a-file/24162238)
 - [Error callbacks](https://stackoverflow.com/questions/51600832/how-to-make-chrome-downloads-api-wait-until-a-download-has-ended)