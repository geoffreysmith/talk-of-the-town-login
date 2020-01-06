import { init, getCurrentConnections } from 'node-wifi';

const talkSsid = "Talkwifi_5GHz";

class ConnectToWifi
{
    // Initialize wifi module
    // Absolutely necessary even to set interface to null
    constructor()
    {
        init({
            iface = null
        })
    }

    GetCurrentConnections()
    {
        getCurrentConnections()
        .then(() => {
            connections.any(() => item.ssid == talkSsid)
            Console.Log("Connected to" + item.ssid)
            return item
        })
        .catch(function(error) {
            Console.Log("Not connected")
      }); 
    }
}

export default ConnectToWifi();