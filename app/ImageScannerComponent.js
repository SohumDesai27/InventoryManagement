import React, { useState, useRef } from 'react';
import { Button, Modal, Box, Typography, CircularProgress } from '@mui/material';
import { Camera } from 'react-camera-pro';

const ImageScannerComponent = ({ onItemsDetected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const camera = useRef(null);
  
  const captureImage = async () => {
    if (camera.current) {
      setIsProcessing(true);
      const photo = camera.current.takePhoto();
      await processImage(photo);
      setIsProcessing(false);
      setIsOpen(false);
    }
  };

  const processImage = async (imageData) => {
    try {
      // Convert base64 image to raw binary data
      const base64Data = imageData.split(',')[1];
      const binaryData = atob(base64Data);
      const uint8Array = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }

      // Prepare the request to Google Cloud Vision API
      const response = await fetch('/api/detect-objects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: Array.from(uint8Array) }),
      });

      if (!response.ok) {
        throw new Error('Failed to process image');
      }

      const data = await response.json();
      const detectedItems = data.responses[0].localizedObjectAnnotations.map(obj => obj.name);
      onItemsDetected(detectedItems);
    } catch (error) {
      console.error('Error processing image:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <>
      <Button variant="contained" onClick={() => setIsOpen(true)}>
        Scan Items
      </Button>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Scan Items
          </Typography>
          <Camera ref={camera} aspectRatio={16 / 9} />
          <Button 
            onClick={captureImage} 
            variant="contained" 
            sx={{ mt: 2 }}
            disabled={isProcessing}
          >
            {isProcessing ? <CircularProgress size={24} /> : 'Capture and Process'}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ImageScannerComponent;