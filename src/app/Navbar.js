
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Navbar = ({ pantries, currentPantry, onSelectPantry, onAddPantry }) => {
  return (
    <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Pantry Manager
        </Typography>
        {pantries.map(pantry => (
          <Button
            key={pantry}
            color={currentPantry === pantry ? 'secondary' : 'inherit'}
            onClick={() => onSelectPantry(pantry)}
          >
            {pantry}
          </Button>
        ))}
        <IconButton color="inherit" onClick={onAddPantry}>
          <AddCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

