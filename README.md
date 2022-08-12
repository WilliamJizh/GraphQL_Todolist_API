# GraphQL Todolist
A Todolist app using GraghQL + Apollo + NodeJS<br/>
Used JSON Web Tokens for session authorization and Bcrypt for password hashing<br/>
Since there is no database setup required, all data are stored in a dummy database `data.json`

## Getting started
Start the Apollo playground by running the command: `npm run devStart`</br>
The playground will be avaliable at: `http://localhost:4000/graphql`

##  Brief introduction
- `signUp` mutation: Creating user.
- `logIn` mutation: obtain access token from validating user credentials.
- `todoList` query is publicly available and does not require access token. </br>
Filters like category, title and description could be applied in any combination.
- `addTodo`, `editTodo` and `deleteTodo` will require access token and `editTodo` and `deleteTodo` could only perform by the original todo owner.

## Examples

Some basic query and mutations are listed below</br>
For more details, please reference the Schema and Docs section avaliable in the playground.</br>

- User sign up
```
mutation{
  signUp(email:"emailaddress",password:"123"){
  message   
  }
 }
 ```

- User log in
```
mutation{
   logIn(email:"emailaddress",password:"123"){
   token
   }
 }
 ```

- Query todolist based on filters
 ```
 query{
  todoList(category:"sed do" title: "tempor incididunt " description: "labore et dolore magna aliqua"){
    nodes{
      id
    }
  }
}
 ```
 
 - Add todo
 ```
 mutation{
  addTodo(
    category: "sed do",
    title: "tempor incididunt ",
    description: "labore et dolore magna aliqua",
    token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTY2MDI4NjI1NDgyMCwiaWF0IjoxNjYwMzI4Mjk0fQ.cgFuuXQcNpEANSGQvgUTyf79OHL3Hf0fRWf1XmPSyus"){
    id
    category
    title
    description
  }
}
 ```
 
 - Edit todo
 ```
 mutation{
  editTodo(
    id:"1660331059331"
    category:"abcd"
    title:"def"
    description:"ghi"
    token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTY2MDI4NjI1NDgyMCwiaWF0IjoxNjYwMzI4Mjk0fQ.cgFuuXQcNpEANSGQvgUTyf79OHL3Hf0fRWf1XmPSyus"){
    todo{
      id
      category
      title
      description
    }
    error
  }
}
 ```
 
 - Delete todo
 ```
 mutation{
  deleteTodo(
    id:"1660331059331"
    token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTY2MDI4NjI1NDgyMCwiaWF0IjoxNjYwMzI4Mjk0fQ.cgFuuXQcNpEANSGQvgUTyf79OHL3Hf0fRWf1XmPSyus"){
    message
    error
  }
}
 ```
 
