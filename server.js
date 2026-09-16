const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = path.join(__dirname, 'outputs');
const DATA_FILE = path.join(__dirname, 'work', 'neetnexa-data.json');
const sessions = new Map();

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex');
}

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    const salt = crypto.randomBytes(16).toString('hex');
    const data = {
      admin: { username: 'Hariom Singh', salt, passwordHash: hashPassword('Hariom@2026', salt) },
      students: [],
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return data;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function parseCookies(request) {
  return Object.fromEntries((request.headers.cookie || '').split(';').filter(Boolean).map(value => {
    const index = value.indexOf('=');
    return [value.slice(0, index).trim(), decodeURIComponent(value.slice(index + 1))];
  }));
}

function isAdmin(request) {
  const session = sessions.get(parseCookies(request).neetnexa_session);
  return session?.role === 'admin';
}

function send(response, status, data, headers = {}) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  response.end(JSON.stringify(data));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', chunk => { body += chunk; if (body.length > 100000) request.destroy(); });
    request.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('Invalid JSON')); } });
  });
}

function createSession(response, role) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { role, createdAt: Date.now() });
  response.setHeader('Set-Cookie', `neetnexa_session=${token}; HttpOnly; SameSite=Lax; Path=/`);
}

function studentProgress(name, email) {
  const seed = (name.length * 17 + email.length * 11) % 41;
  const progress = 52 + seed;
  const score = 420 + seed * 5;
  const levels = ['Bronze · Starter', 'Silver · Builder', 'Gold · Achiever', 'Platinum · Mastery', 'Emerald · Expert', 'Sapphire · Scholar', 'Diamond · Elite', 'Legend · Top Performer'];
  return { progress, score, level: levels[Math.min(7, Math.floor((progress - 50) / 6))] };
}

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon' };

http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  try {
    if (request.method === 'POST' && url.pathname === '/api/auth/admin/login') {
      const { username, password } = await readJson(request);
      const data = readData();
      const valid = username === data.admin.username && crypto.timingSafeEqual(Buffer.from(hashPassword(password || '', data.admin.salt), 'hex'), Buffer.from(data.admin.passwordHash, 'hex'));
      if (!valid) return send(response, 401, { error: 'Incorrect admin credentials.' });
      createSession(response, 'admin');
      return send(response, 200, { username: data.admin.username });
    }
    if (request.method === 'POST' && url.pathname === '/api/auth/student/login') {
      const { name, email } = await readJson(request);
      if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email || '')) return send(response, 400, { error: 'Enter a name and valid email address.' });
      const data = readData();
      const details = studentProgress(name.trim(), email.trim().toLowerCase());
      const student = { name: name.trim(), email: email.trim().toLowerCase(), ...details, lastLogin: new Date().toISOString() };
      const existing = data.students.findIndex(item => item.email === student.email);
      if (existing >= 0) data.students[existing] = { ...data.students[existing], ...student };
      else data.students.unshift(student);
      writeData(data);
      createSession(response, 'student');
      return send(response, 200, { student });
    }
    if (request.method === 'POST' && url.pathname === '/api/auth/admin/credentials') {
      if (!isAdmin(request)) return send(response, 403, { error: 'Admin access required.' });
      const { currentPassword, username, newPassword } = await readJson(request);
      const data = readData();
      const correct = crypto.timingSafeEqual(Buffer.from(hashPassword(currentPassword || '', data.admin.salt), 'hex'), Buffer.from(data.admin.passwordHash, 'hex'));
      if (!correct) return send(response, 401, { error: 'Current password is incorrect.' });
      if (!username?.trim() || !newPassword || newPassword.length < 8) return send(response, 400, { error: 'Use a username and a new password with at least 8 characters.' });
      const salt = crypto.randomBytes(16).toString('hex');
      data.admin = { username: username.trim(), salt, passwordHash: hashPassword(newPassword, salt) };
      writeData(data);
      return send(response, 200, { username: data.admin.username });
    }
    if (request.method === 'GET' && url.pathname === '/api/admin/students') {
      if (!isAdmin(request)) return send(response, 403, { error: 'Admin access required.' });
      return send(response, 200, { students: readData().students });
    }
    if (request.method === 'GET' && url.pathname === '/api/auth/session') {
      const session = sessions.get(parseCookies(request).neetnexa_session);
      if (!session) return send(response, 200, { role: null });
      const data = readData();
      return send(response, 200, { role: session.role, username: session.role === 'admin' ? data.admin.username : null });
    }
    if (request.method === 'POST' && url.pathname === '/api/auth/logout') {
      sessions.delete(parseCookies(request).neetnexa_session);
      return send(response, 200, { ok: true }, { 'Set-Cookie': 'neetnexa_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0' });
    }

    const requested = url.pathname === '/' ? '/index.html' : url.pathname;
    const filePath = path.normalize(path.join(PUBLIC_DIR, decodeURIComponent(requested)));
    if (!filePath.startsWith(PUBLIC_DIR + path.sep) && filePath !== path.join(PUBLIC_DIR, 'index.html')) return send(response, 403, { error: 'Forbidden' });
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) return send(response, 404, { error: 'Not found' });
    response.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(response);
  } catch (error) {
    send(response, 500, { error: 'Server error. Please try again.' });
  }
}).listen(PORT, '0.0.0.0', () => console.log(`NeetNexa is running at http://localhost:${PORT}`));
