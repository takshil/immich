# Keystore de test partagé

`family-test.keystore` (PKCS12) est une clé de **test uniquement** générée pour
re signer Family Store et Immich avec la même signature. Elle permet au
ContentProvider de Family Store (permission `signature`) de partager la session
Immich avec l'app Immich dans les builds de test.

- Alias : `familytest`
- Passwords (store + key) : `familystore`
- Ne jamais utiliser pour un build de production.
