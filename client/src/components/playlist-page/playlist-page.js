import Accordion from "react-bootstrap/Accordion";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import ListGroup from "react-bootstrap/ListGroup";
import "./playlist-page.css";

//Can nest accordions
function PlaylistSection() {
  return (
    <Accordion className ="PlaylistHolder" defaultActiveKey={['0']} alwaysOpen>
      <Accordion.Item eventKey="0" >
        <Accordion.Header>Playlists</Accordion.Header>
        <AccordionBody>
        <ListGroup>
          <ListGroup.Item>Item 1</ListGroup.Item>
          <ListGroup.Item>Item 2</ListGroup.Item>
          <ListGroup.Item>Item 3</ListGroup.Item>
          <ListGroup.Item>Item 4</ListGroup.Item>
          <ListGroup.Item>Item 5</ListGroup.Item>
        </ListGroup>
        </AccordionBody>
      </Accordion.Item>
    </Accordion>
  );
}

export default PlaylistSection;
