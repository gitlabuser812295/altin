export default async function handler(req, res) {
  try {
    const API_KEY = 'AIzaSyBCKfs_Vt3vyrPo54bOo68kGpe390Lom3A';
    const SPREADSHEET_ID = '1M6jmgsZh3F7Oh_kM1fSwqPWmwiLpgZGjNR1MBR7SNF8';
    
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/mardin!A1:C18?key=${API_KEY}`
    );
    
    const data = await response.json();
    
    // CORS için gerekli header'lar
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cache-Control', 'public, s-maxage=60');
    
    return res.status(200).json(data);
    
  } catch (error) {
    return res.status(500).json({ 
      error: 'API hatası', 
      message: error.message 
    });
  }
}
