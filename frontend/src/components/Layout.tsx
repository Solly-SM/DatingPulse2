import React, { useState } from 'react';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ 
          width: { md: SIDEBAR_WIDTH }, 
          flexShrink: { md: 0 } 
        }}
      >
        {/* Mobile sidebar */}
        {isMobile && (
          <Sidebar
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
          />
        )}
        {/* Desktop sidebar */}
        {!isMobile && (
          <Sidebar variant="permanent" />
        )}
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          height: '100vh',
          backgroundColor: theme.palette.background.default,
          overflow: 'auto',
        }}
      >
        {/* Mobile menu button */}
        {isMobile && (
          <Box sx={{ p: 2 }}>
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(233, 30, 99, 0.04)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}
        
        {/* Page content */}
        <Box sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;