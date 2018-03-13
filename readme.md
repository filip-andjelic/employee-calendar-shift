# Phone Digit - Word converter / Client codebase

This web app has one main problem to solve - converting digits into corresponding words in the style of T9.
It features: 
- phone-like digit buttons grid 
- numeric input component
- list of converted string
- history of input values toggling list
- toggling button for real-words converter option

Techs, libs and methodologies used in this app: 

      - React 
      - Redux
      - SASS
      - NodeJs
      - Yarn
      - Webpack
      - Babel
      - Socket.IO
      - Mocha
      - FontAwesome
      
Project is yet to be finished with Mocha tests, documentation and more features. 
Considering Webpack configuration, at the moment SASS is compiled to CSS and applied via `style-loader`, which isn't really the best way to do it. Next iterations should apply `PostCSS` loader to autoprefix cross-browser CSS properties. As well as `ExtractText` Webpack plugin to isolate compiled SASS (.css) file, instead of inserting it via style attribute. 
If any suggestion comes to your mind, feel free to submit it to -  `filip.andjelic.private@gmail.com`.

## - How to start project and serve the app

After downloading project files, extract them on desired location. Before you do anything, make sure you have NodeJS installed on you device. It would be good to have `Yarn` package manager installed also, because of `yarn.lock` file which will make sure that exact versions of dependencies are installed.
That's really important because we can't guarantee that this app will bundle itself and work well with other versions.  

If you haven't updated NodeJS in some time, it may be good to do so. If you ride your device on Mac/Linux, run command in console - `sudo n stable`, and you are ready to go. Alas, your PC will need to go through NodeJS .msi installation again in order to update. 
If you haven't installed NodeJS before, please download and install appropriate version from this page - `https://nodejs.org/en/download/`. Also, make sure that `node` command is global, accessible from any part of device storage.

To install `Yarn` please follow instruction on this link - `https://yarnpkg.com/en/docs/install`;

Now, direct your console/command prompt to folder where you extracted project. All you need to do is run following command - `yarn install`. Now, all Node packages are put in place, and magic can begin!

In order to serve files on Node simulated server, just run `yarn run fiesta` command in same folder where you ran node command before. If you take a look at `package.json` file, you'll see some scripts named there. We'll leave them be for now, they'll be user in near future. 

Our app will be served on port `8080`, so hit `http://localhost:8080/` in your favorite browser.

`Make sure you run server project as well, in order not to get your browser's console running all red.`