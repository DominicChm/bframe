# Roadmap

This is the plan for a working framework by (hopefully) the end of Summer 2021.

## Milestone 1: Foundations and Parity

Milestone 1 includes all that's necessary for basic data-gathering at the same level the Teensy-based DAQ is at.

- [ ] Particle-Manager
  - [ ] Handshake Reception/Response
  - [ ] Runtime ID assignment
  - [ ] Time-sync provider
  - [ ] Basic system definition loading
    - [ ] For Milestone 1, system definitions will be hand-written
  - [ ] State update packet resolution (binary input -> JS object)
  - [ ] Basic event firing
  - [ ] Particle state caching
  - [ ] Basic testing
  - [ ] Particle -> Server state replication over WebSocket (UDP, server -> particle later)
- [ ] Protocol
  - [x] Handshake
  - [x] State Update
  - [ ] Time-Sync
  - [x] Error



## Other, unassigned, tasks

- Server -> Particle state replication
- System definition graphical editor
