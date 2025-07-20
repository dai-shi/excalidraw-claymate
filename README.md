# excalidraw-claymate

<table><tr><td>
<img alt="excalidraw-claymate" src="https://user-images.githubusercontent.com/490574/84717128-eedfbf80-afaf-11ea-82e4-d4c601136b9a.gif" width="50%" />
</td></tr></table>

## What is this

This is a tool based on
[Excalidraw](https://excalidraw.com)
to create stop motion animations and slides.

## How to use it

If you are already familiar with Excalidraw,
just visit <https://dai-shi.github.io/excalidraw-claymate>
and you can do the same.

The main difference is in the footer, where you can:

- add/edit scenes
- reorder scenes
- export the scenes as either:
  - an animated GIF
  - an HTML slide show
    - with animation (configurable order & speed)
    - with video recording (See [#46](https://github.com/dai-shi/excalidraw-claymate/pull/46) for instructions)

Notes:

- The scene size is limited to the size of the first scene.
- Scenes are automatically saved to local storage

## Tweets

- [The first trial version](https://twitter.com/dai_shi/status/1267491837897367553)
- [Embedded in the app](https://twitter.com/dai_shi/status/1268221326822535168)
- [Example with grid](https://twitter.com/dai_shi/status/1275941775878713344)
- [New dev with excalidraw package](https://twitter.com/dai_shi/status/1338500086343430146)
- [Export to HTML](https://twitter.com/dai_shi/status/1388675104888934400)
- [Integrating excalidraw-animate](https://twitter.com/dai_shi/status/1403381850907693057)
- [Configurable excalidraw-animate speed](https://twitter.com/dai_shi/status/1407360080568221698)
- [excalidraw-animate pointer image](https://twitter.com/dai_shi/status/1412055528977489922)
- [animation preview](https://twitter.com/dai_shi/status/1417821074998272004)
- [Importing files](https://twitter.com/dai_shi/status/1435569857408475137)
- [Image support](https://twitter.com/dai_shi/status/1496088631462621187)
- [Excalidraw v0.12.0](https://twitter.com/dai_shi/status/1561965847635427328)
- [Excalidraw v0.15.2](https://twitter.com/dai_shi/status/1654468768813424640)

## Other projects with Excalidraw

- [Excalidraw Animate](https://github.com/dai-shi/excalidraw-animate)
- [Excalidraw Gallery](https://github.com/dai-shi/excalidraw-gallery)
- [Excalidraw Layers](https://github.com/dai-shi/excalidraw-layers)

## Development

### Setup

```bash
npm install
npm start
```

### Testing

The project uses Playwright for end-to-end testing:

```bash
# Install browsers
npx playwright install

# Run e2e tests
npm run e2e

# Run e2e tests with UI
npm run e2e:ui
```

### Running Tests

```bash
# Run all tests including linting, type checking, and unit tests
npm test

# Run individual test suites
npm run test:lint
npm run test:type
npm run test:app
npm run e2e
```
