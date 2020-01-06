import connections from './connections.mjs';
import online from './online.mjs';

(async function main() {
    const args = process.argv.slice(2);
    // eslint-disable-next-line no-console
    console.log('Testing connection to Talk of the Town Wifi...');
    await asyncCheckOnline(args[0]);
})();

async function asyncCheckOnline() {
    setInterval(async () => {
        try {
            connections.GetCurrentConnections();
            await online.asyncCheckOnline();
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Something went wrong");
        }
    }, 5000)
}