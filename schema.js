const { gql } = require("apollo-server-express");

const typeDefs = gql`
type Todo {
    id:String
    userId:String
    category:String
    title:String
    description:String
}

type User {
    id: String
    email: String
    passwordHash: String
}

type TodoList {
    nodes:[Todo]
}

type TodoEditionResponse{
    
    todo:Todo

    error: String
}

type TodoDeletionResponse{
    
    message : String

    error: String
}

type LogInResponse {

    token: String

    error: String

}

type SignUpResponse {

    message: String

    error: String

}

type Query {

    todoList(category:String, title:String, description:String): TodoList

    todo(id: String): Todo

    user(id: String): User

    users: [User]

}

type Mutation {
    addTodo(category:String,title:String,description:String,token:String!):Todo
    editTodo(id:String!,category:String,title:String,description:String,token:String!):TodoEditionResponse
    deleteTodo(id:String!,token:String!):TodoDeletionResponse
    signUp(email: String, password: String): SignUpResponse
    logIn(email: String, password: String): LogInResponse
}

`;

module.exports = typeDefs;