import { ImageResponse } from 'next/og'

export const alt = 'Lobbi — Find teammates who actually show up'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background:
            'radial-gradient(60% 60% at 15% 10%, rgba(164,107,255,0.35), transparent 70%), radial-gradient(50% 50% at 90% 40%, rgba(77,141,255,0.25), transparent 70%), #06060a',
          color: '#f2f1f7',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 44, fontWeight: 700 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              background: '#5cffb0',
              boxShadow: '0 0 30px #5cffb0',
            }}
          />
          Lobbi
        </div>
        <div style={{ display: 'flex', marginTop: 40, fontSize: 88, fontWeight: 800, lineHeight: 1.02, textTransform: 'uppercase' }}>
          Find teammates who actually show up.
        </div>
        <div style={{ display: 'flex', marginTop: 36, fontSize: 32, color: '#5cffb0' }}>
          Teammate finder for PC gamers in India
        </div>
      </div>
    ),
    size,
  )
}
