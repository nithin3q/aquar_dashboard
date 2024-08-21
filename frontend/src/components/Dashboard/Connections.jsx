import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Modal, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { tokens } from "../../theme";
import QRCode from 'qrcode.react';
import GroupAddIcon from '@mui/icons-material/GroupAdd';


const Connections = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [connections, setConnections] = useState([]);
  const [invitationUrl, setInvitationUrl] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchConnections();
  }, []);

  useEffect(() => {
    if (isPolling) {
      const intervalId = setInterval(() => {
        fetchConnectionRecord(connections[connections.length - 1]?.connectionId);
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [isPolling, connections]);

  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:5000/api/users');
    setUsers(response.data);
  };

  const fetchConnections = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/connections');
      setConnections(response.data.map((conn, index) => ({
        id: index + 1,  // Start index from 1
        connectionId: conn.connectionId,
        user: conn.user,
        status: conn.status,
        invitationUrl: conn.invitationUrl,
      })));
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };
  
  const createConnection = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/connections', {
        userId: selectedUser._id,
      });

      setInvitationUrl(response.data.invitationUrl);
      setIsPolling(true);
      setConnections([...connections, { id: response.data._id, connectionId: response.data.connectionId, user: selectedUser, status: 'Invitation Sent' }]);
    } catch (error) {
      console.error('Error creating connection:', error);
    }
  };

  const fetchConnectionRecord = async (connectionId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/connections/${connectionId}`);
      const status = response.data.status || 'Unknown';

      if (status === 'active') {
        setConnectionStatus('Connection Established');
        updateConnectionStatus(connectionId, status);
        setIsPolling(false);
        setTimeout(() => {
          handleCloseCreate();
        }, 2000);
      } else {
        setConnectionStatus(status);
        updateConnectionStatus(connectionId, status);
      }
    } catch (error) {
      console.error('Error fetching connection record:', error);
    }
  };

  const issueCredential = async (connectionId, userEmail) => {
    try {
      await axios.post('https://issuer.aquarlabs.works:5004/issue-credential/send', {
        auto_remove: false,
        comment: "First Issue credential",
        connection_id: connectionId,
        cred_def_id: "9H6cxPB47UsgPzEqpJ81Vh:3:CL:1672912:Aquar-ID",
        credential_proposal: {
          "@type": "https://didcomm.org/issue-credential/1.0/credential-preview",
          "attributes": [
            {
              "name": "email",
              "value": userEmail
            }
          ]
        },
        issuer_did: "9H6cxPB47UsgPzEqpJ81Vh",
        schema_id: "9H6cxPB47UsgPzEqpJ81Vh:2:Aquar-ID:1.0",
        schema_issuer_did: "9H6cxPB47UsgPzEqpJ81Vh",
        schema_name: "Aquar-ID",
        schema_version: "1.0",
        trace: "true"
      }, {
        headers: {
          'accept': 'application/json',
          'X-API-KEY': 'ripcntsoon',
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error issuing credential:', error);
    }
  };

  const updateConnectionStatus = (connectionId, status) => {
    setConnections(connections.map(conn => conn.connectionId === connectionId ? { ...conn, status } : conn));
  };

  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => {
    setOpenCreate(false);
    resetConnectionForm();
  };

  const resetConnectionForm = () => {
    setSelectedUser(null);
    setConnectionStatus('');
    setInvitationUrl('');
    setIsPolling(false);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { 
      field: "connectionId", 
      headerName: "Connection ID", 
      width: 250 
    },
    {
      field: "user",
      headerName: "User",
      flex: 1,
      valueGetter: (params) => params.row.user.name,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={() => issueCredential(params.row.connectionId, params.row.user.email)}>Issue Credential</Button>
        </Box>
      ),
    },
  ];
  

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Typography variant="h4">Connections</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenCreate}>
          <GroupAddIcon /> &nbsp; Create Connection
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
          rows={connections.map((connection, index) => ({ ...connection, id: connection.id || index }))} 
          columns={columns} 
        />
      </Box>

      {/* Create Connection Modal */}
      <Modal open={openCreate} onClose={handleCloseCreate}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Typography variant="h6">Create Connection</Typography>
          <Box mt={2}>
            <TextField
              select
              label="Select User"
              value={selectedUser?.name || ''}
              onChange={(e) => setSelectedUser(users.find(user => user.name === e.target.value))}
              SelectProps={{
                native: true,
              }}
              fullWidth
              margin="normal"
            >
              <option value="" />
              {users.map((user) => (
                <option key={user._id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </TextField>
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={createConnection}>Create</Button>
            <Button variant="outlined" color="secondary" onClick={handleCloseCreate}>Cancel</Button>
          </Box>
          {invitationUrl && (
            <Box mt={2}>
              <Typography variant="body1">Scan the QR code to accept the invitation:</Typography>
              <Box display="flex" justifyContent="center" mt={2}>
                <QRCode value={invitationUrl} size={256} includeMargin={true} />
              </Box>
            </Box>
          )}
          {connectionStatus && (
            <Typography mt={2} variant="body2" color="textSecondary">
              Connection Status: {connectionStatus}
            </Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Connections;
