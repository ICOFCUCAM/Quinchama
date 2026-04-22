import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://jqigxzgbzbxbmaayljfw.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImZjYzk0NWY5LWYxYTUtNGQ4NS1iMTk3LTIyODc1OWMzMWY0MiJ9.eyJwcm9qZWN0SWQiOiJqcWlneHpnYnpieGJtYWF5bGpmdyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzc1NzQzMTY0LCJleHAiOjIwOTExMDMxNjQsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.eIoXQCyXaLVO8-aZmRf4kY_N6J7ZmZ7jCjj0p60TlTI';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };