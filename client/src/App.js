import {useState, useEffect, useContext} from 'react';
import { Login } from './Login';
import { AccountContext } from './AccountProvider';
import {GoogleLogout} from 'react-google-login'


const API_BASE = 'https://todos-jainakshat.herokuapp.com';
const clientId = "758184751451-m05lfil43vbgafu97ra6ble9f2v1q7dd.apps.googleusercontent.com";



function App() {
    const[todos, setTodos] = useState([]);
    const [popupActive, setPopupActive] = useState(false);
    const [newTodo, setNewTodo] = useState("");
    const {user, setUser} = useContext(AccountContext);


    useEffect(() =>{
        GetTodos();
    },[todos, user])

    const GetTodos = () =>{
        if(!user)return;
         fetch(API_BASE + "/todos/"+user.googleId)
            
            .then(res => res.json())
            .then(data =>setTodos(data))
            .catch(err => console.error("Error: ", err))
    }

    const completeTodo = async(id) =>{
        const data  = await fetch(API_BASE + "/todo/complete/" + id)
        .then(res => res.json())

        setTodos(todos => todos.map(todo => {
            if(todo._id === data.id){
                todo.complete = data.complete;
            }
            return todo;
        }));
    }

    const deleteTodo = async(id) =>{
        const data  = await fetch(API_BASE + "/todo/delete/" + id, {method: "DELETE"})
        .then(res => res.json())

        setTodos(todos => todos.filter(todo => todo._id !== data._id));

    }

    const addTodo = async() =>{
        const data = await fetch(API_BASE+ "/todo/new",{
            method: "POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                googleId: user.googleId,
                text: newTodo
            })
        }).then(res => res.json())
        
        setTodos([...todos, data]);
        setPopupActive(false);
        setNewTodo("");
    }
    const onLogoutSuccess = () =>{
        alert("You have been logged out successfully.")
        console.clear();
        setUser('');
        setTodos([]);
    }

	return(
        <>
        { user ? 
		<div className="App">
            <div>Welcome,</div>
            <div className="header">
                <h1>{user.name} </h1>
                
                <GoogleLogout
                    clientId={clientId}
                    buttonText="Logout"
                    onLogoutSuccess={onLogoutSuccess}
                    className='logout'
                    >

                    </GoogleLogout>
            </div>
            <div className="container">
                <div></div>
                <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>
                </div>
			
            <h4>Your Tasks</h4>
            {todos.length === 0 ? <h5>Add New Tasks using + button.</h5>: ""}
            <div className="todos">
                {todos.map(todo =>(
                    <div className={"todo "+ (todo.complete ? "is-complete": "")} key={todo._id} onClick={() => completeTodo(todo._id)}>
                    <div className="checkbox"></div>
                    <div className="text">{todo.text}</div>
                    <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>x</div>
                </div>
                ))}  
            </div>
            
            

            {
                popupActive ? (
                    <div className="popup">
                        <div className="closePopup" onClick={() => setPopupActive(false)}>x</div>
                        <div className="content">
                            <h3>Add Task</h3>
                            <input  type="text" 
                                    className='add-todo-input' 
                                    onChange={e =>setNewTodo(e.target.value)}
                                    value={newTodo}
                            />
                            <div className="button" onClick={addTodo}>Create Task</div>
                        </div>
                    </div>
                ): ''
            }
		</div> : <Login /> 
        }
        </>
	);
    
}

export default App;