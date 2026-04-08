import React from "react";
import { Col, Row } from "react-bootstrap";

import chrome from "../../Assets/TechIcons/TradingView.svg";
import dune from "../../Assets/TechIcons/DuneAnalyst.png";
import Nansen from "../../Assets/TechIcons/nansen-ai.svg";
import Glassnode from "../../Assets/TechIcons/glassnode.png";

import Defilama from "../../Assets/TechIcons/defilama.svg";
function Toolstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
   
      <Col xs={4} md={2} className="tech-icons ">
        <a
          href="https://www.tradingview.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit", display: "block" }}
        >
          <img src={chrome} alt="TradingView" className="tech-icon-images" style={{ width: "100%", height: "100%" }} />
          <div className="tech-icons-text">Trading View</div>
        </a>
      </Col>
      
      <Col xs={4} md={2} className="tech-icons ">
        <a
          href="https://dune.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit", display: "block" }}
        >
          <img src={dune} alt="Dune Analytics" className="tech-icon-images" />
          <div className="tech-icons-text"> Dune Analytics </div>
        </a>
      </Col>
      <Col xs={4} md={2} className="tech-icons ">
        <a
          href="https://www.nansen.ai/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit", display: "block" }}
        >
          <img src={Nansen} alt="Nansen" className="tech-icon-images" />
          <div className="tech-icons-text">Nansen</div>
        </a>
      </Col>
      <Col xs={4} md={2} className="tech-icons ">
        <a
          href="https://glassnode.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit", display: "block" }}
        >
          <img src={Glassnode} alt="Glassnode" className="tech-icon-images" />
          <div className="tech-icons-text">Glassnode</div>
        </a>
      </Col>

      <Col xs={4} md={2} className="tech-icons ">
        <a
          href="https://defillama.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit", display: "block" }}
        >
          <img src={Defilama} alt="DefiLlama" className="tech-icon-images" />
          <div className="tech-icons-text"> Defilama</div>
        </a>
      </Col>
    </Row>
  );
}

export default Toolstack;
