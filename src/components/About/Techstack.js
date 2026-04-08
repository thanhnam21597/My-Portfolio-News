import React from "react";
import { Col, Row } from "react-bootstrap";
import { SiNextdotjs, SiSolidity } from "react-icons/si";

import nft from "../../Assets/TechIcons/nft-icon1.png";
import connection from "../../Assets/TechIcons/connection1.svg";

import Data from "../../Assets/TechIcons/data1.svg";

import Solidity from "../../Assets/TechIcons/solidity-code-file-icon1.png";


import Git from "../../Assets/TechIcons/Fundamental Research.png";



import MUI from "../../Assets/TechIcons/MUI.png";



function Techstack() {
  return (
    <Row className="about-skill-grid" style={{ paddingBottom: "50px" }}>
      <Col xs={6} md={4} lg={2} className="tech-icons">
        <img src={Data} alt="data" />
        <div className="tech-icons-text">Research Strategy</div>
      </Col>


      <Col xs={6} md={4} lg={2} className="tech-icons">
        <img src={nft} alt="nft" />
        <div className="tech-icons-text">Data-Driven Analysis</div>
      </Col>
      <Col xs={6} md={4} lg={2} className="tech-icons">
        <img src={Solidity} alt="solidity" />
        <div className="tech-icons-text">Technical Analysis</div>
      </Col>
      <Col xs={6} md={4} lg={2} className="tech-icons">
        <img src={Git} alt="git" />
        <div className="tech-icons-text">Fundamental Research</div>
      </Col>

      <Col xs={6} md={4} lg={2} className="tech-icons">
        <img src={MUI} alt="mui" />
        <div className="tech-icons-text">Risk Management</div>
      </Col>

      <Col xs={6} md={4} lg={2} className="tech-icons">
        <img src={connection} alt="connection" />
        <div className="tech-icons-text"> Web3 Monitoring</div>
      </Col>
      



     
    </Row>
  );
}

export default Techstack;
