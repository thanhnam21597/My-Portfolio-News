import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import logo from "../Assets/LOGO1.PNG";
import Button from "react-bootstrap/Button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CgGitFork } from "react-icons/cg";
import { ImBlog } from "react-icons/im";
import {
  AiFillStar,
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineUser,
} from "react-icons/ai";

import { CgFileDocument } from "react-icons/cg";

function NavBar() {
  const [expand, updateExpanded] = useState(false);
  const [navColour, updateNavbar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  function scrollHandler() {
    if (window.scrollY >= 20) {
      updateNavbar(true);
    } else {
      updateNavbar(false);
    }
  }

  window.addEventListener("scroll", scrollHandler);

  return (
    <Navbar
      expanded={expand}
      fixed="top"
      expand="md"
      className={navColour ? "sticky" : "navbar"}
    >
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center brand-mmo">
         
          <div className="navbar-brand-text">
            <span>MMO</span>
            <small>Thực Chiến</small>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => {
            updateExpanded(expand ? false : "expanded");
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto" defaultActiveKey="#home">
            <Nav.Item>
              <Nav.Link as={Link} to="/" onClick={() => updateExpanded(false)}>
                <AiOutlineHome style={{ marginBottom: "2px" }} /> Trang chủ
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/news"
                onClick={() => updateExpanded(false)}
              >
                <AiOutlineUser style={{ marginBottom: "2px" }} /> Tin tức
              </Nav.Link>
            </Nav.Item>

           

            <NavDropdown
              title={
                <>
                  <AiOutlineFundProjectionScreen
                    style={{ marginBottom: "2px" }}
                  />{" "}
                  Dự án
                </>
              }
              id="basic-nav-dropdown"
              onClick={() => updateExpanded(false)}
            >
              <NavDropdown.Item as={Link} to="/InfoProject/airdrop">
                Airdrop
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/InfoProject/testnet">
                Testnet
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/resume"
                onClick={() => updateExpanded(false)}
              >
                <CgFileDocument style={{ marginBottom: "2px" }} /> Resume
              </Nav.Link>
            </Nav.Item>

            {!currentUser ? (
              <Nav.Item>
                <Button
                  variant="outline-light"
                  onClick={() => {
                    navigate("/login", { state: { from: location } });
                    updateExpanded(false);
                  }}
                  style={{ marginLeft: "0.9rem", marginTop: "0.6rem" }}
                >
                  Đăng nhập
                </Button>
              </Nav.Item>
            ) : (
              <>
                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    to="/post"
                    onClick={() => updateExpanded(false)}
                  >
                    <ImBlog style={{ marginBottom: "2px" }} /> Đăng tin
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Button
                    variant="outline-warning"
                    onClick={async () => {
                      await logout();
                      navigate("/");
                    }}
                    style={{ marginLeft: "0.9rem", marginTop: "0.6rem" }}
                  >
                    Logout
                  </Button>
                </Nav.Item>
              </>
            )}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
