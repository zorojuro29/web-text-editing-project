#!/bin/bash

# Lancer l'instance sur le port 3001
PORT=3001 npm start &

# Lancer l'instance sur le port 3005
PORT=3005 npm start &

# Lancer l'instance sur le port 3006
PORT=3006 npm start &
