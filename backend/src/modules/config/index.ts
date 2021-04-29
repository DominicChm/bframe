module.exports = {

    //--------------Network settings----------------//

    //The port used by physical system modules to create a connection
    internal_ws_port: 81,
    internal_udp_port: 4444,

    //The resolution of time data forwarded to clients in real-time. Follows a log10 scale (I.E -1 = 0.1s resolution)
    forward_resolution: -2,


};
