import './App.css';
import ReadExel from './components/ReadExel';
import { Box } from '@mui/material';

function App() {
  return (
      <Box 
        sx={{
          padding: 10,
          display: "flex", 
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center", 
        }}
      >
        <ReadExel/>
      </Box>
  );
}

export default App;
