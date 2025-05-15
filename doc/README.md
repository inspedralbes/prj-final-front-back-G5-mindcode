# Documentació tècnica

## Index

## Arquitectura de la aplicació
![Imatge amb l'arquitectura de la app](./images/Arquitectura.png)

## Documentació API

Totes les rutes estan documentades al seu fitxer respectiu

- [API IA](../back/routes/aiRoutes.js)
- [API classes](../back/routes/classRoutes.js)
- [API google](../back/routes/googleRoutes.js)
- [API llenguatges](../back/routes/languageRoutes.js)
- [API restriccions](../back/routes/restrictionRoutes.js)
- [API estadístiques](../back/routes/statsRoutes.js)
- [API usuari](../back/routes/userRoutes.js)

> Tots els endpoints utilitzants, sumant els que parlen amb la IA es troben [aquí](./endpoints/)

## Esquema de les bases de dades
El nostre projecte conté 2 bases de dades, una d'elles MySQL i l'altra MongoDB.

### MySQL

![Base de dades MySQL](./images/bdmysql.png)

### MongoDB

![Base de dades MongoDB](./images/bdMongo.png)


## Components al Front

Vam decidir aplicar l'atomic design al nostre projecte per separar els components correctament i poder fer-los reutilitzables, per aquest motiu la majoria estan separats en les seves carpetes respectives, d'altres es troben a la carpeta components i les pàgines són als seus propis directoris.

Àtoms:

![Àtoms de l'aplicació](./images/atoms.png)

Molècules:

![Molècules de l'aplicació](./images/molecules.png)

Organismes i plantilles:

![Organismes i plantilles de l'aplicació](./images/organismes.png)

Altres components i pàgines:

![Altres components i pàgines de l'aplicació](./images/resta.png)

## Proxy invers

El proxy invers agafa totes les crides que rep el servidor i les reparteix entre el front i el back, les crides a / van al front, i les crides a /back/ van al servidor de Node del backend.

## Disseny

Hem utilitzat Tailwind com a framework del nostre disseny, junt amb la implementació que té amb React vam creure que era l'opció més encertada.

## Desplegament

La manera de desplegar està explicada a [l'arrel](../README.md) del repositori i es triga aproximadament 30 minuts en afegir tots el secrets, copiar el projecte i llençar els Github Actions.