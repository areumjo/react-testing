# react-testing

## Git submodule bug
```
$ git rm --cached jest
$ git submodule update --init
```

# Redux
## Actions
- Actions are payloads of information that send data from your app to your store.
- Actions are the only source of information for the store.
- You send them to the store using `store.dispatch()`
```js
// action types
const ADD_TODO = 'ADD_TODO';
// action - in a real app, generate a unique ID for index every time something new is created 
{ 
    type: ADD_TODO,
    text: 'Learn Redux',
    index: 5 
}
```

- Actions are plain JS objects.
- Actions must have a `type` property that indicates the type of action being performed.
    - types should be defined as string constants.


## Action Creators
- Action creators are functions that create actions -- return a action.
```js
// action creators
function addTodo(text) {
    return {
        type: ADD_TODO,
        text
    }
}
// pass the action creator to the dispatch() function
dispatch(addTodo(text))
dispatch(completeTodo(index))
// alternatively, you can create a bound acountion creator
const boundAddTodo = text => dispatch(addTodo(text))
const boundCompleteTodo = index => dispatch(completeTodo(index))
```

## Reducers
- Reducers specify how the application's state changes in response to actions sent to the store.
- `Actions` only describe *what happened*, but not *how the application's state changes*

### Designing the state shape
- All the app state is stored as a single object.
    - good to think of the state shape before writing any code ==> Q. What's the minimal representation of your app's state as an object?
    - often need to store some data, some UI state.
    - keep every entity in an object stored with an ID as a key, and use IDs to reference it from other entities, or lists. 
    - think of the app's state as a database. 
1. Reducer should not mutate the `state`.
    - create a copy of the state with `Object.assign()`.
    - must supply an empty object as the first parameter `{...state, ...newState }`
2. Return the previous state in the `default` case.
```js
function todoApp(state = initialState, action) {
    switch(action.type) {
        case SET_VISIBILITY_FILTER:
            return Object.assign({}, state, {
                visibilityFilter: action.filter
            })
        case ADD_TODO:
            return Object.assign({}, state, {
                todos: [ // new todos == old todos concatenated with a single new item at the end
                    ...state.todos,
                    { 
                        text: action.text,
                        completed: false
                    }
                ]
            })
        case TOGGLE_TODO:
            return Object.assign({}, state, {
                todos: state.todos.map((todo, index) => {
                if (index === action.index) {
                    return Object.assign({}, todo, {
                    completed: !todo.completed
                    })
                }
                return todo
                })
            })
        default:
            return state
    }
}
```

## Store
- Store is the object that brings actions and reducers together.
    - holds application state
    - allows access to state via `getState()`
    - allows state to be updated via `dispatch(action)`
    - registers listeners and handles unregistering of listeners via `subscribe(listener)`
- Only have a single store in a Redux application
```js
import { createStore } from 'redux'
import todoApp from './reducers'
const store = createStore(todoApp)
```

### Dispatching actions
- 
```js
import {
    addTodo,
    toggleTodo,
    setVisibilityFilter,
    VisibilityFilters
} from './actions';

console.log(store.getState()); // Log the initial state

// Every time the state changes, log it -- note that subscribe() returns a function for unregistering the listener
const unsubscribe = store.subscribe(() => console.log(store.getState()))

// Dispatch some actions
store.dispatch(addTodo('Learn about actions'))
store.dispatch(addTodo('Learn about reducers'))
store.dispatch(addTodo('Learn about store'))
store.dispatch(toggleTodo(0))
store.dispatch(toggleTodo(1))
store.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED))

unsubscribe() // Stop listening to state updates
```

## Data flow
- Strict unidirectional data flow : all data in an app follows the same lifecycle pattern


# React-Redux
## `connect`
- Extracting data with `mapStateToProps`
    - called every time the store state changes
    - receives the entire store state, should return an object of data this component needs
- In React-Redux, components never access the store directly => `connect` does it. 

## 1. `mapStateToProps(state, ownProps)`
- 1st argument passed in to `connect`
- Defined as a function
    - take a first argument called `state`, optionally a second argument called `ownProps`
    - return a plain object containing the data that the connected component needs
    - if you don't want to subscribe to the store, pass `null` || `undefined` to `connect` in place of `mapStateToProps`
1. `state`
    - the entire Redux store state (same value as `store.getState()`)
    ```js
    function mapStateToProps(state) {
        const { todos } = state;
        return { todoList: todos.allIds }
    }
    ```
