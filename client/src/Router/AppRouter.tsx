import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PlaylistMain from '../components/PlaylistPages/PlaylistMain';
// import SongList from "../components/PlaylistPages/music-table/MusicTable";

function AppRouter() {
  return (
  <BrowserRouter>
      <Routes>
      <Route path="/"  element={<PlaylistMain />}/>
      </Routes>
  </BrowserRouter>
  );
}
    
export default AppRouter;

//Can add animations to the page switching, refer to CBV7 code