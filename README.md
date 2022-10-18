# Admin 1000 Moustaches

Ce site permet la gestion des animaux, des familles d'accueil, des vétérinaires et de leurs interventions.
Le front est réalisé en ReactJS et le server en NodeJS Express

## Développement local

- lancer le server avec firebase emulator : `cd server && firebase emulators:start --only functions`
- lancer le front : `cd front && npm run start`

## Déploiement

- déploiement du front : `firebase deploy --only hosting`
- déploiement du server : `firebase deploy --only functions`