2. `ownProps` (optional)
    - when your component needs the data from its own props to retrieve data from the store
    - contain all of the props given to the wrapper component
    ```js
    function mapStateToProps(state, ownProps) {
        const { visibilityFilter } = state
        const { id } = ownProps
        const todo = getTodoById(state, id)
        
        return { todo, visibilityFilter }
    }
    // Later, in your application, a parent component renders:
    <ConnectedTodo id={123} />
    // and the component receives props.id, props.todo, and props.visibilityFilter
    ```
- `return`
    - should return a plain object that contains the data the component needs
        - each field in the object will become a `prop` for the actual component
        - the values in the fields will be used to detemine if your component needs to re-render
    ```js
    function mapStateToProps(state) {
        return {
            a: 42,
            todos: state.todos,
            filter: state.visibilityFilter
        }
    } // the connected component will recevie props.a, props.todos, and props.filter
    ```
- `mapStateToProps` should be *fast*
    - whenever the store changes, all of the `mapState` functions will run ==> slow mapState function can be a potential bottleneck
    - re-shaping data : transform data such as filtering an array, mapping an array of IDs to corresponding objects, or extracting plain JS value  <== these tranformations are expensive (for faster performance, ensure these are only run if the input values have changed)
- `mapStateToProps` should be `pure` and synchronous
    - pure function like reducer
    - should not be used to trigger asynchronous behavior like ajax calls from data fetching
- Only return new object if needed
    - Many common operations result in new object or array references being created:
        - Creating new arrays with `map()` or `filter()`
        - Merging arrays with `array.concat`
        - Selecting portion of an array with `array.slice`
        - Copying values with `Object.assign`
        - Copying values with the spread operator `{ ...oldState, ...newData }`

## 2. `mapDispatchToProps`
- 2nd argument passed in to `coonect`
- Dispatch actions to the store
- `dispatch`
    - a function of the Redux store : call `store.dispatch()` for components to dispatch an action
- 1) (by default) a connected component receives `props.dispatch`: can dispatch actions itself <= dispatch as a Prop
```js
function Counter({ count, dispatch }) {
    return (
        <div>
            <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
            <span>{count}</span>
            <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
            <button onClick={() => dispatch({ type: 'RESET' })}>reset</button>
        </div>
    )
}
```
- 2) `connect` can accept an argument called `mapDispatchToProps` : let you create functions that dispatch when called and passes those functions as props to the component
    - can specify which actions the component might need to dispatch
        - if you define your own `mapDispatchToProps`, the connected component will no longer receive `dispatch`
    - let you provide action dispatching functions as props
    - you can pass doen action dispatching logic to (unconnected) child component

### Defining `mapDispatchToProps` as a function
- The most flexibility in customizing the functions
- Gain access to `dispatch` and `ownProps`
- `dispatch`
    - return new function that call `dispatch()` inside themselves,
    - 1) pass in a `plain action object` directly
        ```js
        const mapDispatchToProps = dispatch => {
            return {
                increment: () => dispatch({ type: 'INCREMENT' }),
                decrement: () => dispatch({ type: 'DECREMENT' }),
                reset: () => dispatch({ type: 'RESET' })
            }
        }
        ```
    - 2) pass in the result of an action creator
        ```js
        const mapDispatchToProps = dispatch => {
            return {
                // explicitly forwarding arguments
                onClick: event => dispatch(trackClick(event)),
                // implicitly forwarding arguments
                onReceiveImpressions: (...impressions) =>
                    dispatch(trackImpressions(impressions))
            }
        }
- `return`
    - should return a plain object
    ```js
    const increment = () => ({ type: 'INCREMENT' })
    const decrement = () => ({ type: 'DECREMENT' })
    const reset = () => ({ type: 'RESET' })

    const mapDispatchToProps = dispatch => {
        return {
            // dispatching actions returned by action creators
            increment: () => dispatch(increment()),
            decrement: () => dispatch(decrement()),
            reset: () => dispatch(reset())
        }
    }
    function Counter({ count, increment, decrement, reset }) {
        return (
            <div>
                <button onClick={decrement}>-</button>
                <span>{count}</span>
                <button onClick={increment}>+</button>
                <button onClick={reset}>reset</button>
            </div>
        )
    }
    ```
- Use `mapDispatchToProps` without `mapStateToProps` in Redux
    - skip the first parameter by passing `undefined`, or `null`
    ```js
    connect(null, mapDispatchToProps)(Component);
    ```
    