/**
 * SYNAPSE MAMC BGMI 2026 - Standings Page JavaScript
 * Handles: Leaderboard data fetching, filtering, and auto-refresh
 */

document.addEventListener('DOMContentLoaded', function() {
    // ========== Configuration ==========
    const CONFIG = {
        dataUrl: 'data/standings.json',
        refreshInterval: 30000, // 30 seconds
        animationDelay: 50 // ms between row animations
    };

    // ========== DOM Elements ==========
    const leaderboardBody = document.getElementById('leaderboardBody');
    const filterTabs = document.getElementById('filterTabs');
    const matchFilters = document.getElementById('matchFilters');
    const lastUpdated = document.getElementById('lastUpdated');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // ========== State ==========
    let allTeams = [];
    let currentFilter = 'all';
    let currentMatch = 'all';
    let refreshTimer = null;

    // ========== Initialize ==========
    init();

    function init() {
        fetchStandings();
        setupFilterListeners();
        startAutoRefresh();
    }

    // ========== Fetch Standings Data ==========
    async function fetchStandings() {
        try {
            const response = await fetch(CONFIG.dataUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            allTeams = await response.json();
            
            // Sort by rank
            allTeams.sort((a, b) => a.rank - b.rank);
            
            // Use unified renderer to avoid showing fake overall rows
            handleRendering();
            updateTimestamp();
            
        } catch (error) {
            console.error('Error fetching standings:', error);
            showError();
        }
    }

    // ========== Filter Teams ==========
    function filterTeams(filter) {
        if (filter === 'all') {
            return allTeams;
        }
        return allTeams.filter(team => team.group === filter);
    }

    // ========== Render Leaderboard ==========
    function renderLeaderboard(teams) {
        // Clear existing rows
        leaderboardBody.innerHTML = '';
        
        if (teams.length === 0) {
            leaderboardBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        No teams found for this filter.
                    </td>
                </tr>
            `;
            return;
        }

        // Create document fragment for better performance
        const fragment = document.createDocumentFragment();

        teams.forEach((team, index) => {
            const row = createTeamRow(team, index);
            fragment.appendChild(row);
        });

        leaderboardBody.appendChild(fragment);

        // Animate rows
        animateRows();
    }

    // ========== Create Team Row ==========
    function createTeamRow(team, index) {
        const row = document.createElement('tr');
        
        // Add special classes for top ranks
        if (team.rank === 1) {
            row.classList.add('rank-1');
        } else if (team.rank <= 3) {
            row.classList.add('top-3');
        }

        // Add animation class
        row.classList.add('fade-row');
        row.style.animationDelay = `${index * CONFIG.animationDelay}ms`;

        // If viewing overall standings, mask team names as Coming Soon
        const displayName = (currentFilter === 'all') ? 'Coming Soon' : escapeHtml(team.teamName);

        row.innerHTML = `
            <td class="rank-cell">#${team.rank}</td>
            <td class="team-name">${displayName}</td>
            <td class="hide-mobile"><span class="group-badge">${team.group}</span></td>
            <td class="hide-mobile">${team.matchesPlayed}</td>
            <td class="kills-cell">${team.totalKills}</td>
            <td class="hide-mobile">${team.placementPoints}</td>
            <td class="hide-mobile">${team.killPoints}</td>
            <td class="total-score">${team.totalScore}</td>
        `;

        return row;
    }

    // ========== Animate Rows ==========
    function animateRows() {
        const rows = leaderboardBody.querySelectorAll('.fade-row');
        
        rows.forEach((row, index) => {
            setTimeout(() => {
                row.classList.add('visible');
            }, index * CONFIG.animationDelay);
        });
    }

    // ========== Setup Filter Listeners ==========
    function setupFilterListeners() {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.dataset.filter;
                const match = this.dataset.match;

                // Handle Day/Overall filters
                if (filter) {
                    if (filter === currentFilter) return;

                    // Update active state for main tabs
                    document.querySelectorAll('#filterTabs .filter-btn').forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');

                    currentFilter = filter;
                    currentMatch = 'all';

                    // Show/Hide match filters
                    if (filter !== 'all') {
                        matchFilters.style.display = 'flex';
                        // Reset match buttons visibility/active state
                        document.querySelectorAll('#matchFilters .filter-btn').forEach(btn => btn.classList.remove('active'));
                    } else {
                        matchFilters.style.display = 'none';
                    }

                    handleRendering();
                }

                // Handle Match sub-filters
                if (match) {
                    document.querySelectorAll('#matchFilters .filter-btn').forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    currentMatch = match;
                    handleRendering();
                }

                updatePageTitle();
            });
        });
    }

    // ========== Handle Rendering Logic ==========
    function handleRendering() {
        if (currentFilter === 'all') {
            // For privacy/staging, do not show overall fake data
            showComingSoon();
        } else {
            // Prepare match buttons (5 for qualifiers, 6 for finals)
            if (currentFilter === 'finals') {
                populateMatchButtons(6);
            } else {
                populateMatchButtons(5);
            }

            const filtered = filterTeams(currentFilter);
            renderLeaderboard(filtered);
        }
    }

    function populateMatchButtons(count) {
        if (!matchFilters) return;
        matchFilters.innerHTML = '';
        for (let i = 1; i <= count; i++) {
            const btn = document.createElement('button');
            btn.className = 'filter-btn btn-sm';
            btn.dataset.match = String(i);
            btn.textContent = `M${i}`;
            btn.addEventListener('click', function() {
                document.querySelectorAll('#matchFilters .filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentMatch = this.dataset.match;
                handleRendering();
            });
            matchFilters.appendChild(btn);
        }
    }

    // ========== Show Coming Soon State ==========
    function showComingSoon() {
        leaderboardBody.innerHTML = `
            <tr>
                <td colspan="8">
                    <div style="text-align: center; padding: 4rem 2rem; background: rgba(0,0,0,0.3); border-radius: 8px;">
                        <div style="font-size: 3rem; color: var(--accent-cyan); margin-bottom: 1rem;">🕒</div>
                        <h3 style="color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 2px;">Data Coming Soon</h3>
                        <p style="color: var(--text-muted); max-width: 400px; margin: 0 auto;">Statistics for this session will be available shortly after the matches begin on February 6th.</p>
                        <div style="margin-top: 1.5rem; display: inline-block; padding: 0.5rem 1rem; border: 1px solid var(--accent-purple); color: var(--accent-purple); font-size: 0.8rem; text-transform: uppercase;">Syncing with Official Server...</div>
                    </div>
                </td>
            </tr>
        `;
    }

    // ========== Filter Teams (Keep but currently only used for 'all') ==========
    function filterTeams(filter) {
        if (filter === 'all') return allTeams;
        return allTeams.filter(team => team.group === filter);
    }

    // ========== Update Page Title ==========
    function updatePageTitle() {
        const pageTitle = document.querySelector('.page-title');
        if (!pageTitle) return;

        if (currentFilter === 'all') {
            pageTitle.textContent = 'Overall Standings';
        } else if (currentFilter === 'finals') {
            pageTitle.textContent = 'Grand Finals Leaderboard';
        } else {
            const dayNum = currentFilter.replace('day', '');
            let title = `Day ${dayNum} Standings`;
            if (currentMatch !== 'all') {
                title += ` - Match ${currentMatch}`;
            }
            pageTitle.textContent = title;
        }
    }

    // ========== Update Timestamp ==========
    function updateTimestamp() {
        if (lastUpdated) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            lastUpdated.textContent = `Last updated: ${timeStr}`;
        }
    }

    // ========== Auto Refresh ==========
    function startAutoRefresh() {
        if (refreshTimer) {
            clearInterval(refreshTimer);
        }
        
        refreshTimer = setInterval(() => {
            fetchStandings();
        }, CONFIG.refreshInterval);
    }

    // Stop auto-refresh when page is not visible
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (refreshTimer) {
                clearInterval(refreshTimer);
                refreshTimer = null;
            }
        } else {
            fetchStandings();
            startAutoRefresh();
        }
    });

    // ========== Show Error ==========
    function showError() {
        if (leaderboardBody) {
            leaderboardBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 4rem 2rem; color: var(--accent-cyan);">
                        <i class="fas fa-clock" style="font-size: 3rem; margin-bottom: 1.5rem; display: block; filter: drop-shadow(0 0 10px var(--accent-cyan));"></i>
                        <span style="font-family: var(--font-heading); font-size: 2rem; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">Coming Soon</span>
                        <p style="color: var(--text-secondary); margin-top: 10px;">Standings will be updated live once the tournament begins on Feb 6th.</p>
                    </td>
                </tr>
            `;
        }
    }

    // ========== Escape HTML ==========
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});

// ========== Add CSS for row animations ==========
const style = document.createElement('style');
style.textContent = `
    .fade-row {
        opacity: 0;
        transform: translateX(-20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .fade-row.visible {
        opacity: 1;
        transform: translateX(0);
    }
`;
document.head.appendChild(style);
