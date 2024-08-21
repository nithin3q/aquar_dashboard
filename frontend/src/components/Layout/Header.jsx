import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  background-color: #f8f9fa; /* Light background for the header */
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0; /* Light border to match theme */
`;

const Title = styled.h2`
  color: #007bff; /* Bright blue for title */
  margin: 0; /* Remove default margin */
`;

function Header() {
  return (
    <HeaderContainer>
      <Title>Dashboard</Title>
      {/* Add any additional header elements here */}
    </HeaderContainer>
  );
}

export default Header;
