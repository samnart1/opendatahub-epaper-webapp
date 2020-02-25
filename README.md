# edisplay-frontend
Frontend to manage edisplay-backend.
Has all CRUD operations implemented to manage Displays, Locations, Connections and Templates.
Fully created with [Vue.js](https://vuejs.org/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Project setup for development](#project-setup-for-development)
- [How to send and image to a display](#how-to-send-and-image-to-a-display)
- [Compiles and minifies for production](#compiles-and-minifies-for-production)
- [Licenses](#licenses)
- [Third party components](#third-party-components)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### Project setup for development
Clone this repository
```
git clone https://github.com/noi-techpark/e-ink-displays-webapp
```
Get all dependencies
```
yarn install
```
Set up the Backend if not already done.
Follow [README](https://github.com/noi-techpark/e-ink-displays-api) to setup the Backend.

And start the Frontend. It will run on [localhost](localhost:8080)

```
yarn serve
```
### How to send and image to a display
1) Set up the [API](https://github.com/noi-techpark/e-ink-displays-api) by following the README there
2) Set up a Physical display by following the README of the [backend](https://github.com/noi-techpark/e-ink-displays-backend)
3) Set the IP-Address of the machine where you run the
   [API](https://github.com/noi-techpark/e-ink-displays-api) in `.env` file in
   root directory. You can copy the defaults from `.env.example`. Note: If you
   are using Vue cli 3, only variables that start with VUE_APP_ will be loaded.
```
VUE_APP_API_URL=http://localhost:8081
```
4) Start the webapp
```
yarn serve
```
5) Create an image with the size 640*384 that you want to send to the display
6) Open a browser to open the webapp on localhost
7) Login with the credentials
```
user:user
password:pass
```
8) Click on Create
9) Create a template by giving it a name and uploading the image you created
10) Create a display by giving it a name and choosing the template you created before
11) Create a location by giving it a name
12) Create a connection between the display and the location and in the field network address put the IP-Address of the physical displat you created in step 2 like (it's important to put the protocol and the 80 port)
```
http://192.168.1.4:80
```
13) Click on Dashboard where you should see your created display
14) Click on send to send the image to the display or on clear to clear the screen
### Compiles and minifies for production
```
yarn build
```

### Licenses
The E-Display Backend is free software. It is licensed under GNU GENERAL
PUBLIC LICENSE Version 3 from 29 June 2007.
More info can be found [here](https://www.gnu.org/licenses/gpl-3.0.en.html)

### Third party components
No third party components used for now