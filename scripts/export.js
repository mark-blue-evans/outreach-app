const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_28IWsVZPJjuk@ep-dawn-feather-agyp1nvm.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function exportData() {
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM contacts ORDER BY id');
    const fs = require('fs');
    
    const data = result.rows.map(row => ({
      id: row.id,
      businessName: row.business_name,
      email: row.email,
      website: row.website,
      websiteGenerator: row.website_generator,
      businessType: row.business_type,
      city: row.city,
      initialContact: row.initial_contact,
      followUp: row.follow_up,
      notes: row.notes
    }));
    
    fs.writeFileSync('./src/data/contacts.json', JSON.stringify(data, null, 2));
    console.log('Exported', data.length, 'contacts');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await client.end();
  }
}

exportData();
