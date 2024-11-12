#!/bin/bash

# Lancer l'instance sur le port 3003
PORT=3001 npm start &

# Lancer l'instance sur le port 3009
PORT=3009 npm start &

# Lancer l'instance sur le port 3010
PORT=3010 npm start &
