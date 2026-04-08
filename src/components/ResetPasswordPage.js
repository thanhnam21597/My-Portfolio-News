import React, { useMemo, useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    setLoading(true);
    try {
      await resetPassword({ token, oldPassword, newPassword, confirmPassword });
      setSuccess("Đã đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.message || "Không thể đổi mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Container className="py-5" style={{ minHeight: "80vh" }}>
        <Row className="justify-content-center">
          <Col md={6}>
            <Alert variant="danger">Liên kết xác nhận không hợp lệ.</Alert>
            <div className="text-center">
              <Link to="/login">Quay lại đăng nhập</Link>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ minHeight: "80vh" }}>
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="mb-4 text-center">Đổi mật khẩu</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="oldPassword">
              <Form.Label>Mật khẩu cũ</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Nhập mật khẩu cũ"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmNewPassword">
              <Form.Label>Nhập lại mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                required
              />
            </Form.Group>

            <Button type="submit" className="w-100" disabled={loading}>
              {loading ? "Đang xử lý..." : "Xác nhận đổi mật khẩu"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <Link to="/login">Quay lại đăng nhập</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ResetPasswordPage;
