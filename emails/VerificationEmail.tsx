import * as React from 'react';

interface EmailTemplateProps {
  username: string;
  verifyCode: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  username,
  verifyCode,
}) => (
  <div className="font-sans text-gray-800">
    <h1 className="text-2xl font-bold text-green-500">Welcome, {username}!</h1>
    <p className="text-lg mt-4">
      Thank you for signing up. Please use the following verification code to complete your registration:
    </p>
    <p className="text-xl font-semibold text-orange-600 mt-2">{verifyCode}</p>
    <p className="text-sm text-gray-600 mt-6">
      If you did not request this, please ignore this email.
    </p>
    <p className="mt-8">
      Best regards,<br />
      The BlogCreator Team
    </p>
  </div>
);
