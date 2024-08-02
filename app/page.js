'use client'

import { useState, useEffect } from 'react'
import { Box, Container, Typography, Button, Modal, TextField, Paper, IconButton, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import ImageScannerComponent from './ImageScannerComponent'

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}))

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}))

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }
  
  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleItemsDetected = (detectedItems) => {
    detectedItems.forEach(item => addItem(item));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
        Inventory Management System
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add New Item
        </Button>
        <ImageScannerComponent onItemsDetected={handleItemsDetected} />
      </Box>

      {inventory.map(({ name, quantity }) => (
        <StyledPaper key={name} elevation={1}>
          <Typography variant="h6" component="h2">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography variant="body1" sx={{ mr: 2 }}>
              Quantity: {quantity}
            </Typography>
            <Tooltip title="Remove one">
              <IconButton onClick={() => removeItem(name)} color="error" size="small">
                <RemoveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add one">
              <IconButton onClick={() => addItem(name)} color="success" size="small">
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </StyledPaper>
      ))}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
      >
        <ModalContent>
          <Typography id="modal-title" variant="h6" component="h2">
            Add New Item
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Item Name"
            type="text"
            fullWidth
            variant="outlined"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => {
              if (itemName.trim()) {
                addItem(itemName.trim())
                setItemName('')
                handleClose()
              }
            }}
          >
            Add Item
          </Button>
        </ModalContent>
      </Modal>
    </Container>
  )
}