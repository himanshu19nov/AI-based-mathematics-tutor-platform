import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/UserRegistration.css';

const UserRegistration = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
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
  const [userStatus, setUserStatus] = useState('active');
  const [mode, setMode] = useState('create');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState('');
  const [studentToAssign, setStudentToAssign] = useState('');
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [userAssignments, setUserAssignments] = useState({});
  const [userExists, setUserExists] = useState(false);



  const academicOptions = [
    'Kindergarten', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5',
    'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12'
  ];

  useEffect(() => {
    // Reset message whenever the mode changes
    setMessage('');
  }, [mode]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const loadParents = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/users/`);
      // const parentUsers = response.data.users.filter(u => u.role === 'parent');
      const parentUsers = response.data.filter(u => u.role === 'parent'); 
      setParents(parentUsers);
    } catch (error) {
      setMessage('Failed to load parents!');
    }
  };
  
  useEffect(() => {
    if (mode === 'assign') {
      loadParents();
      setAssignedStudents([]);
      setStudentToAssign('');
      setSelectedParent('');
    }

    if (mode === 'search') {
      setUsername('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setRole('');
    }

  }, [mode]);

  useEffect(() => {
    if (selectedParent) {
      fetchAssignedStudents(selectedParent);
    }
  }, [selectedParent]);
  

  const fetchUsers = async () => {
    try {
      // const response = await axios.get('http://localhost:8000/api/user/listAll');
      const response = await axios.get(`${apiUrl}/api/users/`);
      const fetchedUsers = response.data.users || [];
      setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
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
    setUserStatus('active');
  };

  const handleAcademicLevelChange = (level) => {
    setAcademicLevel(prev =>
      prev.includes(level) ? prev.filter(item => item !== level) : [...prev, level]
    );
  };

  const handleCreateUser = async () => {
    try {
      const newUser = { username, email, firstName, lastName, password, role, academicLevel, userStatus };
      // await axios.post('http://localhost:8000/api/user/create/', newUser);
      await axios.post(`${apiUrl}/api/user/create/`, newUser);
      setMessage('User created successfully!');
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
      // await axios.put(`http://localhost:8000/api/user/update/${username}`, updatedUser);
      await axios.put(`${apiUrl}/api/user/update/${username}/`, updatedUser);
      setMessage('User modified successfully!');
      fetchUsers();
      resetForm();
    } catch (error) {
      setMessage(error.response?.data?.message || 'User modification failed!');
    }
  };

  const handleFetchUser = async () => {
    try {
      // const response = await axios.get(`http://localhost:8000/api/user/getUser/${username}`);
      const response = await axios.get(`${apiUrl}/api/user/getUser/${username}`);
      const user = response.data.user;
      if (user) {
        setRole(user.role);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        // Safer parsing for academicLevel
      let academic = user.academicLevel;

      if (typeof academic === 'string') {
        // Parse comma-separated string into array
        setAcademicLevel(academic.split(',').map(level => level.trim()));
      } else {
        setAcademicLevel([]);
      }


      // try {
      //   // If it's a stringified JSON array
      //   if (typeof academic === 'string') {
      //     academic = JSON.parse(academic);
      //   }

      //   // Clean strings inside the array
      //   if (Array.isArray(academic)) {
      //     academic = academic.map(item => {
      //       if (typeof item === 'string') {
      //         return item.replace(/[\[\]'"\\]/g, '').trim();
      //       }
      //       return item;
      //     });
      //   }

      //   setAcademicLevel(Array.isArray(academic) ? academic : []);
      // } catch (e) {
      //   // Fallback if anything fails during parsing
      //   setAcademicLevel([]);
      // }

      setUserStatus(user.userStatus);
      setUserExists(true); 
      setMessage('User data loaded successfully!');
    } else {
      setUserExists(false); 
      setMessage("Username doesn't exist");
    }
  } catch (error) {
    setUserExists(false); 
    setMessage("Username doesn't exist");
  }
};

//   const handleSearch = async () => {
//     try {
//       // const response = await axios.get(`http://localhost:8000/api/user/search?query=${searchQuery}`);
//       const response = await axios.get(`${apiUrl}/api/user/search?query=${searchQuery}`);
//       const userList = response.data.users;
//       setUsers(userList);

