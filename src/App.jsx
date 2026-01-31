import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [tempData, setTempData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/content')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setTempData(json);
      });
  }, []);

  const handleSaveChanges = () => {
    // This updates the local state for immediate feedback
    setData(tempData);
    setShowEditor(false);
    

    fetch('http://localhost:5000/api/update-content', {
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
              <input value={tempData.hero.title} onChange={(e) => setTempData({...tempData, hero: {...tempData.hero, title: e.target.value}})} />
              <label>Secondary Text</label>
              <input value={tempData.hero.subtitle} onChange={(e) => setTempData({...tempData, hero: {...tempData.hero, subtitle: e.target.value}})} />
            </div>
            <button className="apply-btn" onClick={handleSaveChanges}>PUBLISH CHANGES</button>
          </div>
        </div>
      )}

      {/* --- MINIMAL NAVIGATION --- */}
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
          <span>JORDAN</span><span>YEEZY</span><span>ADIDAS</span><span>NIKE</span>
        </div>
        <div className="nav-meta">CART (0)</div>
      </nav>

      {/* --- IMPACT HERO SECTION --- */}
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
          <span>VIEW ALL</span>
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
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;900&display=swap');

        /* RESET & BASE COLOR */
        body { margin: 0; background: #000; color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; }
        
        .shoe-nav { 
          display: flex; justify-content: space-between; padding: 25px 60px; 
          align-items: center; border-bottom: 1px solid #222; background: #000;
        }
        .logo { font-family: 'Anton', sans-serif; font-size: 1.5rem; letter-spacing: 2px; color: #fff; }
        .nav-links span { margin: 0 20px; font-weight: 900; font-size: 0.8rem; cursor: pointer; color: #888; transition: 0.3s; }
        .nav-links span:hover { color: #fff; }

                .nav-logo-img {
          /* Change these values to your liking */
          width: 60px;   /* Width of the logo */
          height: 60px;  /* Height of the logo */
          
          /* Important: object-fit prevents the logo from looking "squashed" */
          object-fit: contain; 
          
          border-radius: 12px; /* Curved edges */
          background: #111;
       
        }

                  .brand-group {
            display: flex;
            align-items: center; /* Keeps them vertically centered */
            gap: 12px;           /* Controls the exact distance between logo and text */
          }

          .nav-logo-img {
            width: 50px;         /* Adjust your size here */
            height: auto;
            border-radius: 8px;  /* Subtle curve */
          }

          .shoe-nav {
            display: flex;
            justify-content: space-between; /* Spreads Brand-Group, Links, and Cart */
            align-items: center;
            padding: 15px 60px;
            background: #000;
          }

        /* HERO SECTION */
        .hero-section { position: relative; height: 95vh; display: flex; align-items: center; justify-content: center; background: #000; }
        
        .hero-bg-text { position: absolute; width: 100%; text-align: center; z-index: 1; pointer-events: none; }
        .hero-bg-text h1 { 
          font-family: 'Anton', sans-serif; font-size: 20vw; color: #A9A9A9; /* Dark grey on black */
          margin: 0; text-transform: uppercase; line-height: 0.8;
          transition: 0.5s ease;
        }

        .shoe-image-wrapper { z-index: 2; width: 50%; max-width: 500px; transform: rotate(-15deg); filter: drop-shadow(0 30px 50px rgba(0,0,0,1)); }
        .shoe-image-wrapper img { width: 80%; height: auto; transition: 0.5s ease; border-radius: 40px; }
        .shoe-image-wrapper:hover img { transform: scale(1.1) rotate(0deg); }

        .hero-content { position: absolute; bottom: 10%; z-index: 3; text-align: center; }
        .subtitle { font-weight: 900; letter-spacing: 5px; text-transform: uppercase; margin-bottom: 20px; color: #000; }
        
        .shop-button { 
          background: #fff; color: #000; border: none; padding: 20px 50px; 
          font-weight: 900; cursor: pointer; font-size: 1rem; letter-spacing: 2px;
          transition: 0.3s;
        }
        .shop-button:hover { background: #ceff00; color: #000; transform: scale(1.05); }

        /* MODAL POP-UP */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); }
        .editor-modal { background: #111; width: 400px; padding: 40px; border: 1px solid #333; }
        .modal-header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px; }
        .modal-header h3 { font-family: 'Anton', sans-serif; margin: 0; color: #fff; }
        .close-btn { background: none; border: none; font-size: 2rem; cursor: pointer; color: #555; }
        
        .modal-body label { font-size: 10px; font-weight: 900; text-transform: uppercase; display: block; margin-top: 15px; color: #888; }
        .modal-body input { width: 100%; border: 1px solid #333; background: #000; color: #fff; padding: 12px; margin-top: 5px; box-sizing: border-box; }
        
        .apply-btn { width: 100%; background: #fff; color: #000; border: none; padding: 15px; margin-top: 30px; font-weight: 900; cursor: pointer; }

        /* GRID SECTION */
        .product-section { padding: 100px 60px; background: #000; }
        .section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 50px; border-bottom: 1px solid #222; padding-bottom: 20px; }
        .section-header h2 { font-family: 'Anton', sans-serif; font-size: 3rem; margin: 0; color: #fff; }
        
        .shoe-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; }
        .shoe-card { transition: 0.3s; background: #080808; padding: 20px; border: 1px solid #111; }
        .shoe-card:hover { border-color: #333; transform: translateY(-10px); }
        .image-box { background: #111; padding: 40px; margin-bottom: 15px; display: flex; justify-content: center; }
        .image-box img { width: 100%; height: auto; }
        
        .info h4 { font-weight: 900; margin: 0; text-transform: uppercase; color: #fff; }
        .info p { color: #888; margin-top: 5px; font-weight: 700; }

        @media (max-width: 768px) {
          .hero-bg-text h1 { font-size: 30vw; }
          .shoe-image-wrapper { width: 80%; }
          .shoe-nav { padding: 20px; }
        }
      `}</style>
    </div>
  );
}

export default App;