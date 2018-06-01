## TODU

An awesome, hackable to-do list.

![Screenshot](https://user-images.githubusercontent.com/5101076/31648366-ddd86026-b33f-11e7-8a20-35d857514e71.png)

[Download the latest version here](https://github.com/CyanSalt/todu/releases/latest)

### Manage your to-do

* Type your to-do in editor line, then press `Enter`.
* Every day when you open this app, items that undone will be move to today's list.
* Add your to-do of tomorrow in the same way.
* **Drag and drop** your to-do item between today's list and tomorrow.
* Click the date on the right and look up history.
* Add time in today's list and set an alarm clock *5 min* before it happens.

### Use different sheet

* Click super button with infinity icon to toggle the sheet switcher.
* Add, remove sheet, or change the sheet's title if you like.
* Set it to Cycle mode by clicking the button next to the head 'Today'.

### Export your data

* All of user data are placed in the folder `storage` of the app.
* Edit the `sheets.json` to change the sheets' information.
* Copy the content of `todo.json` or `todo-*.json` to export your data.

### HACK IT!

* The messages in this app is written in English, and will be shown as the language set in your system by default. however, you can use its internal translations or translate it yourself.
  * Create file `translation.json` in the `storage` directory.
  * Type your configure like `{"@use": "en-US"}`, or customize the translation file yourself (See [All translatable texts](https://github.com/CyanSalt/todu/blob/master/src/resources/default/translation.json)).

* This app is built with [Electron](https://electronjs.org/) and [VueJS](https://vuejs.org/index.html). If you are familiar with eithor of those, you can add `custom.js` to write your own code whenever the app launched. See the demo at `resources/default/custom.js`

* As well as script, you can also add `custom.css` to write your stylesheets.

* For getting the document layout of the app's page, you can press `Control/Cmd+Shift+I` to open the devtools panel, just like you do it in Chrome.

### License

MIT
