![image](https://user-images.githubusercontent.com/6266547/233438238-8aa2fa88-7638-4833-99da-cf4b2cc07873.png)
<a name="readme-top"></a>

# MegaK HeadHunter

<details open>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#technologies-used">Technologies used</a></li>
        <li><a href="#live-demo">Live demo</a></li>
        <li><a href="#screenshots">Screenshots</a></li>
      </ul>
    </li>
    <li>
      <a href="#about-this-repository">About this repository</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#contributors">Contributors</a></li>
      </ul>
     </li>
  </ol>
</details>

</br>

## :speech_balloon: <span id="about-the-project">About the project</span>

This platform, made exclusively for [MegaK JS Course](http://megak.pl) provides an easy way for HR departments of companies, including headhunters, to connect with people seeking employment in the IT industry.

MegaK students can use it to showcase their skills in a standardized manner.
HR personnel can effortlessly find suitable job candidates, conduct interviews, and offer cooperation.
The platform is not intended to compete directly with job portals. Instead, its goal is to complement the market with a focus on MegaK students.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### :computer: <span id="technologies-used">Technologies used</span>

![image](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)

![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

![image](https://img.shields.io/badge/Trello-0052CC?style=for-the-badge&logo=trello&logoColor=white)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### :clapper: <span id="live-demo">Live demo</span>

Currently, there is no live demo available. We are working to make it available in the near future.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### :camera: <span id="screenshots">Screenshots</span>

![image](https://user-images.githubusercontent.com/6266547/233413077-0388a0db-ace3-4b3f-a2e5-57b359a71eed.png)
![image](https://user-images.githubusercontent.com/6266547/233413248-2f2b60b9-4f95-4c64-b69c-25421a5ad006.png)
![image](https://user-images.githubusercontent.com/6266547/233413414-391375d5-c305-4cd4-bd73-df015ff254cc.png)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## :book: <span id="about-this-repository">About this repository</span>

This repository contains the back-end part of the application.

The front-end part is located at https://github.com/HessianPL/MegaK_HeadHunter_FE

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### :hammer: <span id="installation">Installation</span>

1. Clone the repository

```
https://github.com/perlus3/HeadHunterBE
```

2. Install dependencies

```
npm install
```

3. Create an ".env" file in the application's root directory, and fill it e.g.:

```
APP_ENV = development
APP_IP = localhost
APP_PORT = 3000
APP_DOMAIN = 'http://localhost:3001'

TYPEORM_HOST = 127.0.0.1
TYPEORM_USERNAME = root
TYPEORM_PASSWORD = ''
TYPEORM_DATABASE = headhunter
TYPEORM_PORT = 3306
TYPEORM_SYNC = true

JWT_SECRET = <Your top secret code the longer the better>

USER_NAME_SMTP= ''
USER_PASSWORD_SMTP= ''
HOST_SMTP= ''
PORT_SMTP= ''
EMAIL_SEND_FROM_SMTP= ''

JWT_EXPIRES_ACCESS = 24h
JWT_EXPIRES_REFRESH = 720h
```

4. Create new Database (name must be the same like in "TYPEORM_DATABASE" in ".env" file) e.g.:

```
headhunter
```

5. For development run

```
nest start --watch
```

6. To build production version run

```
nest build
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### :womans_hat: :tophat: <span id="contributors">Contributors</span>

#### Backend team constists of:

Kamil Perlega https://github.com/perlus3

Wojciech Kuciński https://github.com/cynio007

Małgorzata Jurkiewicz https://github.com/MalgorzataJu

Radosław Baran https://github.com/baradoslaw

Artur Ponieczyński https://github.com/ArturPonieczynski

<p align="right">(<a href="#readme-top">back to top</a>)</p>
