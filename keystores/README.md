# Keystore de test partagé

Les workflows « Build test APK (shared signature) » génèrent un keystore de
**test uniquement** avec `keytool` à partir des paramètres fixes ci-dessous,
identiques dans les repos family-store et immich. Les deux APK produits sont
donc signés avec la même clé, ce qui permet au ContentProvider de Family Store
(permission `signature`) de partager la session Immich avec l'app Immich.

- Distinguished Name : `CN=Family Suite Test Key, OU=Family Suite, O=Family Suite, C=FR`
- Alias : `familytest`
- Passwords (store + key) : `familystore`
- Algorithme : RSA 2048, validité 10000 jours, format PKCS12

Ne jamais utiliser pour un build de production.
