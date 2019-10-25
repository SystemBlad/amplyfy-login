import React, { useEffect, useReducer } from 'react'
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import API, { graphqlOperation } from '@aws-amplify/api'
import PubSub from '@aws-amplify/pubsub';
import { createUser } from './src/graphql/mutations';
import { listUsers } from './src/graphql/queries';
import { onCreateUser } from './src/graphql/subscriptions';
import Amplify, { Auth } from 'aws-amplify';


import config from './app/aws-exports'
API.configure(config)             // Configure Amplify
PubSub.configure(config)
Amplify.configure(config);

async function createNewTodo() {
  const todo = { name: "Test" , email: "test@test.com"}
  await API.graphql(graphqlOperation(createUser, { input: todo }))
}

const initialState = {todos:[]};
const reducer = (state, action) =>{
  switch(action.type){
    case 'QUERY':
      return {...state, todos:action.todos}
    case 'SUBSCRIPTION':
      return {...state, todos:[...state.todos, action.todo]}
    default:
      return state
  }
}

export default function App() {

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    getData()

    // const subscription = API.graphql(graphqlOperation(onCreateUser)).subscribe({
    //   next: (eventData) => {
    //     const todo = eventData.value.data.onCreateUser;
    //     console.log("todo", todo);
    //     dispatch({type:'SUBSCRIPTION', todo})
    //   }
    // })
    // return () => subscription.unsubscribe()


    let  username = "jaimelunaec@hotmail.com"
    let password = "test123123"
    let email = "jaimelunaec@hotmail.com"
    let phoneNumber = "+14325551212"
    let authCode = "269854"
    // rename variable to conform with Amplify Auth field phone attribute
    const phone_number = phoneNumber
    // Auth.signUp({
    //   username,
    //   password,
    //   attributes: { email, phone_number }
    // })
    //     .then(() => {
    //       console.log('sign up successful!')
    //       Alert.alert('Enter the confirmation code you received.')
    //     })
    //     .catch(err => {
    //       if (! err.message) {
    //         console.log('Error when signing up: ', err)
    //         Alert.alert('Error when signing up: ', err)
    //       } else {
    //         console.log('Error when signing up: ', err.message)
    //         Alert.alert('Error when signing up: ', err.message)
    //       }
    //     })

    // Auth.confirmSignUp(username, authCode)
    //     .then(() => {
    //       Alert.alert('Confirm sign up successful')
    //     })
    //     .catch(err => {
    //       if (! err.message) {
    //         console.log('Error when entering confirmation code: ', err)
    //         Alert.alert('Error when entering confirmation code: ', err)
    //       } else {
    //         console.log('Error when entering confirmation code: ', err.message)
    //         Alert.alert('Error when entering confirmation code: ', err.message)
    //       }
    //     })

    Auth.signIn(username, password)
        .then(user => {
          console.log('signing in user: ', user)
          Alert.alert('signing in success ')
        })
        .catch(err => {
          if (! err.message) {
            console.log('Error when signing in: ', err)
            Alert.alert('Error when signing in: ', err)
          } else {
            console.log('Error when signing in: ', err.message)
            Alert.alert('Error when signing in: ', err.message)
          }
        })


  }, [])




  async function getData() {
    const todoData = await API.graphql(graphqlOperation(listUsers))
    console.log("todoData", todoData);
    dispatch({type:'QUERY', todos: todoData.data.listUsers.items});
  }

  return (
      <View style={styles.container}>
        <Button onPress={createNewTodo} title='Create Todo' />
        { state.todos.map((todo, i) => <Text key={todo.id}>{todo.name} : {todo.email}</Text>) }
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
