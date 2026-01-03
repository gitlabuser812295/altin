export default async function handler(req, res) {
  // CORS headers - EN BAŞTA OLMALI
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // OPTIONS isteği için (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Sadece GET isteklerine izin ver
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // BU KISIM CRITICAL - environment variables kullan
    const API_KEY = process.env.GOOGLE_SHEETS_API_KEY || 'AIzaSyBCKfs_Vt3vyrPo54bOo68kGpe390Lom3A';
    const SPREADSHEET_ID = '1M6jmgsZh3F7Oh_kM1fSwqPWmwiLpgZGjNR1MBR7SNF8';
    
    // API key kontrolü
    if (!API_KEY || API_KEY === '') {
      console.error('API_KEY is missing!');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'API key is not configured properly' 
      });
    }
    
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/mardin!A1:C18?key=${API_KEY}`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API Error:', response.status, errorText);
      throw new Error(`Google API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // **DEĞİŞİKLİK BURADA: Orijinal Google Sheets API yapısını aynen koruyoruz**
    return res.status(200).json({
      range: data.range,
      majorDimension: data.majorDimension || 'ROWS',
      values: data.values || []
    });
    
  } catch (error) {
    console.error('API Error Details:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      type: error.name
    });
  }
}
