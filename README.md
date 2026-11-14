# 🚗 MiGarage-Empresa | Gestión Integral de Flotas y Choferes

<p align="center">
  <a href="#español">🇦🇷 Español</a> |
  <a href="#english">🇬🇧 English</a>
</p>

---

<a id="español"></a>

# 🇦🇷 Español

## 📋 Descripción del proyecto

**MiGarage-Empresa** es una aplicación web diseñada para facilitar la gestión integral de flotas de vehículos y choferes dentro de una empresa.

Su objetivo es centralizar la información de los vehículos, organizar las asignaciones de conductores, registrar mantenimientos y gastos, administrar documentación y recibir recordatorios de servicios y vencimientos.

La aplicación busca simplificar las tareas administrativas y mejorar el seguimiento operativo de la flota mediante una interfaz intuitiva y adaptable a distintos dispositivos.

🌐 **Aplicación online:** [Acceder a MiGarage-Empresa](https://migarage-empresa.netlify.app/)

## ✨ Funcionalidades principales

### 🚘 Gestión de flota
- Registro y administración de vehículos.
- Consulta de información y fichas individuales.
- Asignación de choferes mediante un menú desplegable.
- Seguimiento del estado y la información de cada vehículo.

### 👥 Gestión de choferes
- Registro y administración de conductores.
- Organización de las asignaciones entre vehículos y choferes.
- Administración de información de los conductores.

### 🔧 Mantenimiento y talleres
- Registro de mantenimientos y servicios.
- Seguimiento del historial de mantenimiento.
- Administración de talleres.
- Recordatorios de servicios y próximos vencimientos.

### ⛽ Gastos y combustible
- Registro y seguimiento de gastos.
- Control de consumos y cargas de combustible.

### 🛡️ Seguros y documentación
- Administración de información de seguros.
- Gestión de documentación de los vehículos.
- Acceso a información relevante para la gestión de la flota.

### 🚨 Siniestros
- Registro y seguimiento de incidentes.
- Acceso a información relacionada con seguros y asistencia.

### 📊 Panel e informes
- Panel principal con información general de la flota.
- Acceso a indicadores y reportes.
- Organización de la información para facilitar el seguimiento operativo.

### 🔐 Roles y permisos

La aplicación contempla dos perfiles de usuario:

| Rol | Permisos |
|---|---|
| **Propietario** | Puede gestionar, editar y eliminar registros de vehículos, choferes y demás información de la empresa. |
| **Chofer** | Tiene acceso limitado y puede actualizar su asignación como conductor desde el menú desplegable de vehículos. |

Las operaciones de edición y eliminación requieren confirmación.

### 📱 Experiencia de usuario
- Interfaz adaptable a dispositivos móviles y computadoras.
- Navegación lateral para escritorio y navegación inferior para móviles.
- Centro de notificaciones.
- Indicador de conectividad.
- Diseño orientado a facilitar el uso cotidiano.

---

## 🛠️ Tecnologías y herramientas

| Categoría | Tecnologías |
|---|---|
| Lenguaje de programación | TypeScript |
| Biblioteca de interfaz | React 19 |
| Entorno de desarrollo | Vite |
| Estilos | Tailwind CSS 4 |
| Iconografía | Lucide React |
| Animaciones | Motion |
| Servidor | Express |
| Herramientas adicionales | Node.js, npm, dotenv |
| Publicación | Netlify |
| Desarrollo asistido por IA | Google AI Studio |

---

## 📂 Estructura del proyecto

```text
MiGarage-Empresa/
│
├── public/                 # Recursos públicos
├── scripts/                # Scripts del proyecto
├── src/
│   ├── components/
│   │   ├── common/         # Componentes compartidos
│   │   ├── enterprise/     # Módulos de gestión empresarial
│   │   ├── layout/         # Estructura y navegación
│   │   ├── notifications/  # Notificaciones
│   │   ├── pwa/            # Experiencia de aplicación web
│   │   ├── security/       # Seguridad y permisos
│   │   └── settings/       # Configuración
│   ├── context/            # Contexto y estado de la aplicación
│   └── ...
│
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ⚙️ Instalación y ejecución local

**Requisitos previos:**
- Node.js
- npm

**1. Clonar el repositorio**

```bash
git clone https://github.com/MarisaS1978/MiGarage-Empresa.git
```

**2. Ingresar a la carpeta**

```bash
cd MiGarage-Empresa
```

**3. Instalar dependencias**

```bash
npm install
```

**4. Configurar variables de entorno**

Revisar `.env.example` y configurar las variables necesarias para el entorno local.

**5. Ejecutar la aplicación**

```bash
npm run dev
```

La aplicación estará disponible en la dirección local indicada por Vite.

**Generar la versión de producción:**

```bash
npm run build
```

---

## 🎯 Objetivo del proyecto

Desarrollar una herramienta digital que permita centralizar y simplificar la administración de flotas empresariales, mejorando la organización de vehículos, conductores, mantenimientos, gastos y documentación.

Este proyecto forma parte de mi proceso de aprendizaje y desarrollo de soluciones digitales, integrando programación, diseño de interfaces y herramientas de inteligencia artificial.

---

## 👩‍💻 Desarrollado por

**Marisa Silvina Sandroni**

- **GitHub:** [MarisaS1978](https://github.com/MarisaS1978)
- **LinkedIn:** [Marisa Silvina Sandroni](https://www.linkedin.com/in/marisa-silvina-sandroni/)
- **Behance:** [marisasand](https://www.behance.net/marisasand)

📂 **Repositorio:** [MiGarage-Empresa](https://github.com/MarisaS1978/MiGarage-Empresa)
🌐 **Aplicación online:** [Acceder a MiGarage-Empresa](https://migarage-empresa.netlify.app/)

⭐ ¡Gracias por visitar mi proyecto!

---

<a id="english"></a>

# 🇬🇧 English

## 📋 Project Overview

**MiGarage-Empresa** is a web application designed to simplify the comprehensive management of company vehicle fleets and drivers.

Its main goal is to centralize vehicle information, organize driver assignments, track maintenance and expenses, manage documentation, and receive service and expiration reminders.

The application aims to streamline administrative tasks and improve fleet operations through an intuitive, responsive interface.

🌐 **Live Application:** [Access MiGarage-Empresa](https://migarage-empresa.netlify.app/)

## ✨ Key Features

### 🚘 Fleet Management
- Vehicle registration and management.
- Access to individual vehicle records.
- Driver assignment through a dropdown menu.
- Vehicle information and status tracking.

### 👥 Driver Management
- Driver registration and management.
- Organization of vehicle and driver assignments.
- Driver information management.

### 🔧 Maintenance and Workshops
- Maintenance and service records.
- Maintenance history tracking.
- Workshop management.
- Service and upcoming expiration reminders.

### ⛽ Expenses and Fuel
- Expense registration and tracking.
- Fuel consumption and refueling records.

### 🛡️ Insurance and Documentation
- Insurance information management.
- Vehicle document management.
- Access to relevant fleet information.

### 🚨 Incidents
- Incident registration and tracking.
- Access to insurance-related information and assistance.

### 📊 Dashboard and Reports
- Main dashboard with an overview of the fleet.
- Access to key indicators and reports.
- Organized information to support operational monitoring.

### 🔐 User Roles and Permissions

The application supports two user roles:

| Role | Permissions |
|---|---|
| **Owner** | Can manage, edit, and delete vehicle, driver, and other company records. |
| **Driver** | Has limited access and can update their driver assignment through the vehicle dropdown menu. |

Editing and deletion operations require confirmation.

### 📱 User Experience
- Responsive interface for mobile devices and desktop computers.
- Sidebar navigation on desktop and bottom navigation on mobile.
- Notification center.
- Connectivity status indicator.
- User-friendly design for everyday operations.

---

## 🛠️ Technologies and Tools

| Category | Technologies |
|---|---|
| Programming Language | TypeScript |
| UI Library | React 19 |
| Development Environment | Vite |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Animations | Motion |
| Server | Express |
| Additional Tools | Node.js, npm, dotenv |
| Deployment | Netlify |
| AI-assisted Development | Google AI Studio |

---

## 📂 Project Structure

```text
MiGarage-Empresa/
│
├── public/                 # Public assets
├── scripts/                # Project scripts
├── src/
│   ├── components/
│   │   ├── common/         # Shared components
│   │   ├── enterprise/     # Enterprise management modules
│   │   ├── layout/         # Layout and navigation
│   │   ├── notifications/  # Notifications
│   │   ├── pwa/            # Web application experience
│   │   ├── security/       # Security and permissions
│   │   └── settings/       # Settings
│   ├── context/            # Application context and state
│   └── ...
│
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ⚙️ Installation and Local Setup

**Prerequisites:**
- Node.js
- npm

**1. Clone the repository**

```bash
git clone https://github.com/MarisaS1978/MiGarage-Empresa.git
```

**2. Navigate to the project folder**

```bash
cd MiGarage-Empresa
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Check `.env.example` and configure the variables required for your local environment.

**5. Start the application**

```bash
npm run dev
```

The application will be available at the local address provided by Vite.

**Build for production:**

```bash
npm run build
```

---

## 🎯 Project Goal

To develop a digital tool that centralizes and simplifies company fleet administration, improving the organization of vehicles, drivers, maintenance, expenses, and documentation.

This project is part of my learning and development journey, combining programming, interface design, and artificial intelligence tools to build practical digital solutions.

---

## 👩‍💻 Developed by

**Marisa Silvina Sandroni**

- **GitHub:** [MarisaS1978](https://github.com/MarisaS1978)
- **LinkedIn:** [Marisa Silvina Sandroni](https://www.linkedin.com/in/marisa-silvina-sandroni/)
- **Behance:** [marisasand](https://www.behance.net/marisasand)

📂 **Repository:** [MiGarage-Empresa](https://github.com/MarisaS1978/MiGarage-Empresa)
🌐 **Live Application:** [Access MiGarage-Empresa](https://migarage-empresa.netlify.app/)

⭐ Thank you for visiting my project!
