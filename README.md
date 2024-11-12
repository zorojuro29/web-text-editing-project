# Web Text Editing Project

Le projet vise à développer un éditeur de texte en ligne collaboratif. L'éditeur de texte permettra à plusieurs utilisateurs de collaborer simultanément sur des documents, tout en maintenant le contrôle des versions et en garantissant la sauvegarde et la récupération des données.

Ce projet est construit autour de 3 services:

1. Service de gestion de documents : Ce service gère la création, la récupération et la sauvegarde de documents texte. Il doit permettre aux utilisateurs de stocker plusieurs documents et garantir leur persistance et leur disponibilité pour l'édition à tout moment.
2. Service d'édition collaborative : Ce service permet à plusieurs utilisateurs de modifier un document en temps réel. Les modifications effectuées par un utilisateur doivent être propagées aux autres utilisateurs via un flux Kafka afin d'assurer une collaboration synchronisée.
3. Service de contrôle de version : Ce service suit les modifications des documents et offre une fonctionnalité de restauration. Chaque modification doit être enregistrée comme une nouvelle version, permettant aux utilisateurs de consulter l'historique des modifications du document et de revenir aux versions précédentes si nécessaire.

On utilisera Apache Kafka pour la communication interservices. On implémente également un load balancer avec Nginx pour répartir les requêtes clients sur plusieurs instances des services. L'édition des documents se fera dans l'éditeur de texte Quill et on met en place un système de cache pour répondre plus rapidement aux requêtes comportant des documents souvent demandés.

## Mise en place de l'environnement

C'est une application tournant sur Linux (j'ai utilisé WSL). Plusieurs étapes pour mettre en place l'environnement:

1. Mise en place de la base de données MongoDB qui entreposera les documents, et Apache Kafka. Pour cela on utilisera les images docker. Exécutez à la racine du projet :
    docker-compose up -d

2. Installez Redis si ce n'est pas déjà fait :
    sudo apt install redis-server

   Démarrez Redis avant de lancer les services :
     sudo service redis-server start

3. Mise en place du load balancer. Ouvrez le fichier nginx.conf:
    sudo nano /etc/nginx/nginx.conf

Ajoutez dans le bloc http les instructions suivantes : 

    ### CONFIG POUR LE PROJET DE WEB TEXT EDITING
        # Configuration de DocumentManagmentService (Service sur le port 3001)
    upstream document_management_service {
        server localhost:3001;
        server localhost:3005;
        server localhost:3006;
    }

    # Configuration de CollaborativeEditingService (Service sur le port 3002)
    upstream collaborative_editing_service {
        server localhost:3002;
        server localhost:3007;
        server localhost:3008;
    }

    # Configuration de VersionControlService (Service sur le port 3003)
    upstream version_control_service {
        server localhost:3003;
        server localhost:3009;
        server localhost:3010;
    }

    server {
        listen 80;  # Port HTTP par défaut, changez-le si nécessaire

        # Proxy pour DocumentManagmentService
        location /api/documents {
            proxy_pass http://document_management_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Proxy pour CollaborativeEditingService
        location /api/collaborative {
            proxy_pass http://collaborative_editing_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Proxy pour VersionControlService
        location /api/version {
            proxy_pass http://version_control_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

Redémarrez nginx:
    sudo systemctl restart nginx

Ensuite on peut démarrer les différentes instances des services dans à la racine des services eux-mêmes (c'est réexpliqué dans les README.md des différents services).

4. Démarrez ensuite les services par :
    npm start

5. Le front-end contient le fichier App.js où il est demandé à l'utilisateur de rentrer un titre de fichier. On démarre le front-end par :
    npm start
Quill s'ouvre dans le navigateur et on peut alors modifier le document.





