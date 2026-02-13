const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_28IWsVZPJjuk@ep-dawn-feather-agyp1nvm.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function setup() {
  try {
    await client.connect();
    console.log('Connected to Neon DB');

    // Create table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        business_name TEXT NOT NULL,
        email TEXT NOT NULL,
        website TEXT,
        website_generator TEXT,
        business_type TEXT,
        city TEXT,
        initial_contact TEXT DEFAULT 'No',
        follow_up TEXT DEFAULT 'No',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Table created');

    // Read CSV
    const fs = require('fs');
    const csv = fs.readFileSync('/home/markus_reg/.openclaw/workspace/leads.csv', 'utf-8');
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/ /g, '_'));

    console.log('CSV headers:', headers);

    // Insert data (skip header + empty lines)
    let inserted = 0;
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Handle CSV with commas inside quotes
      const values = [];
      let current = '';
      let inQuotes = false;
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      // Map CSV columns to DB columns
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] || '';
      });

      // Skip rows without email
      if (!row.email) continue;

      await client.query(
        `INSERT INTO contacts (business_name, email, website, website_generator, business_type, city, initial_contact, follow_up, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          row.business_name || row['business_name'] || '',
          row.email,
          row.website || row['website_url'] || '',
          row.website_generator || row['website_generator'] || '',
          row.business_type || row['business_type'] || '',
          row.city,
          row.initial_contact || row['initial_contact'] || 'No',
          row.follow_up || row['follow_up'] || 'No',
          row.notes || ''
        ]
      );
      inserted++;
      if (inserted % 50 === 0) console.log(`Inserted ${inserted}...`);
    }

    console.log(`Total inserted: ${inserted}`);

    // Verify
    const result = await client.query('SELECT COUNT(*) FROM contacts');
    console.log('Total in DB:', result.rows[0].count);

  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await client.end();
  }
}

setup();
