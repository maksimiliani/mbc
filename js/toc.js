document.addEventListener("DOMContentLoaded", (event) => {
    let h2_total = 0;
    let toc_list = document.querySelector("#table-of-contents ul");
    toc_list.innerHTML = '';

    document.querySelectorAll('#blog-content h2').forEach((element) => {
        let optli = document.createElement('li');
        let opt = document.createElement('a');
        opt.innerHTML = element.textContent;
        element.setAttribute("id", element.textContent);
        opt.setAttribute("href", "#"+element.textContent);
        optli.appendChild(opt)
        toc_list.appendChild(optli);
        h2_total++;
    });

    if (h2_total == 0) {
        document.querySelector("#table-of-contents").style.display = "none"; 
    }


});