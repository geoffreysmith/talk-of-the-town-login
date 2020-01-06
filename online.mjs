import isOnline from 'is-online';
const curl = new (require( 'curl-request' ))();


class Online
{
    async ReallyOnline()
    {
        //todo figure out mac address and ip address
        isOnline().then(Console.Log("Online!"))
        .catch(
            Console.Log("Not, running connection script"),
            curl.setHeaders([
                'X-Requested-With: XMLHttpRequest',
                'Content-Type: application/json; charset=UTF-8'
                        ]),
            curl.setBody('{"macAddress":"8c:85:90:6d:fe:a0","ipAddress":"192.168.3.116","password":"talk"}'),
            curl.post('http://192.168.3.1:10080/JNAP/')
        )
    }
}

export default new Online()