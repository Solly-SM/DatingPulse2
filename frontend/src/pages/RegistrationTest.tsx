import React, { useState } from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import RegistrationModal from '../components/RegistrationModal';

function RegistrationTest() {
  const [showModal, setShowModal] = useState(false);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Registration Modal Test
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          This page is for testing the new popup registration flow
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          onClick={() => setShowModal(true)}
          sx={{ mb: 2 }}
        >
          Test Registration Modal
        </Button>
      </Box>

      <RegistrationModal 
        open={showModal}
        onClose={() => setShowModal(false)}
        email="test@example.com"
      />
    </Container>
  );
}

export default RegistrationTest;