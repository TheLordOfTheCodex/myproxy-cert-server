const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// CA sertifikasının yolu - Railway'de bu dosyayı upload etmen lazım
const CERT_PATH = process.env.CERT_PATH || './certs/ca-cert.mobileconfig';

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'MyProxy CA Certificate Server',
    endpoints: {
      '/ca-cert': 'Download CA certificate (.mobileconfig)',
      '/health': 'Health check'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  const certExists = fs.existsSync(CERT_PATH);
  res.json({ 
    status: 'ok', 
    certExists,
    certPath: CERT_PATH
  });
});

// CA Sertifikasını indir
app.get('/ca-cert', (req, res) => {
  if (!fs.existsSync(CERT_PATH)) {
    return res.status(404).json({ 
      error: 'Certificate not found',
      message: 'Please upload CA certificate to the server'
    });
  }

  const cert = fs.readFileSync(CERT_PATH);
  
  res.setHeader('Content-Type', 'application/x-apple-aspen-config');
  res.setHeader('Content-Disposition', 'attachment; filename="MyProxy-CA.mobileconfig"');
  res.setHeader('Content-Length', cert.length);
  
  res.send(cert);
});

// Upload endpoint (sadece geliştirme için, production'da kaldır)
app.post('/upload-cert', express.raw({ type: '*/*', limit: '10mb' }), (req, res) => {
  try {
    const dir = path.dirname(CERT_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(CERT_PATH, req.body);
    
    res.json({ 
      success: true, 
      message: 'Certificate uploaded successfully',
      size: req.body.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`MyProxy CA Server running on port ${PORT}`);
  console.log(`Certificate path: ${CERT_PATH}`);
  console.log(`Certificate exists: ${fs.existsSync(CERT_PATH)}`);
});
