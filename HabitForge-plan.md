## What does a user Do in this app ?
 when a user enters the root folder / he scrolls for some information and when he presses login on SignUp he is redirected to either login page(/login) or Signup(/signup) page, where he logs in or signs up for the program. Then he is redirected to /habits where he there will be a button to create a new habit which will redirect him to /habit/new where he can create a new habit. clicking on each habit will display the habits in a new page(/habits/:id)
## What screens do I need to make this work ?
 -landing page
 -log in screen
 -sign up screen
 -habits screen
 -new habits creating screen
 -each habit screen
## What data do I need to store to make this app work ?
 1) each habit
 2) user credentials
## Whats the simplest version that I can build ?
 I can only exclude /habits/:id for now as It can be shown in /habits itself
## What do I build FIRST ? 
 1) first I need to create all the pages and include each route in App.jsx
 
 2) I will first work on the landing page and putting in some dummy data for now while the log in and sign up buttons lead to their specific routes and also since it does not need setting up of Firebase and protected Routes
 4) then I will work on setting up of Firebase in this project
 5) after set up I will work on Authentication where when a person signs up his credentials and an Id are added and stored the database
 6) login will just fetch the credentials from the database and compare it with the stored information in the database 
 7) when a user logs in /habits will fetch the habits stored for that specific user and display it on the screen 
 8) when a user creates a new habit from /habits/new a new habit is added in the database under that specific userId
## Habits Data Format
    userId: 
    title: 
    description:
    days: 
    isChecked:
    streak: 
