<<<<<<< HEAD
# alexa-heos
Experimental Alexa control for Denon HEOS
=======
# alexa-heos
> Experimental Alexa control for Denon HEOS

Currently, this skill make a raw sockets connection to HEOS every time you launch the skill.  Making this connection takes a long time (several hundred msec) and seeing as how a new connection has to be made on each issued command, the entire process is very slow.  An Echo will sit there spinning for at least a good second or so while you wait to see what happened.

My proposed solution is:

1. Run a local server that maintains a persistent socket to HEOS.
 - Might want to maintain the current HEOS state so it does not have to be queried prior to issuing a command, to the extent the HEOS API makes this possible.
2. Have Alexa connect to the local server through an API that defines the supported commands (ex: /local_address/next_track).
 - You can host an Alexa skill directly on an HTTPS server, but hosting the skill off Lambda and having it make the connection to your local server will be easier (and probably slower).
3. Have the local server query the HEOS API (if necessary) and issue the proper command to HEOS.

Exposing a local server API would also be more secure than exposing a raw TCP socket at the local HEOS address to the whole Interwebs.

I currently don't have free time to do this, but if you try this on your own, let me know how it goes.
>>>>>>> f2a145e12b977a78908eda56bf5252a6ce64e701
