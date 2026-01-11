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

    // Helper: fetch with timeout using AbortController
    async function fetchWithTimeout(resource, timeout = 5000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const resp = await fetch(resource, { signal: controller.signal });
            clearTimeout(id);
            return resp;
        } catch (err) {
            clearTimeout(id);
            throw err;
        }
    }

    // ========== DOM Elements ==========
    const leaderboardBody = document.getElementById('leaderboardBody');
    const filterTabs = document.getElementById('filterTabs');
    const matchFilters = document.getElementById('matchFilters');
    const lastUpdated = document.getElementById('lastUpdated');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const overallContainer = document.getElementById('overallContainer');
    const mvpArea = document.getElementById('mvpArea');
    const viewToggle = document.getElementById('viewToggle');
    const overallFilters = document.getElementById('overallFilters');

    // ========== State ==========
    let allTeams = [];
    let allPlayers = [];
    let currentFilter = 'all';
    let currentMatch = 'all';
    let currentGroup = 'all'; // all, A, B, C, D, mvp
    let refreshTimer = null; 
    let countdownInterval = null;
    let isLiveMode = false; // Toggle for live vs placeholder

    // ========== Initialize ==========
    init();

    function init() {
        fetchStandings();
        setupFilterListeners();
        startAutoRefresh();
        startGlobalCountdown();
        
        if (viewToggle) {
            viewToggle.addEventListener('click', () => {
                isLiveMode = !isLiveMode;
                document.body.classList.toggle('live-mode-active', isLiveMode);
                handleRendering();
            });
        }
    }

    // ========== Global Countdown Timer ==========
    function startGlobalCountdown() {
        if (countdownInterval) clearInterval(countdownInterval);
        
        const targetDate = new Date("February 6, 2026 12:00:00").getTime();
        
        countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                clearInterval(countdownInterval);
                updateAllCountdowns("LIVESTREAM STARTING");
                return;
            }
            
            const d = Math.floor(distance / (1000 * 60 * 60 * 24));
            const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);
            
            const timerStr = `${d}d ${h}h ${m}m ${s}s`;
            updateAllCountdowns(timerStr);
        }, 1000);
    }

    function updateAllCountdowns(text) {
        const displays = document.querySelectorAll('.countdown-timer');
        displays.forEach(el => el.textContent = text);
    }

    // ========== Fetch Standings Data ==========
    async function fetchStandings() {
        try {
            // Use time-limited fetch to avoid hanging (teams = 5s, players = 3s)
            const teamsResp = await fetchWithTimeout(CONFIG.dataUrl, 5000);
            const playersResp = await fetchWithTimeout('data/players.json', 3000).catch(() => null);

            if (!teamsResp.ok) {
                throw new Error(`HTTP error! status: ${teamsResp.status}`);
            }

            allTeams = await teamsResp.json();

            // AUTO-SWITCH LOGIC: If we have teams, enable Live Mode
            if (allTeams && allTeams.length > 0) {
                isLiveMode = true;
                document.body.classList.add('live-mode-active');
            } else {
                isLiveMode = false;
                document.body.classList.remove('live-mode-active');
            }

            if (playersResp && playersResp.ok) {
                allPlayers = await playersResp.json();
            } else {
                allPlayers = [];
            }

            // Sort by rank
            allTeams.sort((a, b) => a.rank - b.rank);

            // Render according to filter state
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
        if (!leaderboardBody) return;
        
        // Reset content
        leaderboardBody.innerHTML = '';
        
        if (teams.length === 0) {
            leaderboardBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">
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

        // If not in live mode, mask team names as Coming Soon
        const displayName = isLiveMode ? escapeHtml(team.teamName) : 'Coming Soon';

        row.innerHTML = `
            <td class="rank-cell">#${team.rank}</td>
            <td class="team-name">${displayName}</td>
            <td class="hide-mobile"><span class="group-badge">${team.group}</span></td>
            <td class="hide-mobile">${team.matchesPlayed}</td>
            <td class="hide-mobile">${team.killPoints || team.kills || 0}</td>
            <td class="hide-mobile">${team.placementPoints || 0}</td>
            <td class="total-score">${team.totalScore}</td>
        `;

        return row;
    }

    // ========== Animate Rows ==========
    function animateRows() {
        if (!leaderboardBody) return;
        const rows = leaderboardBody.querySelectorAll('.fade-row');
        
        rows.forEach((row, index) => {
            setTimeout(() => {
                row.classList.add('visible');
            }, index * CONFIG.animationDelay);
        });
    }

    // ========== Setup Filter Listeners ==========
    function setupFilterListeners() {
        if (!filterButtons) return;
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.dataset.filter;
                const match = this.dataset.match;
                const group = this.dataset.group;

                // Handle Day/Overall filters
                if (filter) {
                    if (filter === currentFilter) return;

                    // Update active state for main tabs
                    document.querySelectorAll('#filterTabs .filter-btn').forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');

                    currentFilter = filter;
                    currentMatch = 'all';
                    currentGroup = 'all'; // reset group filter when changing day

                    // Show/Hide sub-filters
                    if (filter !== 'all') {
                        if (matchFilters) matchFilters.style.display = 'flex';
                        if (overallFilters) overallFilters.style.display = 'none';
                        // Reset match buttons visibility/active state
                        document.querySelectorAll('#matchFilters .filter-btn').forEach(btn => btn.classList.remove('active'));
                    } else {
                        if (matchFilters) matchFilters.style.display = 'none';
                        if (overallFilters) overallFilters.style.display = 'flex';
                        // Reset group buttons
                        document.querySelectorAll('#overallFilters .filter-btn').forEach(btn => btn.classList.remove('active'));
                        const allGroupBtn = document.querySelector('#overallFilters [data-group="all"]');
                        if (allGroupBtn) allGroupBtn.classList.add('active');
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

                // Handle Overall Group sub-filters
                if (group) {
                    document.querySelectorAll('#overallFilters .filter-btn').forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    currentGroup = group;
                    handleRendering();
                }

                updatePageTitle();
            });
        });
    }

    // ========== Handle Rendering Logic ==========
    function handleRendering() {
        if (currentFilter === 'all') {
            if (overallContainer) overallContainer.style.display = 'block';
            document.querySelector('.table-container').style.display = 'none';
            
            // Sub-view elements
            const groupView = document.getElementById('groupView');
            if (groupView) groupView.style.display = 'none';
            if (mvpArea) mvpArea.style.display = 'none';
            
            const groups = ['A','B','C','D'];
            groups.forEach(g => {
                const block = document.getElementById('group' + g);
                if (block) block.style.display = 'none';
            });

            if (currentGroup === 'mvp') {
                if (mvpArea) mvpArea.style.display = 'block';
                renderMVP();
            } else if (currentGroup === 'all') {
                if (groupView) groupView.style.display = 'block';
                groups.forEach(g => {
                    const block = document.getElementById('group' + g);
                    if (block) block.style.display = 'block';
                    if (isLiveMode) renderSpecificGroup(g); else renderSpecificGroupComingSoon(g);
                });
            } else {
                // Specific Group
                if (groupView) groupView.style.display = 'block';
                const block = document.getElementById('group' + currentGroup);
                if (block) {
                    block.style.display = 'block';
                    if (isLiveMode) renderSpecificGroup(currentGroup); else renderSpecificGroupComingSoon(currentGroup);
                }
            }
        } else {
            // ensure overall view is hidden and the regular table is visible
            if (overallContainer) overallContainer.style.display = 'none';
            document.querySelector('.table-container').style.display = '';

            // If not in live mode, show the "Coming Soon" splash in the table area
            if (!isLiveMode) {
                showComingSoon();
                return;
            }

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
            if (currentMatch === String(i)) btn.classList.add('active');
            btn.addEventListener('click', function() {
                document.querySelectorAll('#matchFilters .filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentMatch = this.dataset.match;
                handleRendering();
            });
            matchFilters.appendChild(btn);
        }
    }

    // ========== Overall View (Groups + MVP) ==========
    function renderOverallView() {
        // Now handled by renderSpecificGroup in a loop
        ['A','B','C','D'].forEach(g => renderSpecificGroup(g));
    }

    function renderSpecificGroup(g) {
        const container = document.getElementById('group' + g);
        if (!container) return;
        const teams = allTeams.filter(t => t.group === g).sort((a,b) => a.rank - b.rank);
        let html = `<h3>Group ${g}</h3>`;
        html += `<table class="leaderboard-table small" aria-label="Group ${g} standings"><thead><tr><th>Rank</th><th>Team</th><th class="hide-mobile">Finish</th><th class="hide-mobile">Pos</th><th>Total</th></tr></thead><tbody>`;
        if (teams.length === 0) {
            html += `<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:0.8rem;">No data for Group ${g}</td></tr>`;
        } else {
            teams.forEach(team => {
                html += `<tr><td>#${team.rank}</td><td class="team-name">${escapeHtml(team.teamName)}</td><td class="hide-mobile">${team.killPoints || team.kills || 0}</td><td class="hide-mobile">${team.placementPoints || 0}</td><td class="total-score">${team.totalScore}</td></tr>`;
            });
        }
        html += '</tbody></table>';
        container.innerHTML = html;
    }

    function renderGroupsComingSoon() {
        ['A','B','C','D'].forEach(g => renderSpecificGroupComingSoon(g));
    }

    function renderSpecificGroupComingSoon(g) {
        const container = document.getElementById('group' + g);
        if (!container) return;
        container.innerHTML = `
            <div class="group-card placeholder-card fade-in">
                <div class="group-header">
                    <span class="group-letter">${g}</span>
                    <h3>Group ${g} Standings</h3>
                </div>
                <div class="card-body">
                    <div class="stat-placeholder"><i class="fas fa-ghost"></i><p>Calculating Strategy...</p></div>
                    <div class="match-meta"><span>Feb 6 SHOWDOWN</span></div>
                    <div class="countdown-display"><span class="countdown-timer">00d 00h 00m 00s</span><small>Until Battle Begins</small></div>
                </div>
            </div>
        `;
    }

    function renderMVP() {
        if (!mvpArea) return;
        if (!allPlayers || allPlayers.length === 0) {
            mvpArea.innerHTML = `<h3>Tournament MVP (Top 5)</h3><p class="text-muted">Player stats coming soon</p><p class="mvp-prize" style="margin-top:8px;">Prize: <strong>₹500</strong></p>`;
            return;
        }
        const top5 = allPlayers.slice().sort((a,b) => b.mvpScore - a.mvpScore).slice(0,5);
        let html = `<h3>Tournament MVP (Top 5)</h3><ol class="mvp-list">`;
        top5.forEach(p => {
            html += `<li><strong>${escapeHtml(p.playerName)}</strong> — ${escapeHtml(p.team)} <span class="muted">(${p.mvpScore} pts)</span></li>`;
        });
        html += `</ol><p class="mvp-prize" style="margin-top:8px;">Prize: <strong>₹500</strong></p>`;
        mvpArea.innerHTML = html;
    }

    // ========== Show Coming Soon State ==========
    function showComingSoon() {
        leaderboardBody.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="coming-soon-splash">
                        <div class="splash-icon">⏳</div>
                        <h3 class="splash-title">Battle Data Encrypted</h3>
                        <p class="splash-text">Real-time stats will synchronize once the first drop happens on Feb 6th.</p>
                        <div class="countdown-timer" style="font-size:1.5rem; color:var(--accent-cyan); margin: 1.5rem 0;">00d 00h 00m 00s</div>
                        <div class="splash-status">Waiting for Game Server...</div>
                    </div>
                </td>
            </tr>
        `;
    }

    // ========== Show Error ==========
    function showError() {
        if (leaderboardBody) {
            leaderboardBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="coming-soon-splash">
                            <i class="fas fa-satellite-dish splash-icon" style="color:var(--accent-purple);"></i>
                            <h3 class="splash-title">Connection Interrupted</h3>
                            <p class="splash-text">Trying to reconnect with MAMC server. Please check back in a moment.</p>
                            <button onclick="location.reload()" class="btn-sm" style="margin-top:20px; background:var(--accent-cyan); color:#000; border:none; padding:8px 16px; border-radius:4px; cursor:pointer;">Retry Now</button>
                        </div>
                    </td>
                </tr>
            `;
        }
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
