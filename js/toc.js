document.addEventListener("DOMContentLoaded", (event) => {
    let h2_total = 0;
    let toc_list = document.querySelector("#table-of-contents ul");
    toc_list.innerHTML = '';

    document.querySelectorAll('#blog-content h2').forEach((element) => {
        let opt = document.createElement('li');
        opt.innerHTML = element.textContent;
       toc_list.appendChild(opt);
        h2_total++;
    });

    if (h2_total == 0) {
        document.querySelector("#table-of-contents").style.display = "none"; 
    }


});