commands - check also the weblink https://css-tricks.com/gulp-for-beginners/
--put gulp on the box
npm install gulp -g
--to get started in folder
npm init
--to update the packages to the current versions and to add them if they are not there
--might need to run as admin
npm update
--to create the dist folder and the deployable files
gulp build
--to create the dist folder and the deployable files plus favicons and favicon markup in html files
gulp all-build
--to start the watches and browser session which dynamically watches the changes. the word default is optional
gulp default  

notes
not sure if cleaning the cache with nuclear works
folders.bat will create the folders but also new files with nothing in them