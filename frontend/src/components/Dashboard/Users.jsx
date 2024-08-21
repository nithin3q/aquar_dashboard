import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Modal, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { tokens } from "../../theme";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [users, setUsers] = useState([]);
  const [openCreate, setOpenCreate] = useState(false); 
  const [openEdit, setOpenEdit] = useState(false); 
  const [openDelete, setOpenDelete] = useState(false); 
  const [selectedUser, setSelectedUser] = useState(null); 
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [deleteError, setDeleteError] = useState(''); // Initialize deleteError state

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:5000/api/users');
    setUsers(response.data.map((user, index) => ({
      ...user,
      id: index + 1, // Use a sequential index for the DataGrid id
    })));
  };

  const handleCreateUser = async () => {
    if (newUser.name && newUser.email) {
      await axios.post('http://localhost:5000/api/users', newUser);
      fetchUsers(); // Refresh the user list
      handleCloseCreate(); // Close the modal
      setNewUser({ name: '', email: '' }); // Reset the form
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleEditUser = async () => {
    if (selectedUser && selectedUser.name && selectedUser.email) {
      await axios.put(`http://localhost:5000/api/users/${selectedUser._id}`, selectedUser);
      fetchUsers(); // Refresh the user list
      handleCloseEdit(); // Close the modal
      setSelectedUser(null); // Reset selected user
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${selectedUser._id}`);
      fetchUsers(); // Refresh the user list
      handleCloseDelete(); // Close the modal
      setSelectedUser(null);
    } catch (err) {
      setDeleteError(err.response?.data?.error || 'Error deleting user'); // Set the deleteError state on error
    }
  };

  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => setOpenCreate(false);

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);

  const handleOpenDelete = (user) => {
    setSelectedUser(user);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setDeleteError(''); // Clear the deleteError state when closing the modal
  };

  const columns = [
    { field: "id", headerName: "Index", width: 150 }, // Use Index here
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Personal Email",
      flex: 1,
    },
    {
      field: "workemail",
      headerName: "Work Email",
      flex: 1,
    },
    {
      field: "createdon",
      headerName: "Created On",
      flex: 1,
      valueGetter: (params) => new Date(params.row.createdon).toLocaleDateString(),
      
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={() => handleOpenEdit(params.row)}>Edit</Button>
          <Button variant="contained" color="secondary" onClick={() => handleOpenDelete(params.row)}>Delete</Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Typography variant="h4">Users</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenCreate}>
          <PersonAddIcon/> &nbsp; Create User
        </Button>
      </Box>

      <Box m="40px 0 0 0" height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}>
        <DataGrid 
          checkboxSelection 
          rows={users} // Use the modified users array with the index as id
          columns={columns} 
        />
      </Box>

      {/* Create User Modal */}
      <Modal open={openCreate} onClose={handleCloseCreate}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Typography variant="h6">Create New User</Typography>
          <Box mt={2}>
            <TextField label="Name" fullWidth margin="normal" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            <TextField label="Personal Email" fullWidth margin="normal" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            <TextField label="Work Email" fullWidth margin="normal" value={newUser.workemail} onChange={(e) => setNewUser({ ...newUser, workemail: e.target.value })} />
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleCreateUser}>Create</Button>
            <Button variant="outlined" color="secondary" onClick={handleCloseCreate}>Cancel</Button>
          </Box>
        </Box>
      </Modal>

      {/* Edit User Modal */}
      <Modal open={openEdit} onClose={handleCloseEdit}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Typography variant="h6">Edit User</Typography>
          <Box mt={2}>
            <TextField label="Name" fullWidth margin="normal" value={selectedUser?.name || ''} onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })} />
            <TextField label="Personal Email" fullWidth margin="normal" value={selectedUser?.email || ''} onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} />
            <TextField label="Work Email" fullWidth margin="normal" value={selectedUser?.workemail || ''} onChange={(e) => setSelectedUser({ ...selectedUser, workemail: e.target.value })} />
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleEditUser}>Save</Button>
            <Button variant="outlined" color="secondary" onClick={handleCloseEdit}>Cancel</Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete User Modal */}
      <Modal open={openDelete} onClose={handleCloseDelete}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6">Delete User</Typography>
          <Typography mt={2}>Are you sure you want to delete this user?</Typography>
          {deleteError && (
            <Typography mt={2} color="error">
              {deleteError}
            </Typography>
          )}
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDeleteUser}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCloseDelete}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Users;
