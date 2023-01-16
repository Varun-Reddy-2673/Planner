# Planner

## Overview

Planner is a web application that enables users to create and edit weekly timetables. The app divides the week into 168 **slots**, each representing one of the 168 hours in a week. The user can assign each slot a **domain** based on the nature of tasks they wish to complete during that particular slot. The user can additionaly create and delete tasks on a seperate page.

## Tabs

The application has three tabs - **Dashboard**, **Task manager**, and **Domain manager**.

### Dashboard

The Dashboard is where the user's timetable is displayed. The upper section of the page displays information about the selected slot (by default the chosen slot is the slot corresponding to the current time). If the selected slot is an empty one, the section provides the user with the option to assign a domain to it. Otherwise, the section displays the tasks associated with the assigned domain and also provides the user with the option to delete the domain.

### Task manager

The Task manager is where the user manages their tasks. The page displays all the user's tasks seperated by domain. It also allows the user to create new tasks. Each task displayed on the page has a button for the deletion of the task.

### Domain manager

The Domain manager is where the user manages their domains.

## Installation steps

<ol>
<li>Download the repository on your local computer</li>
<li>Run **setup.sql**</li>
<li>Open main.py and enter your own SQL password in line 5</li>
<li>Run main.py</li>
</ol>

## Technologies used

Front end - HTML, CSS, JavaScript
<br>
Back end - Python, Flask, MySQL
