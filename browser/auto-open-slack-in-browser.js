const linkElements = document.querySelectorAll("a.c-link")

linkElements.forEach(linkElement => {
    if (linkElement.innerHTML.includes("open this link in your browser")) {
        location.href = linkElement.href;
    }
});