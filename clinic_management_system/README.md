# Clinic Management System

A simple web-based Clinic Management System using **HTML, CSS, and JavaScript**.  
It provides role-based dashboards for **Receptionist** and **Doctor**.

## Features

### Receptionist Panel
- Add patient details (Name, Age) and generate automatic token numbers
- Generate consultation bills for examined patients
- View all patient records, status, and prescriptions

### Doctor Panel
- View active waiting patient queue and patient details
- Add prescription notes for each patient

### Additional Features
- Data persistence using browser local storage (`localStorage`)
- Reset system data button to clear saved records
- Easy logout option to switch roles

## Demo Credentials

| Role | Username | Password |
| --- | --- | --- |
| **Doctor** | `doc1` | `doc123` |
| **Receptionist** | `rec1` | `rec123` |

---

## How to Run

1. Clone or download the repository.
   ```bash
   git clone https://github.com/sirida20/Web-Development.git
   ```
2. Navigate into the folder:
   ```bash
   cd Web-Development/clinic_management_system
   ```
3. Open `index.html` in any web browser (or double-click the file in your file explorer).
4. Login as Receptionist or Doctor using the demo credentials.

---

## Basic Workflow

1. **Receptionist:** Register a patient to generate a token (Status: `Waiting`).
2. **Doctor:** View patient details, add prescription, and move to the next patient (Status: `Examined`).
3. **Receptionist:** Select the examined patient from the dropdown and generate bill (Status: `Completed`).

---

## Folder Structure

```text
clinic_management_system/
├── index.html
├── style.css
└── script.js   
```
