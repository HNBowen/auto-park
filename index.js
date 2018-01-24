var webdriver = require('selenium-webdriver');
var nodemailer = require('nodemailer');
var config = require('.config');

//helper function to find value from drop downs
function findVal(options, selection) {
    var val;
    for(var i = 0; i < options.length; i++) {
       if(options[i].text === selection) {
           val = options[i].value;
        }
    }
    return val;
}

//initialize the web driver brower
var browser = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();

//navigate to parkspeedy.com
browser.get("www.parkspeedy.com");

//find the #createNewPassButton
//click

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
