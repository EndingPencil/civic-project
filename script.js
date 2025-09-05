// --- START: SUPABASE SETUP ---
const SUPABASE_URL = 'https://zwuarlfxdruwwdceirjt.supabase.co'; // Replace with your URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3dWFybGZ4ZHJ1d3dkY2Vpcmp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzYwMDQsImV4cCI6MjA3MjY1MjAwNH0.OtVcgZ-mDvLpP8hSu5Go9A-ZyhOqkdoMANwvN97CpXg'; // Replace with your anon key

// Create the Supabase client connection
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- END: SUPABASE SETUP ---

document.addEventListener('DOMContentLoaded', () => {
    // Get all navigation links and content sections
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    // Show the login section by default
    document.getElementById('login-section').classList.add('active');

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });

            // Show the corresponding section based on the link's ID
            if (event.target.id === 'show-report') {
                document.getElementById('report-section').classList.add('active');
            } else if (event.target.id === 'show-previous') {
                document.getElementById('previous-issues-section').classList.add('active');
                // --- START: PHASE 3 EDIT ---
                // This line calls the new function to load issues
                loadIssues(); 
                // --- END: PHASE 3 EDIT ---
            } else if (event.target.id === 'show-login') {
                document.getElementById('login-section').classList.add('active');
            }
        });
    });

    // --- START: PHASE 3 NEW FUNCTION ---
    // This entire function is new. It fetches and displays the issues.
    async function loadIssues() {
        const issuesListDiv = document.getElementById('issues-list');
        issuesListDiv.innerHTML = '<h3>Loading issues...</h3>'; // Show a temporary loading message

        // 1. Fetch all rows from the 'issues' table, ordered by newest first
        const { data: issues, error } = await supabaseClient
            .from('issues')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching issues:', error);
            issuesListDiv.innerHTML = '<p>Sorry, could not load the issues right now.</p>';
            return; // Stop the function if there's an error
        }

        if (issues.length === 0) {
            issuesListDiv.innerHTML = '<p>No issues have been reported yet. Be the first!</p>';
            return; // Stop the function if there are no issues
        }

        // 2. Clear the loading message
        issuesListDiv.innerHTML = '';

        // 3. Loop through each issue and create an HTML card for it
        issues.forEach(issue => {
            const issueCardHTML = `
                <div class="issue-card">
                    <div class="issue-details">
                        <h3>${issue.problem_type} on ${issue.location}</h3>
                        <p>Reported: ${new Date(issue.created_at).toLocaleDateString()}</p>
                        <p>Description: ${issue.description}</p>
                    </div>
                    <div class="issue-status status-${issue.status.toLowerCase().replace(' ', '-')}">
                        ${issue.status}
                    </div>
                </div>
            `;
            // Add the new card's HTML to the list
            issuesListDiv.innerHTML += issueCardHTML;
        });
    }
    // --- END: PHASE 3 NEW FUNCTION ---

    // Form submission event listeners (placeholder for future functionality)
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Login form submitted! (This is a placeholder action)');
    });

    const reportForm = document.getElementById('report-form');
    reportForm.addEventListener('submit', async (event) => { // Note the 'async' keyword
        event.preventDefault();

        // 1. Get the data from the form fields
        const problemType = document.getElementById('problem-type').value;
        const location = document.getElementById('problem-location').value;
        const description = document.getElementById('problem-description').value;

        // 2. Use Supabase to insert the data into the 'issues' table
        const { data, error } = await supabaseClient // <-- USE THE CORRECT VARIABLE NAME HERE
            .from('issues')
            .insert([
                {
                    problem_type: problemType,
                    location: location,
                    description: description,
                    status: 'Pending' // We set a default status for all new reports
                }
            ]);

        if (error) {
            console.error('Error submitting report:', error);
            alert('There was an error submitting your report.');
        } else {
            alert('Report submitted successfully! Thank you for your help.');
            reportForm.reset(); // This clears the form fields for the next report
        }
    });
});