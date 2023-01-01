import Accordion from "react-bootstrap/Accordion";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import ListGroup from "react-bootstrap/ListGroup";

function PlaylistSection() {
  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Playlists</Accordion.Header>
        <AccordionBody>
        <ListGroup>
          <ListGroup.Item>Cras justo odio</ListGroup.Item>
          <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
          <ListGroup.Item>Morbi leo risus</ListGroup.Item>
          <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
          <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
        </ListGroup>
        </AccordionBody>

      </Accordion.Item>
    </Accordion>
  );
}

export default PlaylistSection;
