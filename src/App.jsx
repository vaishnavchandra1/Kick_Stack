import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [tempData, setTempData] = useState(null);

  useEffect(() => {
    fetch('/api/content') 
      .then(res => res.json())
      .then(json => {
        setData(json);
        setTempData(json);
      })
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  const handleSaveChanges = () => {
    setData(tempData);
    setShowEditor(false);
    fetch('/api/update-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tempData),
    });
  };

  if (!data) return <div className="loading">SYNCING INVENTORY...</div>;

  return (
    <div className="premium-shoe-store">
      
      {/* --- EDIT POP-UP --- */}
      {showEditor && (
        <div className="modal-overlay">
          <div className="editor-modal">
            <div className="modal-header">
              <h3>EDIT SNEAKER DROP</h3>
              <button onClick={() => setShowEditor(false)} className="close-btn">&times;</button>
            </div>
            <div className="modal-body">
              <label>Drop Headline</label>
              <input 
                value={tempData.hero.title} 
                onChange={(e) => setTempData({...tempData, hero: {...tempData.hero, title: e.target.value}})} 
              />
              <label>Secondary Text</label>
              <input 
                value={tempData.hero.subtitle} 
                onChange={(e) => setTempData({...tempData, hero: {...tempData.hero, subtitle: e.target.value}})} 
              />
            </div>
            <button className="apply-btn" onClick={handleSaveChanges}>PUBLISH CHANGES</button>
          </div>
        </div>
      )}

      {/* --- NAVIGATION --- */}
      <nav className="shoe-nav">
        <div className="brand-group">
          <img 
            src="/shoes-logo-running-logo-template-vector.jpg" 
            alt="KickStack Logo" 
            className="nav-logo-img" 
          />
          <div className="logo">KICK<span>STACK</span></div>
        </div>
        <div className="nav-links">
          <span>JORDAN</span><span>YEEZY</span><span>NIKE</span>
        </div>
        <div className="nav-meta">CART (0)</div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="hero-section">
        <div className="hero-bg-text">
          <h1>{data.hero.title}</h1>
        </div>
        
        <div className="shoe-image-wrapper">
          <img src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200" alt="Nike Air Max" />
        </div>

        <div className="hero-content">
          <p className="subtitle">{data.hero.subtitle}</p>
          <button className="shop-button" onClick={() => setShowEditor(true)}>
            {data.hero.buttonText}
          </button>
        </div>
      </header>

      {/* --- PRODUCT GRID --- */}
      <section className="product-section">
        <div className="section-header">
          <h2>THE DROP LIST</h2>
          <span className="view-all">VIEW ALL</span>
        </div>
        <div className="shoe-grid">
          {data.products.map(p => (
            <div key={p.id} className="shoe-card">
              <div className="image-box">
                <img src={p.image} alt={p.name} />
              </div>
              <div className="info">
                <h4>{p.name}</h4>
                <p>{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;700;900&display=swap');

        /* RESET */
        * { box-sizing: border-box; }
        body { margin: 0; background: #000; color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; }
        
        .loading { height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Anton'; letter-spacing: 4px; }

        /* NAV */
        .shoe-nav { 
          display: flex; justify-content: space-between; padding: 15px 5%; 
          align-items: center; border-bottom: 1px solid #222; background: #000;
          position: sticky; top: 0; z-index: 100;
        }
        .brand-group { display: flex; align-items: center; gap: 10px; }
        .nav-logo-img { width: 40px; height: 40px; border-radius: 8px; object-fit: contain; }
        .logo { font-family: 'Anton', sans-serif; font-size: 1.2rem; letter-spacing: 1px; }
        .logo span { color: #666; }
        .nav-links { display: flex; gap: 20px; }
        .nav-links span { font-weight: 700; font-size: 0.75rem; color: #888; cursor: pointer; }
        .nav-meta { font-weight: 900; font-size: 0.8rem; }

        /* HERO */
        .hero-section { 
          position: relative; height: 85vh; min-height: 500px;
          display: flex; flex-direction: column; align-items: center; justify-content: center; 
          padding: 0 20px; text-align: center;
        }
        .hero-bg-text { position: absolute; width: 100%; top: 50%; transform: translateY(-50%); z-index: 1; pointer-events: none; }
        .hero-bg-text h1 { 
          font-family: 'Anton', sans-serif; font-size: 22vw; color: #fff; 
          margin: 0; text-transform: uppercase; line-height: 0.8;
        }

        .shoe-image-wrapper { z-index: 2; width: 80%; max-width: 450px; transform: rotate(-10deg); filter: drop-shadow(0 20px 40px rgba(0,0,0,0.8)); }
        .shoe-image-wrapper img { width: 100%; height: auto; border-radius: 20px; }

        .hero-content { z-index: 3; margin-top: -20px; }
        .subtitle { font-weight: 900; font-size: 0.9rem; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 20px; }
        .shop-button { 
          background: #fff; color: #000; border: none; padding: 15px 40px; 
          font-weight: 900; cursor: pointer; font-size: 0.9rem; transition: 0.3s;
        }

        /* GRID */
        .product-section { padding: 60px 5%; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .section-header h2 { font-family: 'Anton'; font-size: 2rem; margin: 0; }
        .view-all { font-size: 0.8rem; font-weight: 700; color: #666; border-bottom: 1px solid #444; }
        
        .shoe-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 30px; }
        .shoe-card { background: #0a0a0a; padding: 15px; border: 1px solid #1a1a1a; }
        .image-box { background: #111; padding: 20px; margin-bottom: 15px; }
        .image-box img { width: 100%; height: auto; transition: 0.3s; }
        .shoe-card:hover .image-box img { transform: scale(1.05); }
        .info h4 { font-weight: 900; margin: 0; font-size: 0.9rem; }
        .info p { color: #888; font-size: 0.85rem; margin-top: 5px; }

        /* MODAL */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .editor-modal { background: #111; width: 100%; max-width: 400px; padding: 30px; border: 1px solid #333; }
        .modal-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .modal-header h3 { font-family: 'Anton'; margin: 0; }
        .modal-body input { width: 100%; background: #000; color: #fff; border: 1px solid #333; padding: 12px; margin: 10px 0 20px; }
        .apply-btn { width: 100%; background: #fff; padding: 15px; font-weight: 900; cursor: pointer; }

        /* RESPONSIVE BREAKPOINTS */
        @media (max-width: 768px) {
          .nav-links { display: none; } /* Hide secondary links on mobile for space */
          .shoe-nav { padding: 15px 20px; }
          .hero-section { height: 70vh; }
          .hero-bg-text h1 { font-size: 28vw; }
          .shoe-image-wrapper { width: 90%; }
          .product-section { padding: 40px 20px; }
          .section-header h2 { font-size: 1.5rem; }
        }

        @media (min-width: 1400px) {
           .hero-bg-text h1 { font-size: 15vw; } /* Prevent title from getting too huge on 4k screens */
        }
      `}</style>
    </div>
  );
}

export default App;