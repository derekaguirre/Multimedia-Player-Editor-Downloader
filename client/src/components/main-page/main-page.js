import Button from "react-bootstrap/Button";
// import PlaylistSection from "../playlist-page/playlist-page";
import NavBar from "../nav-bar/Navbar";
import PlayList from "../playlist-page/offcanvas-playlist";
import "./song-page.css";

function SongPage() {
  return (
    <>

    {/* NavBar for all the pages */}
      <div className="PlaylistDropdown">
        <container className="NavSection">
          <NavBar />
        </container>
      </div>

      {/* Song List*/}
      {/* <Button variant="primary">Primary</Button>{" "}
      <Button variant="secondary">Secondary</Button>{" "}
      <Button variant="success">Success</Button>{" "}
      <Button variant="warning">Warning</Button>{" "}
      <Button variant="danger">Danger</Button>{" "}
      <Button variant="info">Info</Button>{" "}
      <Button variant="light">Light</Button>{" "}
      <Button variant="dark">Dark</Button>
      <Button variant="link">Link</Button> */}
    </>
  );
}

export default SongPage;
