# MyProxy CA Certificate Server

Railway'de çalışan basit CA sertifika sunucusu.

## Kurulum

1. Railway CLI kurulumu:
```bash
npm install -g @railway/cli
```

2. Login:
```bash
railway login
```

3. Proje oluştur:
```bash
cd railway-cert-server
railway init
```

4. Deploy et:
```bash
railway up
```

## Sertifika Yükleme

### Yöntem 1: Railway Dashboard'dan
1. Railway dashboard'a git
2. Proje > Variables > Add Variable
3. `CERT_PATH` olarak `/app/certs/ca-cert.mobileconfig` ekle
4. Volumes bölümünde `/app/certs` dizinine `.mobileconfig` dosyasını yükle

### Yöntem 2: Upload Endpoint (Geliştirme)
```bash
curl -X POST https://your-app.up.railway.app/upload-cert \
  --data-binary @ca-cert.mobileconfig \
  -H "Content-Type: application/octet-stream"
```

## Endpoint'ler

- `GET /` - Bilgi
- `GET /health` - Sağlık kontrolü
- `GET /ca-cert` - CA sertifikasını indir (`.mobileconfig`)

## iOS Entegrasyon

Uygulamada `CertificateView.swift`'teki URL'yi güncelle:
```swift
private let railwayCertURL = "https://your-app.up.railway.app/ca-cert"
```