//       const assignments = {};
//       for (const user of userList) {
//         if (user.role === 'parent') {
//           try {
//             const res = await axios.get(`${apiUrl}/api/parent/${user.username}/students/`);
//             assignments[user.username] = res.data.students.map(s => s.username).join(', ');
//           }   catch {
//             assignments[user.username] = '';
//           }
//       }
//     }

//     setUserAssignments(assignments);
//   } catch (error) {
//     setMessage('Search failed!');
//   }
// };

const handleSearch = async () => {
  try {
    const params = new URLSearchParams();

    if (username) params.append('username', username);
    if (firstName) params.append('first_name', firstName);
    if (lastName) params.append('last_name', lastName);
    if (email) params.append('email', email);
    if (role) params.append('role', role);

    const response = await axios.get(`${apiUrl}/api/user/search?${params.toString()}`);
    const userList = response.data.users;
    setUsers(userList);

    const assignments = {};
    for (const user of userList) {
      if (user.role === 'parent') {
        try {
          const res = await axios.get(`${apiUrl}/api/parent/${user.username}/students/`);
          assignments[user.username] = res.data.students.map(s => s.username).join(', ');
        } catch {
          assignments[user.username] = '';
        }
      }
    }

    setUserAssignments(assignments);
  } catch (error) {
    setMessage('Search failed!');
  }
};

  const fetchAssignedStudents = async (parentUsername) => {
    try {
      const response = await axios.get(`${apiUrl}/api/parent/${parentUsername}/students/`);
      setAssignedStudents(response.data.students);
    } catch (error) {
      setAssignedStudents([]);
    }
  };

  const handleAssignStudent = async () => {
    if (!selectedParent || !studentToAssign) {
      setMessage('Please select parent and enter student username.');
      return;
    }
  
    try {
      // Assign student
      await axios.post(`${apiUrl}/api/parent/${selectedParent}/assign/`, {
        student_username: studentToAssign
      });
  
      setMessage('Student assigned!');
      setStudentToAssign('');
      fetchAssignedStudents(selectedParent);
  
      // 🔁 Refresh userAssignments so table updates immediately
      try {
        const res = await axios.get(`${apiUrl}/api/parent/${selectedParent}/students/`);
        const updatedStudents = res.data.students.map(s => s.username).join(', ');
        setUserAssignments(prevAssignments => ({
          ...prevAssignments,
          [selectedParent]: updatedStudents
        }));
      } catch (error) {
        setUserAssignments(prevAssignments => ({
          ...prevAssignments,
          [selectedParent]: ''
        }));
      }
  
    } catch (error) {
      setMessage('Failed to assign student!');
    }
  };
  

  const handleRemoveStudent = async (studentUsername) => {
    try {
      await axios.delete(`${apiUrl}/api/parent/${selectedParent}/remove/${studentUsername}/`);
      setMessage('Student removed!');
      fetchAssignedStudents(selectedParent);
    } catch (error) {
      setMessage('Failed to remove student!');
    }
  };
  

  return (
    <div className="user-registration">
      <div className="mode-toggle">
        <button onClick={() => setMode('create')} className={`mode-button ${mode === 'create' ? 'active' : ''}`}>Create User</button>
        <button onClick={() => setMode('modify')} className={`mode-button ${mode === 'modify' ? 'active' : ''}`}>Modify User</button>
        <button onClick={() => setMode('search')} className={`mode-button ${mode === 'search' ? 'active' : ''}`}>Search</button>
        <button onClick={() => setMode('assign')} className={`mode-button ${mode === 'assign' ? 'active' : ''}`}>Assign Students</button>
      </div>

      {mode === 'create' && (
        <div className="form-container">
          <div className="form-field">
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          </div>
          <div className="form-field">
            <label>Role</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="">Select Role</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
            </select>
          </div>
          <div className="form-field">
            <label>First Name</label>
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" />
          </div>
          <div className="form-field">
            <label>Last Name</label>
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          </div>

          <div className="checkbox-group">
            <label><strong>Academic Level:</strong></label>
            {academicOptions.map(level => (
              <label key={level}>
                <input type="checkbox" checked={academicLevel.includes(level)}
                  onChange={() => handleAcademicLevelChange(level)} /> {level}
              </label>
            ))}
          </div>
          <button className="submit-button" onClick={handleCreateUser}>Create User</button>
        </div>
      )}

      {mode === 'modify' && (
        <div className="form-container">
          <div className="form-field">
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          </div>
          <button className="submit-button" onClick={handleFetchUser}>Select</button>

          {userExists && (
            <>
              <div className="form-field">
                <label>Role</label>
                <select value={role} onChange={e => setRole(e.target.value)}>
                  <option value="">Select Role</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                  <option value="parent">Parent</option>
                </select>
              </div>
              <div className="form-field">
                <label>First Name</label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" />
              </div>
              <div className="form-field">
                <label>Last Name</label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" />
              </div>

              <div className="checkbox-group">
                <label><strong>Academic Level:</strong></label>
                {academicOptions.map(level => (
                  <label key={level}>
                    <input type="checkbox" checked={academicLevel.includes(level)}
                      onChange={() => handleAcademicLevelChange(level)} /> {level}
                  </label>
                ))}
              </div>

              <div className="password-reset-group">
                <label>Password Reset:</label>
                <div className="radio-group">
                  <label><input type="radio" value="yes" checked={passwordReset === 'yes'} onChange={() => setPasswordReset('yes')} /> Yes</label>
                  <label><input type="radio" value="no" checked={passwordReset === 'no'} onChange={() => setPasswordReset('no')} /> No</label>
                </div>

                {passwordReset === 'yes' && (
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter New Password" className="new-password-input" />
                )}
              </div>

              <label>User Status:</label>
              <div className="radio-group">
                <label><input type="radio" value="active" checked={userStatus === 'active'} onChange={() => setUserStatus('active')} /> Active</label>
                <label><input type="radio" value="disable" checked={userStatus === 'disable'} onChange={() => setUserStatus('disable')} /> Disable</label>
              </div>

              <button className="submit-button" onClick={handleModifyUser}>Modify User</button>
            </>
          )}
        </div>
      )}

      {mode === 'search' && (

            <>
        <div className="search-fields">
          <input  placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input  placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
          <input  placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
          </select>
          <button className="search-button" onClick={handleSearch}>Search</button>
        </div>

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
                <th>Assigned Students</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                    {Array.isArray(user.academicLevel)
                    ? user.academicLevel.join(', ')
                    : typeof user.academicLevel === 'string'
                    ? user.academicLevel
                    : ''}
                    </td>
                    <td>{user.userStatus}</td>
                    <td>{user.role === 'parent' ? userAssignments[user.username] || '' : ''}</td>
                  </tr>
                  ))
                 ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </>
      )}

    {mode === 'assign' && (
      <div className="form-container">
        <div className="form-field">
          <label>Select Parent</label>
            <select className="select-parent" value={selectedParent} onChange={(e) => setSelectedParent(e.target.value)}>
            <option value="">-- Select Parent --</option>
              {parents.map((parent, idx) => (
              <option key={idx} value={parent.username}>{parent.username}</option>
            ))}
            </select>
        </div>

      {selectedParent && (
        <>
        <div className="form-field">
          <label>Assign Student Username</label>
          <input type="text" value={studentToAssign} onChange={(e) => setStudentToAssign(e.target.value)} placeholder="Enter student username" />
          <button className="assign-button" onClick={handleAssignStudent}>Assign Student</button>
        </div>

        <div className="assigned-students-container">
          <h3>Assigned Students:</h3>
          {/* <ul className="assigned-students">
            {assignedStudents.map((s, i) => (
              <li key={i}>
                {s.username} ({s.fullName})
                <button onClick={() => handleRemoveStudent(s.username)} style={{ marginLeft: '10px' }}>❌ Remove</button>
              </li>
          ))}
          </ul> */}
          <table className="assigned-students-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Full Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignedStudents.map((s, i) => (
                <tr key={i}>
                  <td>{s.username}</td>
                  <td>{s.fullName}</td>
                  <td>
                    <button className="search-button" onClick={() => handleRemoveStudent(s.username)}>❌ Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        </>
      )}
      </div>
)}


      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default UserRegistration;
