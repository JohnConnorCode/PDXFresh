import * as React from 'react';

interface NewsletterWelcomeEmailProps {
  email: string;
}

export const NewsletterWelcomeEmail: React.FC<NewsletterWelcomeEmailProps> = () => (
  <html>
    <head>
      <style>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 30px 0;
          background: linear-gradient(135deg, #FFC837 0%, #85C65D 100%);
          border-radius: 10px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: white;
          margin: 0;
          font-size: 32px;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 10px;
          margin-bottom: 20px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #E63946;
          color: white;
          text-decoration: none;
          border-radius: 25px;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 12px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
        }
      `}</style>
    </head>
    <body>
      <div className="header">
        <h1>Welcome to Portland Fresh! 🌱</h1>
      </div>

      <div className="content">
        <h2>Thanks for joining our kitchen table!</h2>
        <p>Hey neighbor,</p>
        <p>
          We're thrilled to have you on board. Portland Fresh exists to keep Portland cooking with
          seasonal sauces, pestos, salsa, and pantry add-ons sourced within a few miles of town.
        </p>
        <p>
          <strong>Here’s what lands in your inbox:</strong>
        </p>
        <ul>
          <li>Weekly menu drops + pickup/delivery windows</li>
          <li>Behind-the-scenes prep footage from our Buckman kitchen</li>
          <li>Spotlights on the farms, foragers, and makers we partner with</li>
          <li>Early access to collabs and limited-run provisions</li>
        </ul>
        <p>
          <a href="https://pdxfreshfoods.com/blends" className="button">
            Explore Our Sauces
          </a>
        </p>
      </div>

      <div className="footer">
        <p>You're receiving this because you signed up at pdxfreshfoods.com</p>
        <p>
          <a href="{{unsubscribe_url}}">Unsubscribe</a> |
          <a href="https://pdxfreshfoods.com">Visit our website</a>
        </p>
        <p>Portland Fresh · Small-Batch Sauces & Pestos</p>
      </div>
    </body>
  </html>
);

export default NewsletterWelcomeEmail;
