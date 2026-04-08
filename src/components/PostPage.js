import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { postService } from "../services/apiService";

function PostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(""); // Thêm state cho lựa chọn
  const [imageData, setImageData] = useState(""); // Lưu dữ liệu ảnh Base64
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImageData("");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageData(reader.result.toString());
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category) {
      setMessage({ type: "danger", text: "Vui lòng nhập tiêu đề, nội dung và chọn chuyên mục." });
      return;
    }
    setIsSubmitting(true);

    try {
      const newPost = {
        title: title.trim(),
        content: content.trim(),
        category,
        image: imageData || null,
      };

   
      
      const response = await postService.createPost(newPost);
      console.log('Post created successfully. Response:', response);

      setMessage({ type: "success", text: "Tạo bài đăng thành công!" });
      setTitle("");
      setContent("");
      setCategory("");
      setImageData("");

      // Định tuyến theo chuyên mục
      setTimeout(() => {
        if (category === "bat-dong-san") {
          navigate("/news");
        } else if (category === "do-dien-tu") {
          navigate("/InfoProject/airdrop");
        } else if (category === "xe-co") {
          navigate("/InfoProject/testnet");
        }
      }, 1000);
    } catch (error) {
      console.error('Error creating post:', error);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      let errorMsg = "Không thể tạo bài đăng. Vui lòng thử lại.";
      if (error.response?.status === 401) {
        errorMsg = "Bạn cần đăng nhập để tạo bài viết.";
      } else if (error.response?.data?.detail) {
        errorMsg = error.response.data.detail;
      }
      setMessage({ type: "danger", text: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-5" style={{ minHeight: "80vh" }}>
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center mb-4">Đăng tin</h2>
          {message.text && (
            <Alert variant={message.type} onClose={() => setMessage({ type: "", text: "" })} dismissible>
              {message.text}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="postTitle">
              <Form.Label style={{ color: "white" }}>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tiêu đề"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="postDescription">
              <Form.Label style={{ color: "white" }}>Nội dung</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                placeholder="Nhập nội dung"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="postImage">
              <Form.Label style={{ color: "white" }}>Ảnh (tùy chọn)</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            </Form.Group>
           
            {/* căng chỉnh code Windows: Shift + Alt + F */}
            <Form.Select style={{ marginBottom: "20px", backgroundColor: "#333", color: "white" }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">-- Chọn chuyên mục --</option>
              <option value="bat-dong-san">Tin Tức </option>
              <option value="do-dien-tu">Airdrop</option>
              <option value="xe-co">Testnet </option>
            </Form.Select>
            <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" /> Đang gửi...
                </>
              ) : (
                "Đăng tin"
              )}
            </Button>


          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default PostPage;
