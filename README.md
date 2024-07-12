# Taskboard - a web app to manage your task

Live: https://taskboard.bnurd.com
Alternative: https://taskboard-five.vercel.app/

## Brief Explanation
I feel really comfortable using Trello because of its easy-to-use features and it has a great user experience. Inspired by Trello, a task management app that I often use, I decided to create a similar app by removing features that I don't need and adding some features that I do.

### Must Have
1. A feature that can add a list and a card, I call them list and task.
    - This feature is a must-have for any to-do list or task management app, as it is the main feature where you can add multiple lists and tasks.
2. Of course the main feature is drag & drop task/card.
    - This feature makes it easy for me when I want to move a task, for example moving a task that has been completed.
3. Add a description to a card.
    - Of course, a task must have a description to explain the purpose, summary or details of the task, so that there are no mistakes when doing it.
4. Feature to add the due date of tasks.
    - Essential to have, namely the deadline of a task, because it is a reminder of when I have to complete the task.

### Nice-to-have
1. Features to import & export task data
    - This application use localstorage as data storage because this application is shown to use personally, therefore maybe I need a feature to import and export data.
2. Faature that you can add checklists for specific card.
    - Sometimes in a task we can break it into several parts to be worked on alternately, therefore, this feature may be useful for that case.
3. The calendar that show all tasks that have due date.
    - When tasks have piled up, it will be difficult to see the details of the date, therefore this calendar feature is needed as a visual form of tasks so that it is easier when you want to see tasks and task deadlines.

### Unnecessary
1. Signin and Signup feature.
    - Honestly, I don't like this feature only for the todo list application. I think it would be more efficient if the todo list application only used browser storage as data storage.
2. Member of task
    - Trello has a feature that allows multiple members to be included in a specific task. I don't think I need that feature because this app is only suitable for personal task management.

## Documentation
### Running the application
**Setup project**
```bash
# using npm
npm install

# using yatn 
yarn install
```
**Running development**
```bash
# using npm
npm run dev

# using yatn 
yarn dev
```
**Build production**
```bash
# using npm
npm run build

# using yatn 
yarn build
```
**Running the build result (preview)**
```bash
# using npm
npm run preview

# using yatn 
yarn preview
```

### Folder Structure
```
> .nuxt
> assets
> components
> helpers
> layouts
> pages
> public
> repositories
> server
> store
> types
.gitignore
app.config.ts
app.vue
nuxt.config.ts
tailwind.config.js
tsconfig.json
```
1. .nuxt: This is a development directory that contains auto-generated files and compiled code.
2. assets: This directory is used to store uncompiled assets such as stylesheets, images, or fonts. Then, the build tool will process it.
3. components: This is where you put all your Vue components.
4. helpers: This folder is for utility functions or helper files that can be used throughout project. It can contain JavaScript or TypeScript files with common functions.
5. layouts: The directory that nuxt provides to extract common UI patterns into reusable layouts
6. pages: This is where you define the routes of your application. Each .vue file in this directory automatically becomes a route.
7. public: Static files that don't need processing when build. Files in this directory are served at the URL.
8. Repositores: This folder is used for storing code related to data fetching and handling data logic. In this application, this folder is used for data communication between the application and storage (localstorage).
9. server: This directory is used for server-side code such as API routes
10. store: This directory contains state management files (pinia in this app).
11. types: This folder is used to store TypeScript type definitions.
12. .gitignore: Specifies intentionally untracked files to ignore that git should ignore.
13. app.config.ts:  This is a configuration file where you can set global settings for your Nuxt application. Example: NuxtUI theme settings.
14. app.vue: This is the root component of Nuxt/Vue application
15. tailwind.config.js: Configuration file for Tailwind CSS.
16. tsconfig.json: This is the TypeScript configuration file.

### Features in the application
**1. Create a List**
![Create a list!](https://i.ibb.co.com/sFkcCmv/image.png)

**2. Create the Task in a List**
![Create the task!](https://i.ibb.co.com/rsPrg7P/image.png)

**3. Edit/Remove the task**
![Edit/Remove the task!](https://i.ibb.co.com/N6sjRtZ/image.png)

**4. The detail of task**
![The detail of task!](https://i.ibb.co.com/Hd8c2Rb/image.png)

**5. Add the description to task**
![Add the description!](https://i.ibb.co.com/nC1HCpc/image.png)

**6. Create the Checklist**
![Create the checklist!](https://i.ibb.co.com/8Y6bPc1/image.png)

**7. Add due date of the task**
![add due date!](https://i.ibb.co.com/DQQHBcv/image.png)

**8. Export data to JSON**
![export data!](https://i.ibb.co.com/3NBN6xH/image.png)

**9. Import from JSON file**
![Import data!](https://i.ibb.co.com/4fJn41W/image.png)

**10. Calendar**
![Calendar!](https://i.ibb.co.com/yfHPmsh/image.png)

## Credits
- Nuxtjs (https://nuxt.com)
- NuxtUI (https://ui.nuxt.com)
- Tailwindcss (https://tailwindcss.com)
- Pinia (https://pinia.vuejs.org)
- vcalendar (https://vcalendar.io)
- fullcalendar (https://fullcalendar.io)
- vuedraggable (https://github.com/SortableJS/vue.draggable.next)
