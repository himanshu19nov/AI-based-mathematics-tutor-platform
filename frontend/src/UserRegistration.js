import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/UserRegistration.css';

const UserRegistration = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [academicLevel, setAcademicLevel] = useState([]);
  const [passwordReset, setPasswordReset] = useState('');
  const [userStatus, setUserStatus] = useState('enable');
  const [mode, setMode] = useState('create');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');

  const academicOptions = [
    'Kindergarten', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 
    'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12'
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user/listAll');
      setUsers(response.data.users);
    } catch (error) {
      setMessage('Failed to load users!');
    }
  };

  const resetForm = () => {
    setUsername('');
    setRole('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setNewPassword('');
    setAcademicLevel([]);
    setPasswordReset('');
    setUserStatus('enable');
  };

  const handleAcademicLevelChange = (level) => {
    setAcademicLevel(prev =>
      prev.includes(level) ? prev.filter(item => item !== level) : [...prev, level]
    );
  };

  const handleCreateUser = async () => {
    try {
      const newUser = { username, email, firstName, lastName, password, role, academicLevel, userStatus };
      await axios.post('http://localhost:8000/api/user/create/', newUser);
      setMessage('User created successfully!');
      // Log success in the console
      console.log('User created successfully!')
      fetchUsers();
      resetForm();
    } catch (error) {
      setMessage(error.response?.data?.message || 'User creation failed!');
    }
  };

  const handleModifyUser = async () => {
    try {
      const updatedUser = {
        role, firstName, lastName, email, academicLevel, userStatus,
        newPassword: passwordReset === 'yes' ? newPassword : undefined
      };
      await axios.put(`http://localhost:8000/api/user/update/${username}`, updatedUser);
      setMessage('User modified successfully!');
      fetchUsers();
      resetForm();
    } catch (error) {
      setMessage(error.response?.data?.message || 'User modification failed!');
    }
  };

  const handleFetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/user/getUser/${username}`);
      const user = response.data.user;
      if (user) {
        setRole(user.role);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setAcademicLevel(user.academicLevel);
        setUserStatus(user.userStatus);
        setMessage('User data loaded successfully!');
      } else {
        setMessage('Username doesn\'t exist');
      }
    } catch (error) {
      setMessage('Username doesn\'t exist');
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/user/search?query=${searchQuery}`);
      setUsers(response.data.users);
    } catch (error) {
      setMessage('Search failed!');
    }
  };

  return (
    <div className="user-registration">
      <div className="mode-toggle">
        <button onClick={() => setMode('create')} className={mode === 'create' ? 'active' : ''}>Create User</button>
        <button onClick={() => setMode('modify')} className={mode === 'modify' ? 'active' : ''}>Modify User</button>
        <button onClick={() => setMode('search')} className={mode === 'search' ? 'active' : ''}>Search</button>
      </div>

      {mode === 'create' && (
        <div className="form-container">
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="">Select Role</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
            <option value="parent">Parent</option>
          </select>
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" />
          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />

          <div className="checkbox-group">
            <label><strong>Academic Level:</strong></label>
            {academicOptions.map(level => (
              <label key={level}>
                <input type="checkbox" checked={academicLevel.includes(level)}
                  onChange={() => handleAcademicLevelChange(level)} /> {level}
              </label>
            ))}
          </div>
          <button onClick={handleCreateUser}>Create User</button>
        </div>
      )}

      {mode === 'modify' && (
        <div className="form-container">
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          <button onClick={handleFetchUser}>Select</button>

          {role && (
            <>
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="">Select Role</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
              </select>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" />
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" />

              <div className="checkbox-group">
                {academicOptions.map(level => (
                  <label key={level}>
                    <input type="checkbox" checked={academicLevel.includes(level)}
                      onChange={() => handleAcademicLevelChange(level)} /> {level}
                  </label>
                ))}
                </div>

              <div>
                <label>Password Reset:</label>
                <input type="radio" value="yes" checked={passwordReset === 'yes'} onChange={() => setPasswordReset('yes')} /> Yes
                <input type="radio" value="no" checked={passwordReset === 'no'} onChange={() => setPasswordReset('no')} /> No

                {passwordReset === 'yes' && (
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter New Password" />
                )}
              </div>

              <label>User Status:</label>
              <input type="radio" value="enable" checked={userStatus === 'enable'} onChange={() => setUserStatus('enable')} /> Enable
              <input type="radio" value="disable" checked={userStatus === 'disable'} onChange={() => setUserStatus('disable')} /> Disable

              <button onClick={handleModifyUser}>Modify User</button>
            </>
          )}
        </div>
      )}

      {mode === 'search' && (
        <div className="table-container">
          <table className="search-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Academic Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.academicLevel.join(', ')}</td>
                  <td>{user.userStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default UserRegistration;


/* This is the backend API version code, THE BEST version so far, all functional */