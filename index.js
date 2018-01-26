var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome')
var nodemailer = require('nodemailer');
var $ = require('jquery');

var config = require('./.config');

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

function sayHi() {
  console.log("hi")
}

//initialize the web driver browser
var browser = new webdriver.Builder()
                           .withCapabilities(webdriver.Capabilities.chrome())
                           .build();

// //navigate to parkspeedy.com
// browser.get("http://www.parkspeedy.com")
// //find the #createNewPassButton and click
// browser.wait(findElementById("createNewPassButton"), 100000).then(() => {
//   browser.findElement(webdriver.By.id("createNewPassButton")).click();
//   browser.wait(findElementById("parkedAtCommunityDropDown"), 100000000).then(() => {
//     browser.executeScript(async (selectProperty, findVal, config) => {
//       window.config = config;
//       //append functions as scripts
//       var selectPropertyScript = document.createElement("script")
//       var findValScript = document.createElement("script")

//       selectPropertyScript.innerHTML = selectProperty;
//       findValScript.innerHTML = findVal;

//       await document.head.appendChild(selectPropertyScript);
//       await document.head.appendChild(findValScript);

//       selectProperty();
//     }, selectProperty, findVal, config)
//   })
// })

//helper function to attach an array of scripts and the config to the browser window
//for later execution 
function attachScripts(config, scripts) {

  browser.executeScript(function {
    window.config = config;

    scripts.forEach(function(script) {
      var tag = document.createElement("script");
      tag.innerHTML = script;
      document.head.appendChild(tag);
    })
  }.call(null, config, ...scripts))
}

const run = async () => {
  await browser.get("http://www.parkspeedy.com");
  await browser.findElement(webdriver.By.id("createNewPassButton")).click();

  await attachScripts(config, [findVal, selectProperty]);

  //attach config, find val, and selectProperty to the browser so we can execute them later
  // await browser.executeScript((selectProperty, findVal, config) => {
  //   window.config = config;
  //   //append functions as scripts
  //   var selectPropertyScript = document.createElement("script")
  //   var findValScript = document.createElement("script")

  //   selectPropertyScript.innerHTML = selectProperty;
  //   findValScript.innerHTML = findVal;

  //   document.head.appendChild(selectPropertyScript);
  //   document.head.appendChild(findValScript);
  // }, selectProperty, findVal, config)

  //select property specified in config from the drop down
  await browser.executeScript(() => {
    selectProperty();
  })


} 

run();


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
