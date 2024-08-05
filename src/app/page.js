"use client";

import { useState, useEffect } from 'react';
import { Typography, Box, Modal, Button, Stack, TextField, IconButton, Grid } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Navbar from './Navbar';
import { firestore } from '../app/firebase'; 
import { collection, doc, setDoc, getDocs, addDoc, deleteDoc, query, where } from 'firebase/firestore';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: '#121212',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  color: '#e0e0e0'
};

function App() {
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [currentPantry, setCurrentPantry] = useState('Default Pantry');
  const [pantries, setPantries] = useState([]);
  const [inventory, setInventory] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Fetch pantries and inventory
  useEffect(() => {
    const fetchData = async () => {
      const pantriesCollection = collection(firestore, 'pantries');
      const pantriesSnapshot = await getDocs(pantriesCollection);
      const pantriesList = pantriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPantries(pantriesList.map(pantry => pantry.id));

      if (currentPantry) {
        const inventoryCollection = collection(firestore, 'pantries', currentPantry, 'inventory');
        const inventorySnapshot = await getDocs(inventoryCollection);
        setInventory(inventorySnapshot.docs.map(doc => doc.data()));
      }
    };

    fetchData();
  }, [currentPantry]);

  const addItem = async (name, quantity) => {
    const inventoryCollection = collection(firestore, 'pantries', currentPantry, 'inventory');
    await addDoc(inventoryCollection, { name, quantity });
    setItemName('');
    setItemQuantity(1);
    handleClose();
  };

  const removeItem = async (name) => {
    const inventoryCollection = collection(firestore, 'pantries', currentPantry, 'inventory');
    const q = query(inventoryCollection, where('name', '==', name));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  };

  const addPantry = async () => {
    const newPantryName = prompt("Enter the name of the new pantry:");
    if (newPantryName && !pantries.includes(newPantryName)) {
      await setDoc(doc(firestore, 'pantries', newPantryName), { name: newPantryName });
      setPantries([...pantries, newPantryName]);
      setCurrentPantry(newPantryName);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      bgcolor="#121212"
      color="#e0e0e0"
    >
      <Navbar
        pantries={pantries}
        currentPantry={currentPantry}
        onSelectPantry={setCurrentPantry}
        onAddPantry={addPantry}
      />
      <Box p={2} width="100%">
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
              Add Item to {currentPantry}
            </Typography>
            <Stack width="100%" spacing={2}>
              <TextField
                label="Item Name"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                InputLabelProps={{ style: { color: '#e0e0e0' } }}
                InputProps={{ style: { color: '#e0e0e0' } }}
              />
              <TextField
                label="Quantity"
                type="number"
                variant="outlined"
                fullWidth
                value={itemQuantity}
                onChange={e => setItemQuantity(Number(e.target.value))}
                InputLabelProps={{ style: { color: '#e0e0e0' } }}
                InputProps={{ style: { color: '#e0e0e0' } }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  addItem(itemName, itemQuantity);
                }}
              >
                Add Item
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={handleOpen}
        >
          Add New Item
        </Button>
        <Box border="1px solid #333" borderRadius={2} bgcolor="#1e1e1e" p={2} mt={2}>
          <Typography variant="h2" textAlign="center" color="#e0e0e0" mb={2}>
            {currentPantry} Inventory
          </Typography>
          <Grid container spacing={2}>
            {inventory.map(({ name, quantity }) => (
              <Grid item xs={12} sm={6} md={4} key={name}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  bgcolor="#2e2e2e"
                  p={2}
                  borderRadius={2}
                  minHeight="120px"
                >
                  <Box>
                    <Typography variant="h4" color="#e0e0e0">
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                    <Typography variant="h6" color="#9e9e9e">
                      Quantity: {quantity}
                    </Typography>
                  </Box>
                  <IconButton color="error" onClick={() => removeItem(name)}>
                    <RemoveCircleIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
