import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to App
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              CryptoAI ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
            </p>

            <h2>2. Information We Collect</h2>

            <h3>2.1 Information You Provide</h3>
            <ul>
              <li><strong>Portfolio Data:</strong> Cryptocurrency holdings, purchase prices, and quantities you enter</li>
              <li><strong>Chat Messages:</strong> Conversations with the AI assistant</li>
              <li><strong>Preferences:</strong> Theme settings, currency preferences, and notification settings</li>
              <li><strong>Watchlists:</strong> Cryptocurrencies you choose to track</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <ul>
              <li><strong>Usage Data:</strong> How you interact with the application</li>
              <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers</li>
              <li><strong>Log Data:</strong> IP address, access times, and pages viewed</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul>
              <li>Provide and maintain the Service</li>
              <li>Personalize your experience</li>
              <li>Improve our AI responses and features</li>
              <li>Calculate portfolio values and investment metrics</li>
              <li>Send notifications (if enabled)</li>
              <li>Analyze usage patterns to improve the Service</li>
              <li>Detect and prevent technical issues</li>
            </ul>

            <h2>4. Data Storage</h2>

            <h3>4.1 Local Storage</h3>
            <p>
              Most of your data is stored locally in your browser using localStorage and IndexedDB:
            </p>
            <ul>
              <li>Chat message history</li>
              <li>Portfolio holdings</li>
              <li>Watchlists</li>
              <li>User preferences</li>
              <li>Price alerts</li>
            </ul>
            <p>
              This data remains on your device and is not transmitted to our servers unless explicitly required for a feature (e.g., AI chat processing).
            </p>

            <h3>4.2 Server-Side Processing</h3>
            <p>
              When you use the AI chat feature, your messages are sent to our servers and then to Google's Gemini API for processing. We do not permanently store chat messages on our servers.
            </p>

            <h2>5. Third-Party Services</h2>
            <p>We integrate with the following third-party services:</p>

            <h3>5.1 Google Gemini AI</h3>
            <ul>
              <li>Purpose: AI-powered chat responses</li>
              <li>Data Shared: Your chat messages and context</li>
              <li>Privacy Policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
            </ul>

            <h3>5.2 CoinGecko API</h3>
            <ul>
              <li>Purpose: Cryptocurrency market data</li>
              <li>Data Shared: API requests for price and market information</li>
              <li>Privacy Policy: <a href="https://www.coingecko.com/en/privacy" target="_blank" rel="noopener noreferrer">CoinGecko Privacy Policy</a></li>
            </ul>

            <h3>5.3 Etherscan API</h3>
            <ul>
              <li>Purpose: Blockchain data and wallet information</li>
              <li>Data Shared: Wallet addresses you query</li>
              <li>Privacy Policy: <a href="https://etherscan.io/privacy" target="_blank" rel="noopener noreferrer">Etherscan Privacy Policy</a></li>
            </ul>

            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your data:
            </p>
            <ul>
              <li>HTTPS encryption for all data transmission</li>
              <li>API keys stored securely on the server side</li>
              <li>No storage of sensitive financial credentials</li>
              <li>Regular security updates and monitoring</li>
            </ul>
            <p>
              However, no method of transmission over the Internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>

            <h2>7. Your Data Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> View all data stored about you</li>
              <li><strong>Delete:</strong> Clear your chat history, portfolio, and preferences at any time</li>
              <li><strong>Export:</strong> Download your chat conversations in various formats</li>
              <li><strong>Opt-Out:</strong> Disable notifications and data collection features</li>
            </ul>

            <h2>8. Data Retention</h2>
            <p>
              Since most data is stored locally in your browser, you control how long it's retained. You can clear all data at any time through your browser settings or the application's clear data features.
            </p>
            <p>
              Server logs and analytics data are retained for up to 90 days for security and improvement purposes.
            </p>

            <h2>9. Children's Privacy</h2>
            <p>
              Our Service is not intended for users under 18 years of age. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>

            <h2>10. Cookies and Tracking</h2>
            <p>
              We use browser localStorage and sessionStorage to maintain your session and preferences. We do not use third-party tracking cookies or advertising cookies.
            </p>

            <h2>11. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. By using the Service, you consent to such transfers. We ensure appropriate safeguards are in place for international data transfers.
            </p>

            <h2>12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last Updated" date at the top of this policy. You are advised to review this Privacy Policy periodically for any changes.
            </p>

            <h2>13. California Privacy Rights</h2>
            <p>
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect and the right to request deletion of your personal information.
            </p>

            <h2>14. GDPR Compliance</h2>
            <p>
              If you are in the European Economic Area (EEA), you have rights under the General Data Protection Regulation (GDPR), including:
            </p>
            <ul>
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
            </ul>

            <h2>15. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us through the application.
            </p>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="font-semibold text-blue-800 dark:text-blue-400">
                🔒 Your Privacy Matters
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                We are committed to protecting your privacy and giving you control over your data. Most of your information is stored locally on your device, and you can delete it at any time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
