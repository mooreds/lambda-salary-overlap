This is the display and logic of a project to allow two parties to share their salary expectations without revealing their exact numbers. 

Each party fills out a form with the numbers and gets a results page that will display a green or red bar based on whether there is overlap.

There are three pages, hosted by s3:

* page1.html for the first salary reporting
* page2.html for the second salary reporting
* result.html to display a result

There are three lambda functions:

* sal1.js for the first salary reporting
* sal2.sj for the second salary reporting
* overlap.js to display a result

The lambda functions are hosted at public URLs and update a dynamodb table.
