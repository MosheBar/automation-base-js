# README #

Welcome to Automation Base js 

## What is this repository for? ##

* Base framework for testing on web browser

## How do I setup the project? ##

* need to install node.js & npm
* run in terminal: npm i
* install allure on mac: 'brew install allure' or see documentation: 'https://docs.qameta.io/allure/#_installing_a_commandline'

## How do I setup tests? ##

* Our pages are located under 'pages' folder
* all tests are written in 'test' folder
* tests should start with 'Test:' in the test name (it)
* run in terminal: 'npm run base_test'
* Report are in 'allure-results' folder
* View report - run in terminal: 'allure serve'

## Test guidelines ##

* we want to start in the main sale page 'https://www.lusha.com/'
* from there we want to hover on 'Resources' button in the top and under company click on 'About'
* we want to check the 'About' page in the sales pages - 'https://www.lusha.com/about/'
* In this page there is 'Our team' section 
* In this section there are boxes with a picture of our team member, name, job title and personal quote 
* we want to validate all the boxes in this section
* please write you test under the 'test' folder
* please add your pages and infra under the pages folder while using the existing infra
