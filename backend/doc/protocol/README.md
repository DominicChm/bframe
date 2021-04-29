This folder contains information about the client-server protocol behind communication. It is byte-based (a decision
made for parsing and network bandwidth reasons). It uses a one-way state model, where client and server both have their
own mutable state that is replicated immutably on the other side. This should avoid state merging issues.

## General Information

The general post-intialization packet format usually includes:

1. An 8-bit operation code
2. A 16-bit unique ID, assigned to the client by the server during handshake
3. A 16-bit timestamp that has been synced to a master on the server.

The structure usually looks like:
``<op:uint8> <uid:uint16> <timestamp:uint16>``

## Handshaking

A handshake is **INITIALIZED BY THE CLIENT** once it connects to the server. Its first packet should be in the format
found [here](<client/0x00 - HANDSHAKE.txt>), and includes

* The module's unique ID, which is used to physically refer to it. (Usually its MAC)
* Its *type*, which is a unique string used to determine what a client is. Different firmware will usually have a
  different type.

The server will respond across the websocket with its own packet that includes

* a 16-bit unique runtime ID

Clients should not send any more packets until the server has responded.

## Time Synchronization (UNIMPLEMENTED)

It's important to sync all clients with a master timestamp on the server to a ms or sub-ms accuracy to ensure data is
accurately logged. Timestamp is a uint16 that is synced to the server, which should allow a 65.535s to elapse before an
overflow. Overflows (that is, selecting a matching 65-second chunk to assign an incoming packet within) are handled on
the server. Time sync is initialized by the client, usually after the handshake. 

* Implementation ideas:
* https://github.com/camilleg/clockkit
* PTP
