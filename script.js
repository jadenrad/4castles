const client_id = '9aa40627425642588c601d18a77f38e4'; // Your Spotify client ID
const redirect_uri = 'https://jadenmrad.github.io/4castles/callback'; // Your GitHub Pages URL

// Step 1: Redirect to Spotify Authorization
function authorize() {
    const scopes = 'user-read-playback-state user-read-currently-playing';
    const url = `https://accounts.spotify.com/authorize?response_type=token&client_id=${client_id}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
    window.location.href = url;
}

// Step 2: Handle Redirect and Extract Access Token
function handleRedirect() {
    const hash = window.location.hash.substring(1).split('&').reduce(function(initial, item) {
        if (item) {
            var parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});
    window.location.hash = '';
    return hash.access_token;
}

// Fetch Spotify Data using the Access Token
async function fetchSpotifyData(token) {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        const data = await response.json();
        document.getElementById('spotify-box').innerHTML = `
            <h2>Currently Playing:</h2>
            <p>${data.item.name} by ${data.item.artists[0].name}</p>
            <img src="${data.item.album.images[0].url}" alt="${data.item.name} cover" width="200">
        `;
    } else {
        document.getElementById('spotify-box').innerHTML = '<p>Unable to fetch data.</p>';
    }
}

// Main Function to Handle Authorization and Fetch Data
function main() {
    const token = handleRedirect();
    if (token) {
        fetchSpotifyData(token);
    } else {
        authorize();
    }
}

main();