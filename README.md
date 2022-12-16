# GoalKit

This project was built project with [`Create React App`](https://create-react-app.dev/) and [`TypeScript`](https://www.typescriptlang.org/)

**An online project management tool that makes users work more collaboratively and get more done**. GoalKit provides multiple types of tools including boards, lists, cards and charts that enable users to organize and prioritize their projects in an efficient, flexible and rewarding way.

## Demo link

> ### [Demo](https://goalkit-phi.vercel.app/)
>
> Demo account: demo@email.com\
> Demo password: qqqqqq

## Features

- [x] Instant co-editing
- [x] Instant massaging
- [x] Drag and drop
- [x] Updated multiple different types of information
- [x] Visualized data as chart
- [x] Online status
- [x] Authentication and private router
- [x] Handled nested and immutable data
- [x] Styled-Components

### `Instant co-editing`

Fulfilled instant co-editing with [`onSnapshot API`](https://firebase.google.com/docs/firestore/query-data/listen) and solved conflict problems of instant co-editing

### `Instant massaging`

Fulfilled instant messaging feature between multiple users

### `Drag and drop`

Implemented creating lists and cards feature, allowed users to edit position and order by `drag and drop` with [`React Beautiful DnD`](https://www.npmjs.com/package/react-beautiful-dnd)

### `Updated multiple different types of information`

Handled updating multiple different types of information about task cards including date, tags, owners, todo lists and progress status by `useReducer`

### `Visualized data as chart`

Visualized task card information data as `Gantt charts`, `progress pie charts` and `distribution bar charts` with third-party libraries ([`gantt-task-react`](https://www.npmjs.com/package/gantt-task-react) , [`recharts`](https://www.npmjs.com/package/recharts))

### `Online status`

Used [`Realtime Database`](https://firebase.google.com/docs/database) and [`Cloud Functions`](https://firebase.google.com/docs/functions) for user online status management

### `Authentication and private router`

Applied React and [`React Router`](https://reactrouter.com/en/main) for SPA and private route, and used [Firestore](https://firebase.google.com/docs/firestore) for data management

### `Handled nested and immutable data`

Handled nested and immutable data by [`immer`](https://immerjs.github.io/immer/)

### `Styled-Components`

Implemented layout with [`Styled-Components`](https://styled-components.com/)

![GoalKit_DnD_demo](https://user-images.githubusercontent.com/96833101/208070909-7be399cb-f6ce-42ea-a66d-5fa9079b04f9.gif)

## Function Map

<img width="1786" alt="GoalKit" src="https://user-images.githubusercontent.com/96833101/207826943-ea6315c8-37a3-464f-aa76-01c526e2376d.png">

## Structure Diagram

<img width="800" alt="Structure Diagram" src="https://user-images.githubusercontent.com/96833101/207832175-7dd42700-2ed4-49f4-b97c-66240ea2f41c.png">
