:warning: Doesn't actually work once I converted it to VSCode workspaces, to see the code that works see below.

# Talk of the Town Login
Have you ever had trouble logging into Talk of the Town login at 135th and Nall? No need to hit the authentication page! Assuming you connect to the 5GHz SSID this will read your mac address and complete the authentication request.

## Installation
`npm install talk-of-the-town-login`

## Usage
`talk-login`

## Why
Running Windows 10 on a late edition MacBook Pro with Broadcom drivers 7.77.110.0 (2019-10-10) kills Internet connections on certain [captive portal](https://en.wikipedia.org/wiki/Captive_portal) routers. The solution is [here](https://myitengineer.com/windows-10-wifi-connected-but-no-internet-macbook-with-bootcamp/) and to rollback drivers. Specifically I found the issue to be worse on Cisco Meraki MR APs but all routers with captive portals were slow, and impossible to connect to on 5GHz if that was the only band available. The process of logging into a restaurant/bar/hotel is usually this on Windows/OS X:

1. Connect to the Wifi network (this is *a priori* you need at some point to tell the computer which to connect to, if you're at a low point in your life and at a strip mall with a Hooter's and a Buffalo Wild Wings, no matter what you'll need to tell it which one you want).
2. Magic happens in a million different ways, see the Wikipedia article, but luckily in the United States corporate chains standardize technology or if not corporate, the ISP provides a standard AP. In any case while there might be a million ways for captive portals/splash pages to authenticate you, in reality it is pretty standardized.
3. Internet works as long as your "token" (IP and mac address combination) is deemed valid before you have to reauthenticate.

The problem with (2) is that Windows, and I'm assuming Android/OSX, accounts for the million different ways this can happen by basically downloading a small file over TLS, if you ever have seen msconnecttest.com redirects when opening your browser this what it is doing, it knows you're connected but doesn't know if you're connected to the Internet. The NPM [is-online](https://www.npmjs.com/package/is-online) package does something similar.

The problem is that this test is not 100% accurate as either your IP address changes and the router deals with it incorrectly, or I believe but not positive in Meraki's case, it appears to be looking at the OS for marketing purposes, Broadcom identifies itself as Apple, it assumes Apple and then gets confused that browser requests indicate Windows in the headers. As staff at restaurants do not seem to have strong desire to help me in debugging the problem L7 gateway connection issues I was forced to figure out the solution on my own.

In any case, I found that in 100% of cases that once I downgraded from the bad Broadcom drivers, forcing a new "session" on the router by posting my mac address, ip address and headers used on a successful attempt worked. It all comes down to a simple curl statement:

```bash
curl -d '{"macAddress":"<your mac address>","ipAddress":"<ip address assigned by router>","password":"<password everyone knows/sometimes other variable if there's no password but a "Continue" button which is effectively the same thing as a password that everyone knows>"}'-H "X-JNAP-Action: http://cisco.com/jnap/guestnetwork/Authenticate" -H "X-Requested-With: XMLHttpRequest" -H "Content-Type: application/json; charset=UTF-8" -X POST http://<cisco usually the gateway, not always>:10080/JNAP/
```
The headers are also variable, but I found that luckily nearly everyone has some sort of AP point with a Cisco image installed so usually hitting the gateway IP address will redirect you to the login page and then it is a matter of capturing the data in the POST. There's no real token authentication, it appears that your IP/mac address are registered as okay in a table on the router somewhere.

> N.B. RFC 7710 is supposed to standardize this by returning a URI for the splash page upon the DHCP "handshake" but I guess you'd have to run tcpdump or something to capture that at a lower level.
