import React from 'react';
import { useLocation, Route, Routes } from 'react-router-dom';
import Header from '../Layout/Header';
import Users from './Users';
import Connections from './Connections';
import styled from 'styled-components';
import { FaUser, FaKey, FaBan } from 'react-icons/fa'; // Icons for blockchain-inspired look

const DashboardContainer = styled.div`
  display: flex;
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* Allow cards to wrap if the screen is narrow */
  gap: 20px; /* Space between cards */
  margin-top: 20px;
`;

const Card = styled.div`
  background: linear-gradient(135deg, rgba(59,115,147,255) 0%, rgba(217,125,93,255) 100%); /* Gradient background */
  padding: 10px;
  border-radius: 15px;
  color: #ffffff; /* White text */
  width: 30%;
  text-align: center;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2); /* Stronger shadow for depth */

  h5 {
    color: #ffffff; /* Keep the title color white */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }

  p {
    margin-top: 10px;
    font-size: 1.2rem;
  }

  svg {
    margin-right: 10px;
    font-size: 1.8rem; /* Slightly larger for emphasis */
  }
`;

function Dashboard() {
  const location = useLocation();

  // Conditionally hide the CardContainer when on 'users' or 'connections' routes
  const showCards = !location.pathname.includes('/dashboard/users') && !location.pathname.includes('/dashboard/connections');

  return (
    <DashboardContainer>
      {/* <Sidebars /> */}
      <MainContent>
        <Header />
        {showCards && (
          <CardContainer>
            <Card>
              <h5><FaUser /> Users</h5>
              <p>Number of Users</p>
            </Card>
            <Card>
              <h5><FaKey /> Credentials</h5>
              <p>Number of Credentials</p>
            </Card>
            <Card>
              <h5><FaBan /> Revoked</h5>
              <p>Number of Revoked</p>
            </Card>
          </CardContainer>
        )}
        <Routes>
          <Route path="users" element={<Users />} />
          <Route path="connections" element={<Connections />} />
        </Routes>
      </MainContent>
    </DashboardContainer>
  );
}

export default Dashboard;
