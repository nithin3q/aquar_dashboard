import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import KeyIcon from "@mui/icons-material/Key";
import RestorePageIcon from "@mui/icons-material/RestorePage";
import LockResetIcon from "@mui/icons-material/LockReset";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { tokens } from "../../theme";
import image from '../../assets/images/aquar.png'

const Item = ({ title, to, icon, isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      style={{
        color: colors.grey[100],
      }}
      icon={icon}
    >
      {!isCollapsed && <Typography>{title}</Typography>}
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: "#ffffff",
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMIN
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* USER PROFILE */}
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={image}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Ed Roh
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  VP Fancy Admin
                </Typography>
              </Box>
            </Box>
          )}

          {/* MENU ITEMS */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              icon={<HomeOutlinedIcon />}
              to="/dashboard"
              isCollapsed={isCollapsed}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Users"
              icon={<PeopleOutlinedIcon />}
              to="/users"
              isCollapsed={isCollapsed}
            />
            <Item
              title="Connections"
              icon={<SensorOccupiedIcon />}
              to="/connections"
              isCollapsed={isCollapsed}
            />
            <Item
              title="Credentials"
              icon={<KeyIcon />}
              to="/credentials"
              isCollapsed={isCollapsed}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Logs
            </Typography>
            <Item
              title="Audit logs"
              icon={<RestorePageIcon />}
              to="/audit-logs"
              isCollapsed={isCollapsed}
            />
            <Item
              title="User Login Logs"
              icon={<LockResetIcon />}
              to="/login-logs"
              isCollapsed={isCollapsed}
            />

            {/* LOGOUT BUTTON */}
            <Box
              display="flex"
              justifyContent={isCollapsed ? "center" : "center"}
              mt="20px"
            >
              <Button
                variant="contained"
                color="secondary"
                startIcon={<PowerSettingsNewIcon />}
                onClick={handleLogout}
                sx={{
                  margin: isCollapsed ? "0 auto" : "0px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: isCollapsed ? "fit-content" : "50%",
                  paddingLeft: isCollapsed ? "25px" : "16px",
                }}
              >
                {!isCollapsed && "Logout"}
              </Button>
            </Box>

            {/* <Box display="flex" justifyContent="center" mt="20px">
              <Button
                variant="contained"
                color="secondary"
                startIcon={<PowerSettingsNewIcon />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box> */}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
