console.log("JavaScript file successfully loaded!");

// UserRegistration Component Definition
const UserRegistration = () => {
    console.log("UserRegistration Component Loaded!");

    const [users, setUsers] = React.useState([]);
    const [username, setUsername] = React.useState('');
    const [role, setRole] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [message, setMessage] = React.useState('');

    const handleCreateUser = async () => {
        try {
            const newUser = { username, role, firstName, lastName, email, password };
            await axios.post('http://localhost:5000/api/user/create', newUser);
            setMessage('User created successfully!');
            resetForm();
        } catch (error) {
            setMessage('User creation failed!');
        }
    };

    const resetForm = () => {
        setUsername('');
        setRole('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="user-registration">
            <h1>User Registration</h1>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="Role" />
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" />
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleCreateUser}>Create User</button>
            {message && <div className="message">{message}</div>}
        </div>
    );
};

// Rendering the component
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <UserRegistration />
    </React.StrictMode>
);
