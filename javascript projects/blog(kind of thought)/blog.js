document.addEventListener("DOMContentLoaded", () => {
  const blogText = document.getElementById("blog-content");
  const submit = document.getElementById("blog-submit");
  const list = document.getElementById("blog-list");

  let blogArray;
  try {
    blogArray = JSON.parse(localStorage.getItem("blog")) || [];
  } catch (error) {
    console.error("Error parsing blogs from localStorage:", error);
    blogArray = [];
  }

  // Render blogs that were loaded from localStorage
  blogArray.forEach((blog) => {
    renderBlog(blog);
  });

  // Add new blog on submit
  submit.addEventListener("click", () => {
    let content = blogText.value.trim();
    if (content === "") return;

    const blog = {
      text: content,
      id: Date.now(),
    };
    blogArray.push(blog);
    saveBlog(blogArray); // Save the updated blogArray
    blogText.value = ""; // Clear the input field
    renderBlog(blog); // Render the newly added blog
    console.log(blogArray);
  });

  // Render a blog to the list
  function renderBlog(blog) {
    const li = document.createElement("li");
    li.setAttribute("data-id", blog.id);
    li.innerHTML = `
      <span>${blog.text}</span>
      <button>Delete</button>
    `;

    li.querySelector("button").addEventListener("click", () => {
      blogArray = blogArray.filter((t) => t.id !== blog.id);
      li.remove();
      saveBlog(blogArray); // Save the updated blogArray after deletion
    });

    list.append(li);
  }

  // Save the blogArray to localStorage
  function saveBlog(blogArray) {
    localStorage.setItem("blog", JSON.stringify(blogArray));
  }
});
