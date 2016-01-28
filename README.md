# What is this

Form and validation tools used in many Setelis projects.




 - You can see very basic demo here: http://setelis.github.io/angular-se-forms/demo/
 - Reference data is get from here: http://docs.seforms.apiary.io/
* **TODO - more info**

# Install:

 - Add library to your project: ```bower install angular-se-forms --save```
 - Add module to your project: ```angular.module("DemoApp", ["seForms"])...```


 - TODO see demo for how to use: http://setelis.github.io/angular-se-forms/demo/

# Dependencies:
 - bootstrap - tooltips
 - TODO
 - Restangular - to send logs to the server
 - angular-translate - i18n
 - SeEventHelperService - helper
 - Lodash
 - bootstrap, optional
 - angular-animate, optional - see the demo http://setelis.github.io/angular-se-notifications/demo
 - angular-ui-select, angular-sanitize - reference data picker

# For developers:
# Setup

Developer should have *w3c validator*, *git*, *npm*, *grunt* and *bower* installed.
These command should be invoked:
 - ```webapp$ npm install```
 - ```webapp$ bower update```

Then app can be deployed in any web server.

# Working with GIT
 - **MERGE** should **not** be used! Only **REBASE** (```git pull --rebase```)
 - ```grunt```
   - this will run tests/validators
 - ```git add .```
 - ```git commit -m "TRAC_NUMBER TRAC_DESCRIPTION - more information (if needed)"```
 - ```git pull --rebase```
 - ```grunt```
 - ```git push```

# Environment variables

To use grunt with the project following environment variables **MUST** be set (e.g. in *~/.profile*):
 - ```export SEFORMS_W3C_LOCAL_URL=http://10.20.30.140:9980/w3c-validator/check```

Where local w3c validator is installed on http://10.20.30.140:9980/w3c-validator/check (outside Setelis LAN - w3c validator should be installed manually - see the section *Installing W3C Validator*)

# Development cycle
 - create/find issue
 - ```git pull --rebase```
 - ```grunt watch```
 - implement the selected issue
 - ```grunt```
   - this will run tests/validators
 - ```git add .```
 - ```git commit -m "NUMBER TRAC_DESCRIPTION - more information (if needed)"```
 - ```git pull --rebase```
 - ```grunt```
 - ```git push```
 - *again*


# grunt
There are several commands:
 - ```grunt```
   - validates (tests, static analyzers, html validator) the project
 - ```grunt build```
   - builds the project (see the *dist/* folder)


# Installing W3C Validator
w3c free online validator will block your IP if you try to validate project HTMLs many times (this happens usually when modifying html files when grunt watch is started).

How to install w3c validator + HTML5 validator (validator.nu):

**Ubuntu 13.10+**: there are some issues, see http://askubuntu.com/questions/471523/install-wc3-markup-validator-locally


Short version:
```sh
sudo mkdir /etc/apache2/conf.d
sudo apt-get install w3c-markup-validator libapache2-mod-perl2
sudo ln -s /etc/w3c/httpd.conf /etc/apache2/conf-enabled/w3c-markup-validator.conf
sudo gedit /etc/apache2/conf-available/serve-cgi-bin.conf
```
```
<IfModule mod_alias.c>
    <IfModule mod_cgi.c>
        Define ENABLE_USR_LIB_CGI_BIN
    </IfModule>

    <IfModule mod_cgid.c>
        Define ENABLE_USR_LIB_CGI_BIN
    </IfModule>

    <IfModule mod_perl.c>
        Define ENABLE_USR_LIB_CGI_BIN
    </IfModule>

    <IfDefine ENABLE_USR_LIB_CGI_BIN>
        ScriptAlias /cgi-bin/ /usr/lib/cgi-bin/
        <Directory "/usr/lib/cgi-bin">
            AllowOverride None
            Options +ExecCGI -MultiViews +SymLinksIfOwnerMatch
            Require all granted
        </Directory>
    </IfDefine>
</IfModule>
# vim: syntax=apache ts=4 sw=4 sts=4 sr noet
 ```

Then follow the steps that haven't already been taken in http://blog.simplytestable.com/installing-the-w3c-html-validator-with-html5-support-on-ubuntu/

These should be changed in original tutorial:
 - HTML5 = http://localhost:8888
 - java should be version 7!


Restart apache when done:

```sudo service apache2 restart ```

For HTML validator you can follow these instructions: http://validator.github.io/validator/#build-instructions
