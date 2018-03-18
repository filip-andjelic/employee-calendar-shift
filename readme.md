# Employee Calendar Web App - Client codebase

This web app is meant to simulate real-time calendar user interactions. It supports 3 main entry types: employees, job shifts and job positions.
User can create, edit or delete any of these entries. Calendar also supports filtering data using these entries. 

Employee entry consists of `name, position, avatar` and optional `shift/dates` properties.
Shift entry has `name, color` and optional `employees, positions, description` properties.
Position entry has only `name, color` and optional `employees` properties.

Techs, libs and methodologies used in this app: 

      - React 
      - Redux
      - SASS
      - NodeJs
      - Yarn
      - Webpack
      - Babel
      - FontAwesome
      
Project is yet to be finished with Mocha tests, better documentation and more features. Also, due to limited time, some bugs are possible here and there.
Considering Webpack configuration, at the moment SASS is compiled to CSS and applied via `style-loader`, which isn't really the best way to do it. 
Next iterations should apply `PostCSS` loader to auto-prefix cross-browser CSS properties. As well as `ExtractText` Webpack plugin to isolate compiled SASS (.css) file, 
instead of inserting it via style attribute. If any suggestion comes to your mind, feel free to submit it to - `filip.andjelic.private@gmail.com`.

## - How to start project and serve the app

After downloading project files, extract them to the desired location. Before you do anything, make sure you have `NodeJS` installed on you device. 
It would be good to have `Yarn` package manager installed also, because of `yarn.lock` file which will make sure that exact versions of dependencies are installed.
That's really important because we can't guarantee that this app will bundle itself and work well with other versions.  

If you haven't updated `NodeJS` in some time, it may be good to do so. If you ride your device on Mac/Linux, run command in console - `sudo n stable`, and you are ready to go. 
Alas, your PC will need to go through `NodeJS` .msi installation again in order to update. 
If you haven't installed NodeJS before, please download and install appropriate version from this page - `https://nodejs.org/en/download/`. Also, make sure that `node` command is global, accessible from any part of device storage.

To install `Yarn` please follow instruction on this link - `https://yarnpkg.com/en/docs/install`;

Now, direct your console/command prompt to folder where you extracted project. All you need to do is run following command - `yarn install`. Now, all Node packages are put in place, and magic can begin!

In order to serve files on Node simulated server, just run `yarn run fiesta` command in same folder where you ran node command before. 

Our app will be served on port `8080`, so hit `http://localhost:8080/` in your favorite browser.