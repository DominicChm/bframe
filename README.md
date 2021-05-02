# Overview
This is the monorepo for all things baja. It is currently under development and is probably completely broken! Don't be surprised if it bursts into flames the second you glance at it. 

# General Info
There isn't much to say, aside from this is an extraordinarily ambitious project written in Typescript. 

# Comically Long Backend Todo 
- [ ] Tests 
- [x] C-type manipulation library - Published on NPM as ``c-type-util``
    - [x] All primitive types implemented
    - [x] Arrays
    - [x] Strings
    - [x] Framework implemented

- [ ] Module Manager
    - [ ] Variable-length variable indexing (support 16-bit var index)
    - [ ] Event Firing
    - [ ] Protocol Parsers
        - [ ] Error (compose/parse)
        - [ ] Handshake (compose/parse)
        - [ ] State Updates (compose/parse)
        - [ ] State Updates (compose/parse)
    - [ ] Endpoints
        - [ ] Websocket Endpoint
        - [ ] UDP Endpoint
    - [ ] Module class
        - [ ] Event Firing
        - [ ] Module construction
        - [ ] Module testing
        - [ ] Generalized Message Parsing
        - [x] Module definition interfaces

- [ ] User Manager
  - [ ] Write Graphql-esq Websocket Schema
  - [ ] Websocket Endpoint
  - [ ] Client Manager Class
    - [ ] Listener to Module Manager
    - [ ] Interface to client

- [ ] Modules
    - [ ] Simple Potentiometer

- [ ] Configuration Framework

- [ ] Data (Waiting on module manager)
    - [ ] Downsampling framework
    - [ ] Database 
    - [ ] Frontend Replication
    
- [ ] Node-RED integration
  
- [ ] Sessions/Security?


# Comically Short Frontend Todo 

## Proof of Concept
- [ ] Wireframe Dashboard Component Grid
- [ ] Websocket Interface
- [ ] Standard Live Data Vizualization API
- [ ] Number Component

## Featureset 1
- [ ] Dashboard Component Menu
- [ ] HTTP API Schema for Metadata (stuff like getting a list of sensors or dashboard components)
- [ ] Wireframe System Admin page
- [ ] Write API Schema for Admin endpoint (ws/http)
  

