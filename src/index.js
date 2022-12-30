import Lights from './apps/Lights';

let currentApp;
startApp(window.location.pathname.replace('/', ''));

function startApp(name) {
    if (currentApp) {
        currentApp.stop();
    }
    switch (name) {
        case 'lights':
        default:
            currentApp = new Lights();
            break;
    }

    currentApp.start();
    return currentApp;
}