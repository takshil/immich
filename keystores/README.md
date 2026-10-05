# Keystore de test partage

`family-test.keystore` (PKCS12) est une cle de **test uniquement**, commitee
ici et identique dans les repos `family-store` et `immich`. Les APK produits
par les workflows « Build test APK (shared signature) » sont donc signes avec
la meme cle, ce qui permet au ContentProvider de Family Store (permission
`signature`) de partager la session Immich avec l'app Immich Famille.

- Alias : `familytest`
- Passwords (store + key) : `familystore`
- Empreinte SHA-256 du certificat :
  `ED:FA:FE:8B:BD:9C:7D:D7:70:B9:9E:39:5E:C9:AE:5D:66:91:FE:EC:71:26:55:C7:24:C2:62:6F:A3:6E:DC:E5`

Ne jamais utiliser pour un build de production.
