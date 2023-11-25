document.addEventListener('DOMContentLoaded', function () {
    // Select the form element based on the given id
    var commentForm = document.getElementById('comment-form');
    // Select the section where comments will be displayed
    var commentDisplay = document.getElementById('comment_display');
    // Get the auction id from the data attribute of the section
    var auctionId = document.querySelector('#comment-section').getAttribute('data-auction-id');

    // Add event listener for the form submission
    commentForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent the default form submit action

        // Create FormData object from the form
        var formData = new FormData(commentForm);

        // Send the form data to the server using fetch API
        fetch(commentForm.getAttribute('action'), {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.error) {
                throw new Error('Error or empty response from server');
            }
            // Handle the response from the server
            console.log('Server response:', data);

            // Call the function to update the comments display
            fetchComments();
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Error during fetch:', error);
        });
    });

    // Function to fetch and display comments
    function fetchComments() {
        // Construct the URL for fetching comments
        const url = `/listing/${auctionId}/get_comments/`;

        // Use fetch API to get comments data from the server
        fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching comments');
            }
            return response.json();
        })
        .then(comments => {
            // Clear the existing comments
            commentDisplay.innerHTML = '';

            // Iterate over the comments data and create HTML for each comment
            comments.forEach(comment => {
                var commentCard = document.createElement('div');
                commentCard.className = 'card bg-dark mb-3';
                commentCard.innerHTML = `
                    <div class="card-header">
                        <strong>${comment.username}</strong>
                        <div class="text-muted small">
                            commented on ${comment.cm_date}
                        </div>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${comment.headline}</h5>
                        <p class="card-text">${comment.message}</p>
                    </div>
                `;
                commentDisplay.appendChild(commentCard);
            });

            if (comments.length === 0) {
                // If no comments are present, display a message
                commentDisplay.innerHTML = '<p>No comments so far.</p>';
            }
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Error fetching comments:', error);
        });
    }

    // Initially fetch and display comments when the page loads
    fetchComments();
});
