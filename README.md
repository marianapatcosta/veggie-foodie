# Veggie Foodie App

This app allows the user to keep a record of her/his favourite vegetarian meals, recipes and products, by listing, creating, editing and deleting them. Share functionality is also available for external HTTP images or source.  It was developed using Ionic, capacitor, Vue 3 with Composition API, Vuex and SQLite database.

### Available Scripts

In the project directory, you can run:

#### `yarn install`

Installs all the dependencies required to run and develop this application.


#### `yarn serve` or `ionic serve`

Runs the app in the development mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.


#### `yarn build` or `ionic build`

Builds the app for production for android devices, so the app can be run in the android emulator or device

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

#### `npx cap copy`
wraps the native app into the build ionic app

#### `npx cap run android`

#### `npx cap open android`
opens the build app in Android Studio

#### `npx cap open ios`
opens the build app in XCode

### build apk
in Android studio go to `Build -> Generate Signed Bundle / APK` and fill the form and follow the instructions. The .apk will be generate in `app\android\app\release\app-release.apk`

### debug device emulator in chrome
```chrome://inspect:device```
