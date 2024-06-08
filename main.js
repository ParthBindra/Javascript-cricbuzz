document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'https://cricbuzz-cricket.p.rapidapi.com/matches/v1/recent';
  const apiHeaders = {
    'X-RapidAPI-Key': 'cfddeb41a9mshd3b6ecc0edef215p191adbjsn8049cf98425e',
    'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
  };

  async function fetchMatches() {
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: apiHeaders
      });

      const responseText = await response.text();
      console.log(responseText);

      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }

      const data = JSON.parse(responseText);
      displayMatches(data.typeMatches);
    } catch (error) {
      console.error(error);
    }
  }

  function displayMatches(typeMatches) {
    const matchesList = document.getElementById('matches-list');
    matchesList.innerHTML = '';

    if (!typeMatches || typeMatches.length === 0) {
      matchesList.innerHTML = '<p>No matches available.</p>';
      return;
    }

    typeMatches.forEach(typeMatch => {
      typeMatch.seriesMatches.forEach(seriesMatch => {
        seriesMatch.seriesAdWrapper.matches.forEach(match => {
          const matchInfo = match.matchInfo;
          const matchScore = match.matchScore;
          const matchCard = document.createElement('div');
          matchCard.className = 'match-card';
          matchCard.innerHTML = `
            <h2>${matchInfo.team1 ? matchInfo.team1.teamName : ''} vs ${matchInfo.team2 ? matchInfo.team2.teamName : ''}</h2>
            
            
            <p>Match Status: ${matchInfo.status}</p>
            
          `;
          matchesList.appendChild(matchCard);

          matchCard.addEventListener('click', () => {
            openModal(matchInfo, matchScore);
          });
        });
      });
    });
  }

  function openModal(matchInfo, matchScore) {
    const modal = document.getElementById('myModal');
    const closeBtn = document.querySelector('.close');

    if (modal && closeBtn) {
      modal.style.display = 'block';

      const modalContent = document.querySelector('.modal-content');
      modalContent.innerHTML = `
        <h2>${matchInfo.team1 ? matchInfo.team1.teamName : ''} vs ${matchInfo.team2 ? matchInfo.team2.teamName : ''}</h2>
       
        <p>Match Venue: ${matchInfo.venueInfo.city}, ${matchInfo.venueInfo.timezone}</p>
        <p>Match Status: ${matchInfo.status}</p>
        <p>Score: ${matchInfo.score1 ? matchInfo.score1.runs + "/" + matchInfo.score1.wickets : 'N/A'} - ${matchInfo.score2 ? matchInfo.score2.runs + "/" + matchInfo.score2.wickets : 'N/A'}</p>
        <h3>Scorecard</h3>
        <p>Team 1 Score: ${matchScore.team1Score.inngs1.runs}/${matchScore.team1Score.inngs1.wickets} (${matchScore.team1Score.inngs1.overs} overs)</p>
        <p>Team 2 Score: ${matchScore.team2Score.inngs1.runs}/${matchScore.team2Score.inngs1.wickets} (${matchScore.team2Score.inngs1.overs} overs)</p>
      `;

      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }
  }

  fetchMatches();

  document.getElementById('matches-list').addEventListener('click', (event) => {
    if (event.target.classList.contains('match-card')) {
      const matchId = event.target.dataset.matchId;
      fetchScorecard(matchId);
    }
  });
});
