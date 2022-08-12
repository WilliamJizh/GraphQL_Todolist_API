const json = require("./data.json");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const saltRounds = 10;


const resolvers = {

    Query: {

        todoList(parent, args, context, info) {
            
            return {

                nodes: json.todos.filter(function(td){
                    for (var key in args){
                        if(td[key] === undefined || td[key] != args[key])
                            return false;
                    }
                    return true;
                })

            };

        },

        todo(parent, args, context, info) {

            const id = args.id;

            return json.todos.find((td) => (td.id == id));

        },

        user(parent, args, context, info) {

            const { id } = args;

            return json.users.find((user) => user.id == id);

        },

        users() {

            return json.users;

        },

    },

    Mutation: {
        addTodo(parent, args, context, info) {
            const { category, title, description ,token} = args;
                    
            //Verify jwt token
            var jwtToken = null;
            try{
                jwtToken = jwt.verify(token,'privatekey');
            } 
            catch(err){
                return{error:err}
            }
            const newTodo = {
                id: Date.now(),
                userId:jwtToken.id,
                category,
                title,
                description,
            };
            json.todos.push(newTodo);
            //Write to database
            fs.writeFileSync('./data.json', JSON.stringify(json));
            return newTodo;
        },
        
        editTodo(parent, args, context, info){
            const { id, category, title, description, token} = args;
                        
            //Verify jwt token
            var jwtToken = null;
            try{
                jwtToken = jwt.verify(token,'privatekey');
            } 
            catch(err){
                return{error:err}
            }
            if(!jwtToken){
                return{error:"Invalid session"}
            }
            
            //Verify user and todo
            const user = json.users.find((us) => us.id == jwtToken.id);
            if(!user){
                return {error:"User not found"}
            }
            const todoIndex =  json.todos.findIndex((td) => (td.id == id));
            if(todoIndex == undefined){
                return {error:"Todo not found"}
            }
            if(json.todos[todoIndex].userId != user.id){
                return {error:"Cannot edit todo from other users"}
            }
            
            // Modify todo as requested
            if(category){
                json.todos[todoIndex].category = category;
            }
            if(title){
                json.todos[todoIndex].title = title;
            }
            if(description){
                json.todos[todoIndex].description = description;
            }
            
            //Write to database
            fs.writeFileSync('./data.json', JSON.stringify(json));
            return {todo:json.todos[todoIndex]}
        },
        
        deleteTodo(parent, args, context, info){
            const { id, token} = args;

            //Verify jwt token
            var jwtToken = null;
            try{
                jwtToken = jwt.verify(token,'privatekey');
            } 
            catch(err){
                return{error:err}
            }
            if(!jwtToken){
                return{error:"Invalid session"}
            }
            
            //Verify user and todo
            const user = json.users.find((us) => us.id == jwtToken.id);
            if(!user){
                return {error:"User not found"}
            }
            const todoIndex =  json.todos.findIndex((td) => (td.id == id));
            if(todoIndex == undefined){
                return {error:"Todo not found"}
            }
            if(json.todos[todoIndex].userId != user.id){
                return {error:"Cannot delete todo from other users"}
            }
            
            // Delete todo
            json.todos.splice(todoIndex,1);
            //Write to database
            fs.writeFileSync('./data.json', JSON.stringify(json));
            return {message:"Successfully deleted"}

        },

        logIn(parent, args, context, info) {
            const { email, password } = args;
            const user = json.users.find(({ userEmial = email }) => userEmial == email);
            if (!user) {
                return { error: "User does not exist" }
            }
            else {
                // Using bcrypt for hash password comparsion
                const match = bcrypt.compareSync(password, user.passwordHash);
                if (match) {
                    // Return login token
                    const jwtToken = jwt.sign({ id: user.id },'privatekey');
                    return {token: jwtToken}
                }
                else {
                    return { error: "Wrong password" }
                }
            }
        },

        signUp(parent, args, context, info){
            const {email, password } = args;
            const user = json.users.find(({ userEmial = email }) => userEmial == email);
            if(user){
                return {error: "User already exist"}
            }
            else{
                // Using bcrypt to create hased password
                const hash = bcrypt.hashSync(password, saltRounds);
                // Create new user
                const newUser = {
                    id: Date.now(),
                    email,
                    passwordHash:hash
                };
                json.users.push(newUser);
                fs.writeFileSync('./data.json', JSON.stringify(json));
                
            }

            return {message: "Sussfully created user"}
        }


    }

};



module.exports = resolvers;