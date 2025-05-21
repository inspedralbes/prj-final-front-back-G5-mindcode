### INTEGRANTS :
  - Arnau Malaret
  - Inbisat Naveed
  - Bernat Mir
  - Kaetheen Guanoluisa
  - Arnau Fernández

### NOM DEL PROJECTE :
 MINDCODE
  
### DESCRIPCIÓ DEL PROJECTE :
  - Aquest projecte sorgeix de la necessitat de crear una eina capaç d'ajudar els alumnes amb els diferents llenguatges de programació utilitzats durant el curs. Mitjançant eines com IA i fonts d'informació, ajuden a resoldre els dubtes dels alumnes. La aplicació contindrà un filtre de classes i assignatures de manera que l'informació es filtri en funció del que l'alumne necessiti. També hi haurà una interfaç similar pels professors. On podràn controlar les assignatures i classes visibles pels alumnes, tenint la capacitat de modificar la visibilitat en funció de les necessitats (prova de validació, exercicis, temàtiques)


### GESTOR DE TASQUES : 
  - El gestor de tasques utilitzat serà Taiga, amb metodologia SCRUM, separat per sprints.
    [Taiga](https://tree.taiga.io/project/arnfergil-mindcode/backlog)

### PROTOTIP GRÀFIC :
  - Els prototips gràfics com els Mockups i Wireframes els realitzarem amb Penpot.
    URL Penpot: https://design.penpot.app/#/view?file-id=790b4dba-cade-8121-8005-9e86d2d59af8&page-id=790b4dba-cade-8121-8005-9e86d2d59af9&section=interactions&index=0

### URL Video PITCH: 
https://youtu.be/Mv5bAkg1rGc?feature=shared App
https://www.youtube.com/shorts/9hZZWGzDAjE  Pitch


### URL DE PRODUCCIÓ : 
  - [Mindcode.cat](Mindcode.cat)

### ESTAT :
  Projecte en fase de documentació

### URL Diagrama entitat relació: 

[Enllaç](https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=Entidad%20relacion%20TRF.drawio&dark=auto#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1TKbrb3gLTKSwPoLYVMBvoF4VPat1ewLT%26export%3Ddownload)

# Documentació

## Planificació
  - [Planificació del projecte](https://docs.google.com/document/d/1MbChJ_Kye6GWNxwI8cFC5LiyzKjEMq_fJoHIx_NFn2E/edit?usp=sharing)
    
## Disseny

### PROTOTIP GRÀFIC :
  - Els prototips gràfics com els Mockups i Wireframes els realitzarem amb Penpot.
    Aquest es el Mockup: 
    
    ![Mockup](./doc/images/MockUp.png)

    Aquest es el Wireframe:

    ![Wireframe](./doc/images/Wireframe.png)

## Documentacio tècnica

Carpeta [/doc](./doc)

## Presentació resum

  - [Planificació resum](https://docs.google.com/presentation/d/1OsLFj9LcIzN8_MqK2-udVEhgA0os3ScjVtbCwyK2fQg/edit?usp=sharing)

## Presentació Funcional / Comercial 
  - [Power Point presentacio comercial](https://www.canva.com/design/DAGnabO73Jg/__eqY1m0BbSRgjTNXNqpWQ/view?utm_content=DAGnabO73Jg&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hf45802d1d0
)
 
## Vídeo comercial
  - [Vídeo comercial](https://youtu.be/Mv5bAkg1rGc?feature=shared )

## Demo
  - [Vídeo demo](https://youtu.be/QhfQCKYPrh8)

## Presentacio Tècnica 
  - [Power Point presentacio tècnica](https://www.canva.com/design/DAGnaIuBOTU/FkV6VUsf959k6Z3Ph3bPFg/view?utm_content=DAGnaIuBOTU&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h6ae6fc1524)

## Pitch
 - [Video elevator pitch](https://www.youtube.com/shorts/9hZZWGzDAjE )
   
# Manual d'Ús

## 1. Introducció

**MINDCODE** és una eina educativa d'assistència per a programació que:

- ✅ Ajuda els estudiants amb preguntes de programació en diversos llenguatges
- 🎯 Permet als professors gestionar classes i establir restriccions de llenguatge
- 🤖 Utilitza intel·ligència artificial per oferir assistència contextualitzada
- 🔍 Filtra la informació segons la configuració de classe i llenguatge

## 2. Començant

### 2.1 Inici de sessió

1. Obre l'aplicació MINDCODE
2. A la pàgina d'inici:
   - Fes clic a `GOOGLE / inspedralbes.cat`
   - Autentica't amb el teu compte Google (`@inspedralbes.cat`)
3. El sistema detectarà automàticament el teu rol (professor/estudiant)

### 2.2 Configuració inicial

#### Per a Professors:
- **Primer accés**: Redirecció a *Crear Classe*
- **Accés recurrent**: Redirecció a *Pàgina del Professor*

#### Per a Estudiants:
- **Primer accés**: Redirecció a *Unir-se a Classe*
- **Accés recurrent**: Redirecció a *Pàgina de l'Estudiant*

### 3.1 Crear Classe
```mermaid
graph LR
A[Nom Classe] --> B[Generar Codi]
B --> C[Compartir]
```

## 3.2 Gestió de Llenguatges

### Configuració de Llenguatges Disponibles
1. Accedeix al **Panell de Control del Professor**
2. Selecciona **Llenguatges de Programació**
3. Activa/desactiva els llenguatges requerits:
   - ✅ Python
   - ✅ JavaScript
   - ✅ Java
   - ✅ C++
   - ✅ HTML/CSS

### Establiment de Restriccions
```mermaid
graph TD
    A[Selecciona Llenguatge] --> B[Estableix Nivell]
    B --> C{Bàsic<br>Intermedi<br>Avançat}
    C --> D[Guarda Configuració]
```

# Arquitectura de Desplegament

## Docker

Mindcode utilitza conterització per al desplegament, amb configuració diferents per a desenvolupament i producció. El sistema consisteix en múltiple serveis interconectats, incloent frontend, backend, bases de dades i eines d'administració.

Aquesta és l'arquitectura del docker:

![Arquitectura del docker](./doc/images/arquitectura_docker.png)

El codi del docker de desenvolupament és [aquest](./compose.yaml)
I el codi del docker de producció és [aquest](./compose.production.yaml)

## Desplegament

A Mindcode tenim eines d'integració continua, concretament Github Actions, el qual puja a producció el projecte automàticament quan es llença el workflow. 

Els passos que fa són aquests:

![Github Actions](./doc/images/actions-base.png)

O, vist de manera més concreta:

![Github Actions més a fons](./doc/images/actions-extended.png)

Aquesta manera de treballar ens aporta diferents millores de seguretat respecte no tenirles, com per exemple: 

1. Variables d'entorn es guarden com a Github secrets

2. Credencials de bases de dades es controlen des de variables d'entorn

3. La xarxa està aïllada amb l'us de la network de Docker

4. La conexió SSH està estrictament controlada per verificació per clau

## Com utilitzar

Requisits:

1. Docker instal·lat

2. Docker compose instal·lat

### Instal·lació

1. Clona el repositori

```sh
   git clone https://github.com/inspedralbes/prj-final-front-back-G5-mindcode.git
   ```
2. Aixeca el Stack

```sh
   docker compose up
   ```

### Desplegar

Requisits:

Els requisits mínims son un domini propi, docker instal·lat amb el plugin de docker compose, portainer instal·lat per a administració i un nginx amb un proxy invers amb aquesta configuració:

```
server {
    listen 80;
    listen [::]:80;

    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:5173/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /back/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /portainer/ {
        proxy_pass https://localhost:9443/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Un cop tens el nginx funcionant has de copiar el projecte a un altre repositori, ja que el deploy es fa mitjançant github actions, per a més informació sobre com fer-ho mira la [documentació oficial](https://docs.github.com/en/issues/planning-and-tracking-with-projects/creating-projects/copying-an-existing-project).

Un cop el tinguis copiathas d'afegir els secrets del repositori.

Per això:

1. Navega als settings

2. Baixa fins a secrets and variables

3. Clica-hi a actions i afegeix els secrets de repositori

Aquests són els secrets que s'han d'omplir

```
PROD_SECRET_KEY: Clau secreta del servidor host
PROD_USER: Nom de l'usuari del servidor
PROD_HOST: IP del servidor
MYSQL_USER: Nom d'usuari de la base de dades MySQL
MYSQL_PASSWORD: Contrasenya de la base de dades MySQL
MYSQL_ROOT_PASSWORD: Contrasenya root de la base de dades MySQL
MYSQL_HOST: ip de la base de dades MySQL
MYSQL_DATABASE: nom de la base de dades
MONGO_ROOT_USER: Nom de l'usuari root de la base de dades MongoDB
MONGO_ROOT_PASSWORD: Contrasenya de l'usuari root de la base de dades MongoDB
AI_HOST: IP de la ia 
BACK_PORT: 3000
PRODUCTION_API_URI: Adreça de crides al back
JWT_KEY: Clau per al JSON web token
```
Un cop els tinguis afegits només falta fer push a una branca que activi el workflow
