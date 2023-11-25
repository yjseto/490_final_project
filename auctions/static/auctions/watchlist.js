// Method to retrieve value of a specified cookie by its name. Gets the CSRF token from cookies for POST request
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Method to update the state of the watchlist icon based on whether the listing is in or out of user's watchlist
function updateIconAppearance(element, isAdded) {
    if (isAdded) {
        element.classList.remove('fa-heart-broken');
        element.classList.add('fa-heart');
        element.style.color = 'red';
    } else {
        element.classList.remove('fa-heart');
        element.classList.add('fa-heart-broken');
        element.style.color = 'red';
    }
}

// Method to determine the presence of a listing in the watchlist and either add or remove it based on user interaction
function toggleWatchlist(element) {
    const auctionId = element.getAttribute('data-auction-id');
    const isInWatchlist = element.classList.contains('in-watchlist');
    const url = isInWatchlist ? `/listing/${auctionId}/removeWatchlist/` : `/listing/${auctionId}/addWatchlist/`;

    console.log("Auction ID:", auctionId, "Is in Watchlist:", isInWatchlist, "URL:", url);

    fetch(url, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'), 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'auction_id': auctionId }),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Response Data:", data);
        if (data.status === 'success') {
            const wasAdded = data.hasOwnProperty('added');
            updateIconAppearance(element, wasAdded);
            element.classList.toggle('in-watchlist', wasAdded);
        } else {
            console.error('Error:', data.message);
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error);
    });
}

// Add event listeners to watchlist icons after DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Select all watchlist icons
    const watchlistIcons = document.querySelectorAll('.watchlist-icon');
    watchlistIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            toggleWatchlist(this);
        });
    });
});
