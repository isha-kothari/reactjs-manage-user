import React, { useEffect, useState } from 'react';
import './manageUser.css';

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

const ManageUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [editUserId, setEditUserId] = useState<number | null>(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('https://dummyjson.com/users');
      const data = await response.json();
      setUsers(data.users);
    };
    fetchUsers();
  }, []);

  // Add/Edit user
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editUserId) {
      await fetch(`https://dummyjson.com/users/update/${editUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName }),
      });
      setUsers(users.map(user => 
        user.id === editUserId ? { ...user, firstName, lastName } : user
      ));
    } else {
      const response = await fetch('https://dummyjson.com/users/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName }),
      });
      const newUser = await response.json();
      setUsers([...users, newUser]);
    }
    setFirstName('');
    setLastName('');
    setEditUserId(null);
  };

  // Edit user
  const handleEdit = (user: User) => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEditUserId(user.id);
  };

  // Delete user
  const handleDelete = async (id: number) => {
    await fetch(`https://dummyjson.com/users/delete/${id}`, {
      method: 'DELETE',
    });
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className='App'>
      <h2>User CRUD Operations</h2>
      <form onSubmit={handleSubmit}>
      <input className='firstName'
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter first name"
          required
        />
        <input className='lastName'
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter last name"
          required
        />
        <button type="submit" className='button'>{editUserId ? 'Update' : 'Add'} User</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>User Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>
                <button onClick={() => handleEdit(user)} className='button'>Edit</button>
                <button onClick={() => handleDelete(user.id)} className='button'>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUser;
