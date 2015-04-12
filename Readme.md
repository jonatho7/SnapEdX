# SnapEdX (CS 6604 course project)
Base repository for the hosted Snap content for OpenEdX


## Hosted Site: http://think.cs.vt.edu/snapedx/


### Installation and Setup Instructions:
  - Install Python Flask. Flask can be found at: http://flask.pocoo.org/. Make sure to install Pyton Flask's dependencies: the Jinja2 template engine and the Werkzeug WSGI toolkit. 
  - Clone this repository.
  - Navigate to the static folder and clone the following repository: https://github.com/jonatho7/SnapEdX-Snap. This repository is not setup as a submodule. I chose to keep these two repositories separate for the sake of simplicity. However, remember to commit your changes to both repositories if you make changes in both repositories.
  - The repository mentioned above is named "Snap" on my machine. It is important that this repository be named "Snap" and not "Snap--Build-Your-Own-Blocks". Change the name of this folder if necessary.
  - In the file SnapEdX/server_configuration.py comment out the line: SITE_URL_BASE = SERVER_URL_BASE, and uncomment the line: SITE_URL_BASE = LOCAL_URL_BASE. Now you can develop and test locally on your machine.

### Run Snap:
  - Open up a command prompt in the SnapEdX repository folder.
  - Run: routes.py
   If the installation went as planned you should see a message on the next two lines of the command prompt:
      * Running on http://127.0.0.1:5000/
      * Restarting with reloader
  - Open up a web browser.
  - Navigate to http://127.0.0.1:5000/snap and Snap will load. That's it. Enjoy!
