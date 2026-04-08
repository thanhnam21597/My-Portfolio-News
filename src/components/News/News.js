import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, ButtonGroup, Modal } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import Particle from '../Particle';
import { useAuth } from '../../contexts/AuthContext';
import { postService } from '../../services/apiService';

const NEWS_CATEGORIES = [
  { key: 'all',  label: 'Tất cả' },
  { key: 'bat-dong-san', label: 'Tin tức' },
  { key: 'do-dien-tu', label: 'Airdrop' },
  { key: 'xe-co', label: 'Testnet' },
];

function News() {
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [message, setMessage] = useState('');
  const [itemsPerPage] = useState(6); // Số item hiển thị mỗi trang
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const handleShowPost = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
      setMessage('Không thể tải bài viết. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    const ac = location.state?.activeCategory;
    if (ac === 'all' || ac === 'bat-dong-san') {
      setActiveCategory(ac);
    }
  }, [location.state]);

  const filteredPosts = activeCategory === 'all' ? posts : posts.filter((p) => p.category === activeCategory);

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleCategory = (category) => {
    setCurrentPage(1);
    if (category === 'do-dien-tu') {
      navigate('/InfoProject/airdrop');
      return;
    }
    if (category === 'xe-co') {
      navigate('/InfoProject/testnet');
      return;
    }
    setActiveCategory(category);
    navigate('/news', { replace: true, state: { activeCategory: category } });
  };

  const isTabActive = (key) => {
    if (key === 'do-dien-tu' || key === 'xe-co') return false;
    if (key === 'all') return activeCategory === 'all';
    if (key === 'bat-dong-san') return activeCategory === 'bat-dong-san';
    return false;
  };

  const handleDelete = (post) => {
    if (!currentUser || !localStorage.getItem('authToken')) {
      setMessage('Bạn cần đăng nhập để xóa bài.');
      return;
    }
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete?.id) return;
    try {
      // Log để debug
      const token = localStorage.getItem('authToken');
      console.log('Delete attempt:', { postId: postToDelete.id, currentUser, hasToken: !!token });

      await postService.deletePost(postToDelete.id);
      setPosts(posts.filter(post => post.id !== postToDelete.id));
      setMessage('Xóa bài thành công.');
      setTimeout(() => setMessage(''), 3000);
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting post:', error);
      let errorMessage = 'Không thể xóa bài viết.';
      if (error.response?.status === 403) {
        errorMessage = 'Bạn không có quyền xóa bài viết này.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      setMessage(errorMessage);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const renderMeta = (post) => {
    const date = post.created_at ? new Date(post.created_at).toLocaleString('vi-VN') : '';
    let cate = post.category_display || 'Unknown';
    return `Chuyên mục: ${cate} • ${date}`;
  };

  const renderContentWithLinks = (text = '') => {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      const isUrl = /^(https?:\/\/[^\s]+|www\.[^\s]+)$/i.test(part);
      if (!isUrl) return part;

      const href = part.startsWith('http') ? part : `https://${part}`;
      return (
        <a
          key={`${href}-${index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#57c7ff', textDecoration: 'underline', fontWeight: 600 }}
        >
          {part}
        </a>
      );
    });
  };

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container className="news-content">
        <div className="news-filter-tabs">
          {NEWS_CATEGORIES.map((category) => {
            const isActive = isTabActive(category.key);
            return (
              <ButtonGroup
                key={category.key}
                variant={isActive ? 'primary' : 'outline-light'}
                onClick={() => handleCategory(category.key)}
                className={`news-filter-btn ${isActive ? 'active' : ''}`}
              >
                {category.label}
              </ButtonGroup>
            );
          })}
        </div>

        <Row className="text-center mb-3">
          <Col>
            <h1 className="project-heading">
              My Recent <strong className="purple">News</strong>
            </h1>
            <p className="text-light news-subtitle">Here are a few news articles I've written recently.</p>
            <h4 className="text-light">
              Bài đăng {activeCategory === 'all' ? 'tất cả' : NEWS_CATEGORIES.find((c) => c.key === activeCategory).label} của bạn
            </h4>
            {message && <p className="news-success-message">{message}</p>}
          </Col>
        </Row>

        <Row className="news-posts-row">
          {loading ? (
            <Col>
              <p className="news-empty-state">Đang tải bài viết...</p>
            </Col>
          ) : filteredPosts.length === 0 ? (
            <Col>
              <p className="news-empty-state">
                Chưa có bài đăng {activeCategory === 'all' ? '' : NEWS_CATEGORIES.find((c) => c.key === activeCategory).label}, hãy vào trang Đăng tin để thêm.
              </p>
            </Col>
          ) : (
            <>
              {currentPosts.map((post) => (
                <Col key={post.id} md={6} className="mb-4">
                  <div className="news-post-card p-3">
                    {post.image && (
                      <div className="news-post-image-wrap" style={{ cursor: 'pointer' }} onClick={() => handleShowPost(post)}>
                        <img src={post.image} alt={post.title} className="news-post-image" />
                      </div>
                    )}
                    <h5 className="text-light">{post.title}</h5>
                    <p className="news-post-content" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {renderContentWithLinks(post.content)}
                    </p>
                    <small className="news-post-meta">{renderMeta(post)}</small>
                    {currentUser && (
                      <div className="mt-2">
                        <ButtonGroup>
                          <Button size="sm" variant="danger" onClick={() => handleDelete(post)}>
                            Xóa bài
                          </Button>
                        </ButtonGroup>
                      </div>
                    )}
                  </div>
                </Col>
              ))}

              {/* Phân trang */}
              <Col xs={12} className="mt-4 mb-4">
                <div className="pagination-controls d-flex justify-content-center align-items-center gap-3">
                  <Button 
                    variant="outline-primary" 
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    ← Trang trước
                  </Button>
                  
                  <span className="pagination-info text-light">
                    Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong>
                    <br />
                    <small>Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredPosts.length)} trong {filteredPosts.length} bài</small>
                  </span>
                  
                  <Button 
                    variant="outline-primary" 
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                  >
                    Trang sau →
                  </Button>
                </div>
              </Col>
            </>
          )}
        </Row>

        <Modal show={showModal} onHide={handleCloseModal} centered size="lg" scrollable>
          <Modal.Header closeButton>
            <Modal.Title>{selectedPost?.title || 'Chi tiết bài viết'}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#121223', color: '#eee' }}>
            {selectedPost && (
              <>
                {selectedPost.image && (
                  <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <img
                      src={selectedPost.image}
                      alt={selectedPost.title}
                      style={{
                        width: '100%',
                        maxHeight: 'min(50vh, 420px)',
                        objectFit: 'contain',
                        borderRadius: '10px',
                      }}
                    />
                  </div>
                )}
                <p style={{ color: '#ddd', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {renderContentWithLinks(selectedPost.content)}
                </p>
                <hr style={{ borderColor: '#333' }} />
                <p style={{ color: '#bbb' }}>
                  <strong>Chuyên mục:</strong> {selectedPost.category_display || selectedPost.category}<br />
                  <strong>Ngày đăng:</strong> {selectedPost.created_at ? new Date(selectedPost.created_at).toLocaleString('vi-VN') : ''}
                </p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa bài viết</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#121223', color: '#eee' }}>
            <p style={{ marginBottom: '8px' }}>Bạn có chắc chắn muốn xóa bài đăng này?</p>
            <p style={{ color: '#bbb', marginBottom: 0 }}>
              <strong>Tiêu đề:</strong> {postToDelete?.title || '(Không có tiêu đề)'}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              Hủy
            </Button>
            <Button variant="danger" onClick={confirmDeletePost}>
              Xóa bài
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Container>
  );
}

export default News;
