# Veggie Foodie App

Cross-platform mobile app that allows to keep a record of favorite vegetarian meals, recipes and products, by listing, creating, editing and deleting them. The user can upload or take photos of each item, and order the listed items by different fields, in ascending and descending way. All data handling is managed in the storage device. The items can also be shared. Includes optional login with Google OAuth It was developed using Ionic, Capacitor, Vue 3 with Composition API, Vuex and SQLite database.
![veggie-foodie-overview](https://user-images.githubusercontent.com/43031902/131841618-e5cb64eb-88a5-43e0-b7e1-ff8f13520780.png)


The following environnement variable must be configured:
- VUE_APP_GEOLOCATION_KEY
- VUE_APP_GOOGLE_API_KEY
- VUE_APP_OAUTH_CLIENT_ID
- VUE_APP_OAUTH_CLIENT_ID_WEB

### Available Scripts

In the project directory, you can run:

#### `yarn install`

Installs all the dependencies required to run and develop this application.

Be sure that the _.env.example_ file is renamed to _.env_ and all the values for the variables declared in this file are properly fulfilled with your data.

#### `yarn serve` or `ionic serve`

Runs the app in the development mode.\
Open [http://localhost:8081](http://localhost:8081) to view it in the browser.


#### `yarn build` or `ionic build`

Builds the app for production for android devices, so the app can be run in the android emulator or device

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

#### `npx cap copy`
wraps the native app into the build ionic app. should be run every time the app is built.

#### `npx cap run android`

#### `npx cap open android`
opens the build app in Android Studio

#### `npx cap open ios`
opens the build app in X-Code

### build apk
in Android studio go to `Build -> Generate Signed Bundle / APK` and fill the form and follow the instructions. The .apk will be generate in `app\android\app\release\app-release.apk`

### debug device emulator in chrome
```chrome://inspect:device```
