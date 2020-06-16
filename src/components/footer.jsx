import React from "react";
import { MDBContainer, MDBFooter } from "mdbreact";

const FooterPage = () => {
  return (
    <MDBFooter color="red" className="font-small pt-4 mt-4">
      <div className="footer-copyright text-center py-3">
        <MDBContainer fluid>
          &copy; {new Date().getFullYear()} Copyright:{" "}
          <a href="#"> Nicholas Wang </a>
        </MDBContainer>
        <MDBContainer fluid>pls hire me</MDBContainer>
      </div>
    </MDBFooter>
  );
};

export default FooterPage;
