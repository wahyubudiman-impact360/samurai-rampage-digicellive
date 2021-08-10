IMPACTJS MARKETJS PLATFORM
==========================
### A cleaner, simpler approach to building HTML5 games

#### GUIDE, DOCS & REFS:
* ##### [ImpactJS](http://impactjs.com/documentation)
* ##### [Storage Manager Plugin](https://docs.google.com/document/d/14kzaC8yl2QbJzMFEIkIJWviY78GW0Cnz7WF9GRh9Klg/edit?usp=sharing)
* ##### [FAQ](https://bit.ly/mjs-faq)

##### Install Jscrambler CLI (v5.x)
1. Download and Install [Node.js & npm](https://docs.npmjs.com/getting-started/installing-node)
2. Install [jscrambler](https://www.npmjs.com/package/jscrambler) globally: `npm i -g jscrambler`
Note that you only need to do this once. 

#### Notes: 

##### Security related
As of October 23rd 2017 anti-piracy security updates, jscrambler obfuscation is now part of the game compilation process ( '-b' task from push.sh). 

In push.sh, added secure_strong and secure_regular: 

- secure_regular excludes framebreaker and copyright message (for clients typically -> easier for integration)  
- secure_strong has all the goods

#### Fix for SSL Error `[SSL: CERTIFICATE_VERIFY_FAILED]`
Try installing [certifi](https://pypi.org/project/certifi/) package. 
For Mac user, you can install by executing the command anywhere in terminal: `/Applications/Python\ {VERSION}/Install\ Certificates.command`

```shell
# For example
# Python 2.7
/Applications/Python\ 2.7/Install\ Certificates.command

# Python 3.6
/Applications/Python\ 3.6/Install\ Certificates.command
```

