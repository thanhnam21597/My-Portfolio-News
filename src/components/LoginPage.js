import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const { login, signup, currentUser, requestPasswordReset } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/post";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      navigate(from, { replace: true });
    }
  }, [currentUser, from, navigate]);

  const redirectAfterAuth = () => {
    navigate(from, { replace: true });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      redirectAfterAuth();
    } catch (err) {
      setError(err.message || "Lỗi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Vui lòng điền email và mật khẩu.");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      setLoading(false);
      return;
    }

    try {
      const newUsername = username.trim() || email.split("@")[0];
      await signup({ email, username: newUsername }, password);
      redirectAfterAuth();
    } catch (err) {
      setError(err.message || "Lỗi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setForgotMessage("");
    setResetLink("");

    if (!email) {
      setError("Vui lòng nhập email để lấy lại mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      const { token } = await requestPasswordReset(email);
      const link = `${window.location.origin}/reset-password?token=${encodeURIComponent(token)}`;
      setResetLink(link);
      setForgotMessage("Đã tạo link xác nhận đổi mật khẩu. Vui lòng mở link bên dưới để tiếp tục.");
    } catch (err) {
      setError(err.message || "Không thể đặt lại mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5" style={{ minHeight: "80vh" }}>
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="mb-4 text-center">Đăng nhập</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {forgotMessage && <Alert variant="success">{forgotMessage}</Alert>}
          {resetLink && (
            <Alert variant="info">
              Link xác nhận:{" "}
              <a href={resetLink} target="_blank" rel="noreferrer">
                {resetLink}
              </a>
            </Alert>
          )}

          <Form onSubmit={handleLogin}>
           

            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập Email của bạn"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                className="auth-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập Mật khẩu"
                required
              />
            </Form.Group>

            <Button type="submit" className="w-100 mb-2" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>

            <Button variant="link" className="mb-2 p-0" onClick={handleForgotPassword} disabled={loading}>
              Quên mật khẩu?
            </Button>

            <Button
              variant="secondary"
              className="w-100 mb-3"
              type="button"
              disabled={loading}
              onClick={handleSignup}
            >
              Tạo tài khoản
            </Button>
          </Form>

          <div className="text-center">
            <Link to="/">Quay về trang chủ</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
