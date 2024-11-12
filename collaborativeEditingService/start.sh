#!/bin/bash

# Lancer l'instance sur le port 3001
PORT=3002 npm start &

# Lancer l'instance sur le port 3007
PORT=3007 npm start &

# Lancer l'instance sur le port 3008
PORT=3008 npm start &
