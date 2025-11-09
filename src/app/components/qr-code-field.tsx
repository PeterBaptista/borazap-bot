import React from 'react'

type QRCodeFieldProps = {
  value?: string
}

const QRCodeField: React.FC<QRCodeFieldProps> = ({ value }) => {
  if (!value) return <p>Carregando QR Code...</p>
  if (value === 'error') return <p>Erro ao carregar QR Code</p>

  return (
    <div style={{ textAlign: 'center' }}>
      <img
        src={value}
        alt="QR Code"
        style={{ width: 500, height: 500, border: '1px solid #ddd', padding: 8 }}
      />
    </div>
  )
}

export default QRCodeField
