#!/usr/bin/env python3
import plistlib
import base64
import subprocess
import uuid

def create_mobileconfig():
    # CA sertifikasını oku
    with open('certs/ca-cert.pem', 'rb') as f:
        cert_pem = f.read()
    
    # PEM'den DER formatına çevir
    result = subprocess.run(
        ['openssl', 'x509', '-in', 'certs/ca-cert.pem', '-outform', 'DER'],
        capture_output=True
    )
    cert_der = result.stdout
    
    # Payload UUID'leri
    payload_uuid = str(uuid.uuid4()).upper()
    root_uuid = str(uuid.uuid4()).upper()
    
    # .mobileconfig yapısı
    mobileconfig = {
        'PayloadContent': [
            {
                'PayloadCertificateFileName': 'MyProxy-CA.cer',
                'PayloadContent': cert_der,
                'PayloadDescription': 'MyProxy CA Root Certificate',
                'PayloadDisplayName': 'MyProxy Root CA',
                'PayloadIdentifier': 'com.seninapp.myproxy.ca',
                'PayloadType': 'com.apple.security.root',
                'PayloadUUID': payload_uuid,
                'PayloadVersion': 1
            }
        ],
        'PayloadDescription': 'MyProxy MITM Proxy CA Certificate',
        'PayloadDisplayName': 'MyProxy CA Certificate',
        'PayloadIdentifier': 'com.seninapp.myproxy',
        'PayloadOrganization': 'MyProxy',
        'PayloadRemovalDisallowed': False,
        'PayloadType': 'Configuration',
        'PayloadUUID': root_uuid,
        'PayloadVersion': 1
    }
    
    # Kaydet
    with open('certs/ca-cert.mobileconfig', 'wb') as f:
        plistlib.dump(mobileconfig, f)
    
    print("✅ ca-cert.mobileconfig oluşturuldu!")
    print(f"📁 Konum: certs/ca-cert.mobileconfig")
    print(f"📊 Boyut: {len(cert_der)} bytes (cert)")

if __name__ == '__main__':
    create_mobileconfig()
