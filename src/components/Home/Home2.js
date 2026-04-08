import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avartar.png";

import Tilt from "react-parallax-tilt";
import Techstack from "../About/Techstack";
import Toolstack from "../About/Toolstack";
import { ImPointRight } from "react-icons/im";
function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              Giới thiệu <span className="purple">bản thân</span> tôi
            </h1>

            <div className="home-about-body">
              <p className="about-intro-text">
                Chào anh em, mình là <span className="purple">Nathan Nam</span>, đến từ{" "}
                <span className="purple">TP.HCM</span>. Hiện tại mình làm{" "}
                <span className="purple">Research tại Biget</span>, tập trung vào Web3
                với các mảng DeFi, Layer 1/Layer 2, NFT và những xu hướng mới để xây
                dựng chiến lược giao dịch dựa trên dữ liệu.
              </p>

              <p className="about-skill-title">
                Mình có nền tảng chuyên sâu với các nhóm kỹ năng chính:
              </p>

              <ul className="about-skill-list">
                <li>
                  <span className="blue">
                    <ImPointRight /> Phân tích on-chain/off-chain và theo dõi các chỉ số cốt lõi.
                  </span>
                </li>
                <li>
                  <span className="blue">
                    <ImPointRight /> Technical Analysis: đọc biểu đồ và xác định vùng hỗ trợ/kháng cự.
                  </span>
                </li>
                <li>
                  <span className="blue">
                    <ImPointRight /> Fundamental Research: đánh giá dự án và tokenomics.
                  </span>
                </li>
                <li>
                  <span className="blue">
                    <ImPointRight /> Thành thạo TradingView, Dune, Nansen, Glassnode và Etherscan.
                  </span>
                </li>
              </ul>

              <p className="about-quote">
                "Hãy nỗ lực xây dựng những thứ tạo nên sự khác biệt!"
              </p>
            </div>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid" alt="avatar" />
            </Tilt>
          </Col>
          <Col
              md={7}
              style={{
                justifyContent: "center",
                paddingTop: "30px",
                paddingBottom: "50px",
              }}
            >
        </Col>
        <h1 className="project-heading">
            Kỹ năng <strong className="purple">Thông thạo </strong>
          </h1>
          <Techstack />
          

          <h1 className="project-heading">
            <strong className="purple">Công cụ </strong> Tôi sử dụng
          </h1>
          <Toolstack />

         

        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
