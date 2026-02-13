const { Client } = require('pg');
const fs = require('fs');

const client = new Client({ 
  connectionString: 'postgresql://neondb_owner:npg_28IWsVZPJjuk@ep-dawn-feather-agyp1nvm.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

const csv = fs.readFileSync('/home/markus_reg/.openclaw/workspace/leads.csv', 'utf-8');
const lines = csv.split('\n');

async function process() {
  await client.connect();
  await client.query('DELETE FROM contacts');
  
  let inserted = 0;
  for (let i = 1; i <= 10 && i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const values = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) { values.push(current.trim()); current = ''; }
      else current += char;
    }
    values.push(current.trim());
    
    const email = values[1]?.trim();
    const website = values[2]?.trim();
    const businessName = values[0]?.trim();
    const city = values[5]?.trim();
    
    if (!email) continue;
    
    await client.query(
      'INSERT INTO contacts (email, website, city, "businessName", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())',
      [email, website, city, businessName]
    );
    inserted++;
  }
  console.log('Inserted:', inserted);
  await client.end();
}
process();
