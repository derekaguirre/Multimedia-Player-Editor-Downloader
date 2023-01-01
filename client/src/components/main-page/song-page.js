import Button from "react-bootstrap/Button";
// import PlaylistSection from "../playlist-page/playlist-page";
import NavBar from "../nav-bar/Navbar";
import PlaylistSection from "../playlist-page/playlist-page";
import "./song-page.css";

function SongPage() {
  return (
    <>
      <div className="PlaylistDropdown">
        <div className="PlaylistSection">
          <PlaylistSection />
        </div>
        <container className="NavSection">
          <NavBar />
        </container>
      </div>
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
