// app/api/sendEmail/route.js
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
  const { companyEmail, formData } = await req.json();

  const msg = {
    to: companyEmail,
    from: 'info@luxorweb.it',
    subject: 'Nuova Iscrizione alla Newsletter',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f9f9f9;">
        <header style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eaeaea;">
          <img src="https://via.placeholder.com/150" alt="Company Logo" style="max-width: 150px;"/>
          <h1 style="color: #485d8b;">Nuova Iscrizione alla Newsletter</h1>
        </header>
        <main style="padding: 20px;">
          <p style="font-size: 16px; line-height: 1.5;">Hai ricevuto una nuova iscrizione alla newsletter. Ecco i dettagli dell'utente:</p>
          <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; background-color: #fff;">
            <p style="font-size: 18px; margin: 0;"><strong>Nome:</strong> ${formData.name}</p>
            <p style="font-size: 18px; margin: 0;"><strong>Email:</strong> ${formData.email}</p>
          </div>
        </main>
        <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 14px; color: #777;">
          <p>Grazie per utilizzare il nostro servizio.</p>
          <p>&copy; 2024 Luxor Web. All rights reserved.</p>
        </footer>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    return new Response(JSON.stringify({ message: 'Email inviata con successo' }), { status: 200 });
  } catch (error) {
    console.error('Errore durante l\'invio dell\'email:', error);
    return new Response(JSON.stringify({ message: 'Errore durante l\'invio dell\'email' }), { status: 500 });
  }
}
