export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const clientData = req.body;

    // 1. Get the IP address from Vercel's headers
    const forwarded = req.headers['x-forwarded-for'];
    let ip = forwarded ? forwarded.split(',')[0].trim() : req.headers['x-real-ip'] || 'Unknown';

    // 2. Get the exact server time
    const time = new Date().toISOString();

    // 3. Map the data to your Google Form entry IDs
    const formData = new URLSearchParams();
    
    // REPLACE THESE entry.XXXXXX numbers with your actual Google Form IDs
    formData.append('entry.193003679', ip);
    formData.append('entry.270212215', time);
    formData.append('entry.1279096273', clientData.url || 'Unknown');
    formData.append('entry.292017210', clientData.queryParams || 'None');
    formData.append('entry.220629650', clientData.userAgent || 'Unknown');
    formData.append('entry.290741101', clientData.resolution || 'Unknown');
    formData.append('entry.1855823966', clientData.language || 'Unknown');
    formData.append('entry.226902128', clientData.timeZone || 'Unknown');
    formData.append('entry.1956517772', clientData.referrer || 'Direct');
    formData.append('entry.2051106224', clientData.isMobile || 'Unknown');

    // REPLACE THIS with your actual Google Form Action URL
    const googleFormActionURL = 'https://docs.google.com/forms/d/e/1FAIpQLSe2_ptj9UmVEuX1K03CbtcA6207fXzDEInuMCti-uC0a52HRQ/formResponse';

    // 4. Send the data to Google Forms
    await fetch(googleFormActionURL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // Send a success response back to your website
    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}