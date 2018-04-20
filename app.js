window.addEventListener('load', () => {

  console.log('AJAX Blog 2: Electric Boogaloo');

  const baseURL = 'http://localhost:3001/api/blogposts/';
  const focusBlogpostEl = document.getElementById('focus-blogpost');

  const createBlogpost = event => {
    const newTitle = document.querySelector('#new-post-title').value;
    const newContent = document.querySelector('#new-post-content').value;
    axios.post( baseURL, { title: newTitle, content: newContent })
      .then( result => {
        getAllBlogposts();
        getOneBlogpost(result.data.id);
      })
      .catch( error => { console.error( error ); });
      event.preventDefault();
  }

  const updatePost = (event, id) => {
    const newTitle = document.querySelector('#edit-post-title').value;
    const newContent = document.querySelector('#edit-post-content').value;
    axios.put(`${baseURL}${id}`, { title: newTitle, content: newContent })
      .then( result => {
        getAllBlogposts();
        getOneBlogpost(result.data.id);
      })
      .catch( error => { console.error( error ); });
  }

  const renderCreateForm = () => {
    focusBlogpostEl.innerHTML = '';
    const createPostFormEl = document.createElement('form');
    createPostFormEl.innerHTML = `
      <h4>New blogpost.</h4>
      <label>Title</label>
      <input type='text' id='new-post-title' />
      <br><br>
      <label>Content</label>
      <textarea id='new-post-content'></textarea>
      <br><br>
      <button id='create-post'>Create.</button>
    `;
    focusBlogpostEl.appendChild(createPostFormEl);
    document.getElementById('create-post').addEventListener('click', () => {createBlogpost(event);});
  }

  const renderEditForm = blogpost => {
    focusBlogpostEl.innerHTML = '';
    const editPostFormEl = document.createElement('form');
    editPostFormEl.innerHTML = `
      <h4>Edit post.</h4>
      <label>Title</label>
      <input type='text' id='edit-post-title' value='${blogpost.title}' />
      <br><br>
      <label>Content</label>
      <textarea id='edit-post-content'>${blogpost.content}</textarea>
      <br><br>
      <button id='update-post'>Update.</button>
    `;
    focusBlogpostEl.appendChild(editPostFormEl);
    document.getElementById('update-post').addEventListener('click', event => {
      event.preventDefault();
      updatePost(event, blogpost.id);
    });
  }

  const deleteBlogpost = id => {
    axios.delete(`${baseURL}${id}`)
      .then( response => {
        focusBlogpostEl.innerHTML = '';
        getAllBlogposts();
      })
      .catch( error => { console.error( error ); });
  }

  const getOneBlogpost = id => {
    axios.get(`${baseURL}${id}`)
      .then( response => {
        const blogpostTitleEl = document.createElement('h2');
        const blogpostContentEl = document.createElement('div');
        blogpostTitleEl.innerHTML = response.data.title;
        blogpostContentEl.innerHTML = response.data.content;
        focusBlogpostEl.innerHTML = '';
        focusBlogpostEl.appendChild(blogpostTitleEl);
        focusBlogpostEl.appendChild(blogpostContentEl);
        focusBlogpostEl.innerHTML += `
          <button id='edit-post'>Edit</button>
          <button id='delete-post'>Delete</button>
        `;
        document.getElementById('edit-post').addEventListener('click', () => { renderEditForm(response.data); });
        document.getElementById('delete-post').addEventListener('click', () => { deleteBlogpost(response.data.id); });
      })
      .catch( error => { console.error( error); });
  }

  const getAllBlogposts = () => {
    axios.get( baseURL )
      .then( response => {
        const blogpostsListEl = document.getElementById('blogposts-list');
        blogpostsListEl.innerHTML = '';
        response.data.forEach( item => {
          let blogpostsListItemEl = document.createElement('li');
          blogpostsListItemEl.innerHTML = item.title;
          blogpostsListEl.appendChild(blogpostsListItemEl);
          blogpostsListItemEl.addEventListener('click', () => { getOneBlogpost(item.id) });
        });
      })
      .catch( error => { console.error(error); });
  }

  getAllBlogposts();
  document.getElementById('new-blogpost-button').addEventListener('click', renderCreateForm);

});
