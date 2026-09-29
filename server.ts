import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  app.use(express.json());

  // Health check route
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'healthy', platform: 'ArthaRisk' });
  });

  // Server-side Gemini API proxy route
  app.post('/api/gemini/chat', async (req, res) => {
    const { prompt, context } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.status(200).json({
        fallback: true,
        message: 'No GEMINI_API_KEY detected. Using local deterministic intent engine.',
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are ArthaRisk Copilot, an enterprise cyber risk quantification and financial decision intelligence engine for "Aarav FinServe Ltd" (an Indian mid-size financial services institution).
Current Enterprise Context:
- EAL (Expected Annual Loss): ₹${context?.eal || '4.82 Cr'}
- Value at Risk (95% confidence): ₹${context?.var95 || '14.20 Cr'}
- Enterprise Risk Score: ${context?.riskScore || 72}/100
- Risk Appetite Limit: ₹5.00 Cr
- Top Risk Driver: ${context?.topRiskDriver || 'Fortinet SSL-VPN Gateway (CVE-2024-21413)'}
- Key Gaps: Privileged IAM accounts missing MFA, unsegmented payment VLAN, unpatched perimeter endpoints.

User Inquiry: ${prompt}

Guidelines:
- Give a concise, authoritative, CISO/Board-level answer in plain English.
- Always quote figures in Indian Rupees (₹ Lakh / ₹ Crore).
- Connect technical indicators (CVEs, misconfigurations) directly to business financial impact (downtime, DPDP Act penalties, breach losses).
- Provide 2-3 specific prioritized next actions with estimated cost and risk reduction.`,
      });

      return res.json({
        reply: response.text,
        source: 'gemini-3.8-flash',
      });
    } catch (err: any) {
      console.error('Gemini API call failed:', err?.message || err);
      return res.status(200).json({
        fallback: true,
        error: err?.message || 'Server-side error querying Gemini',
      });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ArthaRisk] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
