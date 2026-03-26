import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function toInt(value, fallback) {
  const n = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(n) ? n : fallback;
}

function toBool(value, fallback) {
  if (value === undefined) return fallback;
  const v = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'y', 'on'].includes(v)) return true;
  if (['0', 'false', 'no', 'n', 'off'].includes(v)) return false;
  return fallback;
}

function chunk(array, size) {
  if (!Array.isArray(array) || array.length === 0) return [];
  const result = [];
  for (let i = 0; i < array.length; i += size) result.push(array.slice(i, i + size));
  return result;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function parseArgs(argv) {
  const args = { testTo: null, limit: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--test' || a === '--test-to') {
      args.testTo = argv[i + 1] || null;
      i++;
    } else if (a === '--limit') {
      args.limit = argv[i + 1] || null;
      i++;
    }
  }
  return args;
}

async function fetchDevToArticles({ tag, limit }) {
  const url = `https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&per_page=${encodeURIComponent(
    String(limit)
  )}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Dev.to request failed: ${response.status} ${response.statusText}`);
  }

  const articles = await response.json();
  return (Array.isArray(articles) ? articles : []).map((a) => ({
    title: a?.title ?? 'Untitled',
    description: a?.description ?? '',
    url: a?.url ?? '',
    published_at: a?.published_at ?? null,
    author: a?.user?.name ?? ''
  }));
}

function renderEmailHtml({ title, articles }) {
  const itemsHtml = articles
    .filter((a) => a.url)
    .map((a) => {
      const t = escapeHtml(a.title);
      const d = a.description ? `<p style="margin:6px 0 0;color:#555;line-height:1.4;">${escapeHtml(a.description)}</p>` : '';
      const meta = [a.author, a.published_at ? new Date(a.published_at).toLocaleDateString('fr-FR') : null]
        .filter(Boolean)
        .join(' • ');
      const metaHtml = meta
        ? `<div style="margin-top:6px;color:#888;font-size:12px;">${escapeHtml(meta)}</div>`
        : '';

      return `
        <li style="margin:0 0 18px;">
          <a href="${escapeHtml(a.url)}" style="color:#111;text-decoration:none;font-weight:600;">${t}</a>
          ${metaHtml}
          ${d}
        </li>
      `;
    })
    .join('');

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#f6f6f6;padding:24px;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #eee;padding:24px;">
        <h1 style="margin:0 0 8px;font-size:18px;">${escapeHtml(title)}</h1>
        <p style="margin:0 0 18px;color:#666;line-height:1.5;">Une sélection rapide d’articles IA.</p>
        <ol style="padding-left:18px;margin:0;">${itemsHtml}</ol>
        <hr style="border:none;border-top:1px solid #eee;margin:22px 0;" />
        <p style="margin:0;color:#888;font-size:12px;line-height:1.5;">
          Tu reçois ce mail car tu es inscrit(e) à la newsletter USINE‑IA.
        </p>
      </div>
    </div>
  `;
}

async function getSubscribedEmails() {
  const supabaseUrl = requireEnv('SUPABASE_URL');
  const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });

  const { data, error } = await supabaseAdmin
    .from('newsletter')
    .select('email')
    .eq('is_subscribed', true);

  if (error) throw new Error(`Supabase read error: ${error.message}`);

  return (data ?? [])
    .map((r) => (typeof r.email === 'string' ? r.email.trim().toLowerCase() : ''))
    .filter(Boolean);
}

async function sendBccBatches({ transporter, from, subject, html, emails, batchSize, dryRun }) {
  const batches = chunk(emails, batchSize);
  console.log(`📨 Recipients: ${emails.length} (batches: ${batches.length}, batchSize: ${batchSize})`);

  for (let i = 0; i < batches.length; i++) {
    const bcc = batches[i];
    const infoLine = `batch ${i + 1}/${batches.length} (bcc: ${bcc.length})`;

    if (dryRun) {
      console.log(`🧪 DRY_RUN: would send ${infoLine}`);
      continue;
    }

    const result = await transporter.sendMail({
      from,
      to: from,
      bcc,
      subject,
      html
    });

    console.log(`✅ Sent ${infoLine}: ${result.messageId ?? '(no messageId)'}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const smtpHost = requireEnv('SMTP_HOST');
  const smtpPort = toInt(process.env.SMTP_PORT, 587);
  const smtpSecure = toBool(process.env.SMTP_SECURE, false);
  const smtpUser = requireEnv('SMTP_USER');
  const smtpPass = requireEnv('SMTP_PASS');
  const fromEmail = requireEnv('MAIL_FROM_EMAIL');
  const fromName = process.env.MAIL_FROM_NAME || 'USINE-IA';

  const tag = process.env.DIGEST_TAG || 'ai';
  const articlesLimit = toInt(process.env.DIGEST_ARTICLES_LIMIT, 5);
  const subject = process.env.DIGEST_SUBJECT || '[USINE-IA] Digest IA';
  const batchSize = toInt(process.env.DIGEST_BCC_BATCH_SIZE, 50);
  const dryRun = toBool(process.env.DRY_RUN, true);

  const effectiveLimit = args.limit ? toInt(args.limit, articlesLimit) : articlesLimit;

  console.log('🧠 USINE-IA newsletter digest');
  console.log(`- tag: ${tag}`);
  console.log(`- articles: ${effectiveLimit}`);
  console.log(`- dryRun: ${dryRun}`);

  const articles = await fetchDevToArticles({ tag, limit: effectiveLimit });
  if (!articles.length) {
    console.log('ℹ️ No articles fetched; aborting.');
    return;
  }

  const html = renderEmailHtml({ title: subject, articles });

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: { user: smtpUser, pass: smtpPass }
  });

  const from = `${fromName} <${fromEmail}>`;

  if (args.testTo) {
    console.log(`🧪 Test mode: sending to ${args.testTo}`);
    if (dryRun) {
      console.log('🧪 DRY_RUN: would send test email');
      return;
    }

    const result = await transporter.sendMail({ from, to: args.testTo, subject, html });
    console.log(`✅ Sent test: ${result.messageId ?? '(no messageId)'}`);
    return;
  }

  const emails = await getSubscribedEmails();
  if (!emails.length) {
    console.log('ℹ️ No subscribed emails found; aborting.');
    return;
  }

  await sendBccBatches({ transporter, from, subject, html, emails, batchSize, dryRun });
}

main().catch((err) => {
  console.error('❌ Digest failed:', err?.message || err);
  process.exit(1);
});
