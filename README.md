# auto-park
WebDriver script to automate registering for a parking space.

The script uses Selenium's WebDriver to drive a chrome browser. jQuery is used to fill in various fields and advance through the registration process. A screenshot of the parking pass 
is taken at the end of registration, and email to the email specified in the .config file. 

Nodemailer with a MailGun transport is used to send the confirmation email. Set up your own (free) MailGun service here: https://signup.mailgun.com/new/signup

## Installation
Clone the repo and run `npm install` to install dependencies.
Create a .config file in the root directory. This file is gitignored as it will contain an email and password. Export the following constants (all strings):
  - email (the email to send the confirmation to)
  - password (password for that email address)
  - property (the name of the property where you will be parking. Title case is used (e.g. The Aparement Complex))
  - visitingPhoneNumber (number of the person you are visiting)
  - visitingUnitNumber (number of the unit you are visiting)
  - carMake (make of your car, title case here too (e.g. "Honda"))
  - carColor (color, title case here too (e.g. "Blue"))
  - licensePlateNumber (the plate number)
  - mailGunApiKey (api key for a mailgun service)

## Use
From the terminal, run the command `npm start` from the root of the directory. 

## Deployment (Heroku)
The script can be deployed to a remote server and hooked up to a job scheduler so as to
execute autonomously. 

When deloying on Heroku, two buildpacks are required to run a headless chrome browser 
with Selenium on the Heroku slug:

  - https://github.com/heroku/heroku-buildpack-google-chrome
    A headless Google chrome buildpack for Heroku slugs.
  - https://github.com/heroku/heroku-buildpack-chromedriver
    Selenium chromedriver buildpack 

Configuring the browser driver for deployment requires a different approach than running 
locally. Specifically, the path to the Chrome binary needs to be explicity set. The Chrome buildpack makes the Chrome binary path available as an environment variable:

`const initBrowser = async function () {
  //create a new builder object with new webdriver.Builder()
  var builder = new webdriver.Builder();
  //set the default to chrome
  builder.forBrowser('chrome');
  //create config options for chrome with new chrome.Options()
  var chromeOptions = new chrome.Options();
  //set the binary for the chrome options with chromeOptions.setBinary(/path/to/bin)
  chromeOptions.setChromeBinaryPath(process.env.GOOGLE_CHROME_SHIM);
  //set these options on the builder with builder.setChromeOptions(chromeOptions)
  builder.setChromeOptions(chromeOptions);
  //create the driver with builder.build()
  browser = await builder.build();
}`

Because the script depends on a .config file that is not checked into version control, when you deploy to heroku you will need to remove .config from .gitignore. Rather than doing this on the master branch, it is advisable to create a dedicated heroku branch and make the modification there. This branch (e.g. `myheroku`) can then be deployed to Heroku like so:

`git push heroku myheroku:master`

## Automation (Heroku)

We can use Heroku's custom clock process to automate the script's execution. In the Procfile in the root directory, we specify a worker process and a clock process. The worker process is of course index.js, while the clock process runs clock.js, a npm CronJob that runs the script every 12 hours at 9am and 9pm CST. 

More information about setting up this automation step can be found here:
  
  - https://devcenter.heroku.com/articles/scheduled-jobs-custom-clock-processes (Heroku docs)
  - https://blog.andyjiang.com/intermediate-cron-jobs-with-heroku (Short turotial for set up with npm CronJob by Andy Jiang.)



