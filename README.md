
![20241201_233952](https://github.com/user-attachments/assets/0f4ac8a7-3bc6-4b7b-ac7b-d2724724b73f)

# Social Investment Application

The **Social Investment Application** is a web-based platform designed to track and validate contributors' donations for specific events. This application offers transparency through detailed reporting, reminders for validation, and insightful statistics for users and events.

---

## Table of Contents
1. [Features](#features)
2. [Technologies](#technologies)
3. [System Requirements](#system-requirements)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Acknowledgements](#acknowledgements)

---

## Features
- Create and manage events.
- Record contributors' data and their contributions (money or goods).
- Reminder system using the WhatsApp API.
- Event and user statistics.
- Transparent reporting system for contributors and event organizers.

---

## Technologies
- **Frontend:** HTML, CSS, JavaScript.
- **Backend:** Node.js with Express.js.
- **Database:** MySQL.
- **Notifications:** WhatsApp API for sending reminders.

---

## System Requirements
- Node.js (latest version).
- MySQL Server.
- WhatsApp API integration.
- Supported OS: Windows, macOS, Linux.

---

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Mawlaz01/social-investment-application.git
   ```
   ```bash
   cd social-investment-application
   ```
      
2. Install dependencies:
   ```bash
   npm install
   ```

---

## Usage
1. Start the application using **nodemon**:
   ```bash
   nodemon
   ```

2. Set up WhatsApp connection:
   - When you start the application, a QR code will be displayed in the terminal.
   - Open WhatsApp on your phone and navigate to **Settings > Linked Devices**.
   - Tap on **Link a Device**, then scan the QR code displayed in the terminal using your phone.
   - Wait for the application to confirm the connection. Once successful, it will be ready to send notifications.

3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## Acknowledgements
I would like to express my heartfelt gratitude to all team members who contributed to this project. This project represents my first active participation in the complete development process, from design to deployment.

Special thanks to my mentors and peers for their moral and technical support. This application is now ready for public use, and I hope it brings meaningful benefits to the community.

Thank you all.

<img src="https://media1.tenor.com/m/3KSG8LgKn8cAAAAd/tachibana-arisu.gif" alt="Autoplay GIF" style="display: block; max-width: 100%; height: auto;" autoplay>

