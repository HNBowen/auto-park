# auto-park
WebDriver script to automate registering for a parking space

## Installation
Clone the repo and run `npm install` to install dependencies.
Create a .config file in the root directory. This file is gitignored as it will contain an email and password. Export the following constants (all strings):
  -email (the email to send the confirmation to)
  -password (password for that email address)
  -property (the name of the property where you will be parking. Title case is used (e.g. The Aparement Complex))
  -visitingPhoneNumber (number of the person you are visiting)
  -visitingUnitNumber (number of the unit you are visiting)
  -carMake (make of your car, title case here too (e.g. "Honda"))
  -carColor (color, title case here too (e.g. "Blue"))
  -licensePlateNumber (the plate number)

## Use
From the terminal, run the command `node index.js` from the root of the director
