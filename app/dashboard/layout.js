'use client';
import Notification from '@/components/notification';
import { Box, Tab, Tabs } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';

const MainLayout = ({ children }) => {
  const [value, setValue] = useState(parseInt(localStorage.getItem('menu_selected')) || 0);

  const handleClick = (newValue) => {
    setValue(newValue);
    localStorage.setItem('menu_selected', newValue);
  };

  return (
    <>
      <Notification />
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs value={value} centered>
          <Link href="/dashboard" onClick={() => handleClick(0)}>
            <Tab label="Home" />
          </Link>
          <Link href="/dashboard/admin" onClick={() => handleClick(1)}>
            <Tab label="Admin" />
          </Link>
          <Link href="/dashboard/category" onClick={() => handleClick(2)}>
            <Tab label="Category" />
          </Link>
          <Link href="/dashboard/product" onClick={() => handleClick(3)}>
            <Tab label="Product" />
          </Link>
          <Link href="/dashboard/transaction" onClick={() => handleClick(4)}>
            <Tab label="Transaction" />
          </Link>
        </Tabs>
      </Box>
      <Box marginTop={5} marginX={5}>
        {children}
      </Box>
    </>
  );
};

export default MainLayout;
