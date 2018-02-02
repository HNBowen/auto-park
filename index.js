var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome')
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var $ = require('jquery');

var config = require('./.config');

//configure the mailgun transporter for nodemailer
var auth = {
  auth: {
    api_key: "key-f9608270c43a7b4c0dcf7b2a5ce77179",
    domain: "autopark.mailgun.com"
  }
}

var mailgun = nodemailer.createTransport(mg(auth));

//more nodemail set-up
const emailConfirmation = {
  from: 'park_bot@autopark.mailgun.com', // sender address
  to: config.email, // list of receivers
  subject: config.property + ' visitor parking pass', // Subject line
  html: '<p>Attached is confirmation of your visitor parking permit.</p>'// plain text body
};

//helper function to find value from drop downs
function findVal(options, selection) {
    var val;
    for(var i = 0; i < options.length; i++) {
       if(options[i].text === selection) {
           val = options[i].value;
        }
    }
    console.log(val);
    return val;
}

function findElementById(id) {
  return browser.findElements(webdriver.By.css('[id='+id+']')).then(function(result) {
    return result[0];
  })
}

function selectProperty() {
  let $parkedAtCommunityDropDown = $("#parkedAtCommunityDropDown");
  let options = $parkedAtCommunityDropDown.find("option");
  let value = findVal(options, config.property)

  $parkedAtCommunityDropDown.val(value);
  $parkedAtCommunityDropDown.trigger("change");
}

function selectFromDropDown(selector, desiredValue) {
  let $dropDown = $(selector);
  let options = $dropDown.find("option");
  let value = findVal(options, desiredValue);

  $dropDown.val(value);
  $dropDown.trigger("change");
}

//helper function to fill input fields
function fillInput(selector, value) {
  $(selector).val(value);
}
//initialize the web driver browser
var browser = new webdriver.Builder()
                           .withCapabilities(webdriver.Capabilities.chrome())
                           .build();

//helper function to attach an array of scripts and the config to the browser window
//for later execution 
async function attachScripts(config, scripts) {

  scripts.forEach((script) => {
    console.log("attaching script: ", script.name);
  })
  await browser.executeScript(function(config, scripts) {
    console.log("attaching config: ", config);
    console.log("attaching scripts: ", scripts)
    window.config = config;

    for (var i = 0; i < scripts.length; i++) {
      var tag = document.createElement("script");
      tag.innerHTML = scripts[i];
      document.head.appendChild(tag);
    }

    console.log()
  }, config, scripts)
}



const run = async () => {
  //navigate to parkspeedy.com
  await browser.get("http://www.parkspeedy.com");
  //find button and click
  await browser.findElement(webdriver.By.id("createNewPassButton")).click();

  //attach scripts for selecting the property from the dropdown
  await attachScripts(config, [findVal, selectFromDropDown]);
  //select property
  await browser.executeScript(() => {
    selectFromDropDown("#parkedAtCommunityDropDown", config.property);
  })

  //attach the fillInput script
  await attachScripts(config, [fillInput]);

  //fill out unit and phone number inputs
  await browser.executeScript(() => {
    fillInput("#guestVisitingUnitNumber", config.visitingUnitNumber)
    fillInput("#guestVisitingUnitPhoneNumber", config.visitingPhoneNumber)
  })

  //click next button to proceed
  await browser.findElement(webdriver.By.id("createPermitLinkStep1")).click();

  //attach needed scripts again
  await attachScripts(config, [fillInput, findVal, selectFromDropDown]);

  //fill in values and agree to T's & C's
  await browser.executeScript(() => {
    selectFromDropDown("#vehicleMakeModelDropDown", config.carMake);
    selectFromDropDown("#vehicleColorDropDown", config.carColor);
    fillInput("#licensePlateNumber", config.licensePlateNumber);

    //accept t's and c's
    $("#termsAndConditionsAgreedSwitch").bootstrapSwitch("toggleState");
    $("#createPermitLink").click();
  })

  //take a screenshot and email to self
  let screenshot = await browser.takeScreenshot();
  let screenshotBase64 = screenshot.replace(/^data:image\/png;base64,/,"");
  emailConfirmation.attachments = [{
    filename: 'confirmation.png',
    content: screenshotBase64,
    encoding: 'base64'
  }];
  mailgun.sendMail(emailConfirmation, (err, info) => {
    if (err) {
      console.log("ERROR SENDING MESSAGE: ", err)
      browser.quit();
    } else {
      console.log("MESSAGE SENT: ",info)
      browser.quit(); 
    }
  })


} 

try {
  run();
} catch(err) {
  console.log("error running registration script")
  console.log("error name: ", err.name);
  console.log("error details: ", err.message);

  mailgun.sendMail({
      from: 'park_bot@autopark.mailgun.com',
      to: config.email,
      subject: "Error report :(",
      html: '<p> An error was encountered during the registration process: <br/> ' + err + '</p>'
    },(error, info) => {
      if (error) {
        console.log("error sending error report, something must really be wrong: ", error)
      } else {
        console.log("error report sent: ", info)
    }
  })
}


//wait for next page to load, then
  //find the property drop down #parkedAtCommunityDropDown
  //find the option value for desired property
  //set the selected dropdown value with .val
  //trigger "change" event

//wait for the next page to load, then
  //find the visiting unit entry #guestVisitingUnitNumber
  //find the visitin unit phone number entry #guestVisitingUnitPhoneNumber
  //set each inputs value with .val()
  //find the next button #createPermitLinkStep1

//wait for next page to load, then
  //find the dropdown and input components:
    //#vehicleMakeModelDropDown
    //#vehicleColorDropDown
    //#licensePlatNumber
    //#termsAndConditionsAgreedSwitch
  //find values for drop downs with helper function, set and trigger change
  //set license plate value to desired value
  //trigger terms&conditions switch with .bootstrapSwitch("toggleState")
  //click the #createPermitLink button

//wait for the next page to load, then
  //use selenium to take a screenshot
  //use nodemailer to send the screenshot to desired email
