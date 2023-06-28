const getPostsList = () => {
    fetch('http://localhost:3000/rest/posts')
        .then(response => response.json())
        .then(data => {
            console.log(data);
/*            const postsDiv = document.getElementById('posts');
            data.forEach(post => {
                const postElement = document.createElement('div');
                const titleElement = document.createElement('h2');
                const contentElement = document.createElement('p');

                titleElement.textContent = post.title;
                contentElement.textContent = post.content;

                postElement.appendChild(titleElement);
                postElement.appendChild(contentElement);

                postsDiv.appendChild(postElement);
            });*/
        })
        .catch(error => console.error('Error:', error));
}

getPostsList()
