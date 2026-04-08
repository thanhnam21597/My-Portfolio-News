import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, ButtonGroup, Modal } from 'react-bootstrap';
import Particle from '../../../components/Particle';
import { useAuth } from '../../../contexts/AuthContext';
import { postService } from '../../../services/apiService';
import { useNavigate, useLocation } from 'react-router-dom';

function Testnet() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const handleShowPost = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  const NEWS_CATEGORIES = [
  { key: 'all',  label: 'Tất cả' },
  { key: 'bat-dong-san', label: 'Tin tức' },
  { key: 'do-dien-tu', label: 'Airdrop' },
  { key: 'xe-co', label: 'Testnet' },
  ];
  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getAllPosts();
      const filtered = data.filter((post) => post.category === 'xe-co');
      setPosts(filtered.reverse());
    } catch (error) {
      console.error('Error loading Testnet posts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadPosts();
  }, []);
  
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadPosts();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const handleNavigate = (path) => {
    window.location.href = path;
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
  
const handleCategory = (category) => {
    if (category === 'do-dien-tu') {
      navigate('/InfoProject/airdrop');
      return;
    }
    if (category === 'xe-co') {
      navigate('/InfoProject/testnet');
      return;
    }
    if (category === 'all' || category === 'bat-dong-san') {
      navigate('/news', { state: { activeCategory: category } });
      return;
    }
  };

  const isTabActive = (key) => {
    if (key === 'do-dien-tu') return location.pathname === '/InfoProject/airdrop';
    if (key === 'xe-co') return location.pathname === '/InfoProject/testnet';
    return false;
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
    <Container fluid className='project-section'>
      <Particle />
      <Container>
        {/* Filter Tabs */}
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

        <h1 className='project-heading'>
          Testnet <strong className='purple'>Info</strong>
        </h1>
        <p style={{ color: 'white' }}>
          Trang thông tin Testnet. Tất cả bài viết bạn đăng ở mục <strong>Testnet</strong> sẽ xuất hiện phía dưới.
        </p>

        {posts.length === 0 ? (
          <p style={{ color: '#ddd' }}>
            Chưa có bài đăng Testnet. Vui lòng tạo bài ở trang Đăng tin và chọn chuyên mục Testnet.
          </p>
        ) : (
          <>
            <h4 className='text-light'>Bài đăng Testnet của bạn</h4>
            <Row style={{ justifyContent: 'center', paddingBottom: '20px' }}>   
              {posts.map((post) => (
                <Col md={6} key={post.id} className='mb-4'>
                  <div className='p-3' style={{ backgroundColor: '#1e1e2d', borderRadius: '10px' }}>
                    {post.image && (
                      <div
                        style={{ marginBottom: '12px', textAlign: 'center', cursor: 'pointer' }}
                        onClick={() => handleShowPost(post)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleShowPost(post)}
                      >
                        <img
                          src={post.image}
                          alt={post.title}
                          style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <small className="d-block text-center mt-2" style={{ color: '#9ab', fontSize: '0.85rem' }}>
                          Nhấn ảnh hoặc tiêu đề để xem đầy đủ
                        </small>
                      </div>
                    )}
                    <h5
                      className="text-light"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleShowPost(post)}
                      title="Xem chi tiết"
                    >
                      {post.title}
                    </h5>
                    <p style={{ color: '#ddd', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {renderContentWithLinks(post.content)}
                    </p>
                    <small style={{ color: '#aaa' }}>
                      Chuyên mục: Testnet  {new Date(post.created_at).toLocaleString()}
                    </small>
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
            </Row>
          </>
        )}

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
                  <strong>Chuyên mục:</strong> Testnet<br />
                  <strong>Ngày đăng:</strong>{' '}
                  {selectedPost.created_at ? new Date(selectedPost.created_at).toLocaleString('vi-VN') : ''}
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

export default Testnet;
