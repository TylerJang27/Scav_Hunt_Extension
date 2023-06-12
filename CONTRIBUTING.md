# Contribution Guidelines

Thank you for contributing to the Scavenger Hunt Chrome Extension! See development and contribution guidelines below.

- [Overview](#overview)
- [Architecture](#architecture)
- [Development](#development)
- [Tooling and Testing](#tooling-and-testing)

## Overview
TODO, notes on mission and approach

## Architecture
The [manifest.json](public/manifest.json) governs how a Chrome extension is configured and run, including specifying permissions and configuring assets. When a user installs the extension, they will activate a hunt, saving it to their local Chrome storage, and be prompted to begin.

With our current configuration, whenever a user loads a webpage, the [content script](src/content_script.tsx) will run and evaluate their current URL against the activated hunt's clues. Because there are [limitations](https://developer.chrome.com/docs/extensions/mv3/content_scripts/) around a content script's scope, a message is then sent to a background [service worker](https://developer.chrome.com/docs/extensions/mv3/service_workers/events/), which alerts the user if there is a clue match.

Every other entrypoint in the extension is a static React page, showing relevant information about the active clue, or providing hunt configuration capabilities.

## Development

There are 3 main ways to build and run the Chrome Extension.

### Build
To build and run as end users will experience it, simply run:

```
npm install
npm run build
```

and load the Chrome extension "Load Unpacked" from the `dist/` directory.

### Watch
To build and run the Chrome Extension, with some additional tooling for development, run:

```
npm install
npm run watch
```

This provides 2 main differences from the [Build](#build) setup:
1. npm will watch your src directory for changes, and automatically rebuild when you save. Note that you will have to re-"Load Unpacked" in order for these changes to propagate.
2. Additional logging. By default, Scavenger Hunt hides info and debug logs from users so as not to spoil too much information. During development/watch mode, these logs are displayed in your browser console.

### Static
To build individual changes and keep track of your changes (such as for UI development), run:

```
npm install
npm run static

# In another terminal
npm run serve
```

This provides some additional development tooling:
1. Verbose logs (see [Watch](#watch)).
2. By navigating to http://localhost:3000, you will be able to view each of the pages for the extension as a static resource. Your changes are watched and rebuilt when you save, so you'll only have to refresh the page to see them appear.
3. In order to serve this page, all relevant Chrome API methods are mocked to serve default data. You can fine tune this data in [mock.ts](./src/providers/mock.ts) as appropriate.

## Tooling and Testing
TODO