import { HuntConfig } from "src/types/hunt_config";
import { DEFAULT_BACKGROUND } from "../utils/parse";

console.log("Using mocked chrome library");

/**
 * These are incomplete mocks of the chrome library, used for local development.
 * Override the returned values as appropriate in order to suit development needs.
 * 
 * TODO: Read in provided values from a locally untracked json/data file, otherwise use defaults.
 */

const storageGetter = (items: string | string[], callback: Function) => {
    const defaultHuntConfig: HuntConfig = {
        name: "Default Hunt",
        description: "Default Hunt for Mocked Development",
        author: "Author",
        version: "1.0",
        encrypted: false,
        background: DEFAULT_BACKGROUND,
        options: {
          silent: false
        },
        beginning: "The beginning clue",
        clues: [
            {
                id: 1,
                url: "google.com",
                text: "The first of two clues",
            },
            {
                id: 2,
                url: "bing.com",
                text: "The second of two clues",
                interactive: {
                    prompt: "Enter 'test'",
                    key: "test",
                },
            },
        ]
    };

    const defaultCurrentProgress = 1;

    const defaultMaxProgress = 2;

    const defaultReturnValues = {
        huntConfig: defaultHuntConfig,
        currentProgress: defaultCurrentProgress,
        maxProgress: defaultMaxProgress,
    };

    const ret: any = {};
    if (typeof items === "string") {
        let k: keyof typeof defaultReturnValues;
        for (k in defaultReturnValues) {
            if (k == items) {
                ret[k] = defaultReturnValues[k];
                break;
            }
        }
    } else {
        let k: keyof typeof defaultReturnValues;
        for (k in defaultReturnValues) {
            if (items.includes(k)) {
                ret[k] = defaultReturnValues[k];
            }
        }
    }
    console.log("Invoking getter callback with items", ret);
    callback(ret);
};

const storageSetter = (items: { [key: string]: any }, callback: Function) => {
    console.log("Setting items", items);
    console.log("Executing setter callback");
    callback();
};

const addMessageListener = (callback: Function) => {console.log("Registered on message listener callback", callback);};

const addClickedListener = (callback: Function) => {console.log("Registered on click listener callback", callback);};

const tabs = {create: (obj: chrome.tabs.CreateProperties) => {
    console.log("Creating tab", obj);
}};

const storage = {local: {get: storageGetter, set: storageSetter}};

const runtime = {onMessage: {addListener: addMessageListener}, sendMessage: (msg: any)=>{console.log("Sending message", msg)}, lastError: ()=>{console.log("Returning no error"); return undefined;}, getURL: (url: string)=>{console.log("Getting URL", url); return url;}};

const action = {onClicked: {addListener: addClickedListener}, setBadgetText: (contents: chrome.action.BadgeTextDetails) => {console.log("Setting badge text", contents.text)}};

export const provider = {tabs, storage, runtime, action}