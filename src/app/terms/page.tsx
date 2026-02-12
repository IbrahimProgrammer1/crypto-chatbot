import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
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
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using CryptoAI ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              CryptoAI is an AI-powered cryptocurrency information and educational platform that provides:
            </p>
            <ul>
              <li>Real-time cryptocurrency market data</li>
              <li>Portfolio tracking tools</li>
              <li>Educational content about cryptocurrencies</li>
              <li>News aggregation and analysis</li>
              <li>Investment planning calculators</li>
            </ul>

            <h2>3. Not Financial Advice</h2>
            <p className="font-bold text-red-600 dark:text-red-400">
              IMPORTANT: CryptoAI provides educational content and information only. Nothing on this platform constitutes financial, investment, legal, or tax advice. You should not treat any of the content as such.
            </p>
            <p>
              All information provided is for educational and informational purposes only. Before making any financial decisions, you should:
            </p>
            <ul>
              <li>Conduct your own research (DYOR)</li>
              <li>Consult with licensed financial advisors</li>
              <li>Consider your personal financial situation</li>
              <li>Understand the risks involved in cryptocurrency investments</li>
            </ul>

            <h2>4. Age Requirement</h2>
            <p>
              You must be at least 18 years old to use this Service. By using CryptoAI, you represent and warrant that you are at least 18 years of age.
            </p>

            <h2>5. Investment Risks</h2>
            <p>
              Cryptocurrency investments carry significant risks, including but not limited to:
            </p>
            <ul>
              <li>High volatility and potential for substantial losses</li>
              <li>Regulatory uncertainty</li>
              <li>Security risks including hacking and theft</li>
              <li>Lack of investor protection</li>
              <li>Market manipulation</li>
              <li>Technical failures</li>
            </ul>
            <p>
              You acknowledge that you may lose some or all of your investment and that you are solely responsible for any investment decisions you make.
            </p>

            <h2>6. Data Accuracy</h2>
            <p>
              While we strive to provide accurate and up-to-date information, we do not guarantee the accuracy, completeness, or timeliness of any data provided through the Service. Market data may be delayed or contain errors. You should verify all information independently before making any decisions.
            </p>

            <h2>7. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul>
              <li>Use the Service only for lawful purposes</li>
              <li>Not attempt to gain unauthorized access to any part of the Service</li>
              <li>Not use the Service to transmit malicious code or harmful content</li>
              <li>Not scrape, copy, or redistribute content without permission</li>
              <li>Maintain the security of your account credentials</li>
            </ul>

            <h2>8. Intellectual Property</h2>
            <p>
              All content, features, and functionality of the Service are owned by CryptoAI and are protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h2>9. Third-Party Services</h2>
            <p>
              The Service integrates with third-party APIs and services (CoinGecko, Google Gemini, etc.). We are not responsible for the availability, accuracy, or content of these third-party services.
            </p>

            <h2>10. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CRYPTOAI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>

            <h2>11. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>

            <h2>12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes by updating the "Last Updated" date. Your continued use of the Service after such changes constitutes acceptance of the new terms.
            </p>

            <h2>13. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your access to the Service at any time, without prior notice, for any reason, including breach of these Terms of Service.
            </p>

            <h2>14. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the Service operates, without regard to its conflict of law provisions.
            </p>

            <h2>15. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us through the application.
            </p>

            <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="font-semibold text-yellow-800 dark:text-yellow-400">
                ⚠️ Important Reminder
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                Cryptocurrency investments are highly speculative and volatile. Never invest more than you can afford to lose. Always do your own research and consult with qualified financial professionals before making investment decisions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
