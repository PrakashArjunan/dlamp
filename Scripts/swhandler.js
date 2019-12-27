if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('pwabuilder-sw.js')
        .then(function () { console.log('Service Worker Registered'); });
}