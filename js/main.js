/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Ruslan Gofman Student ID: 108891219 Date: 28/9/2023
*
********************************************************************************/ 

var page = 1;
var perPage  = 10;


function loadCompanyData(tag = null){
    let url = tag 
                ? `https://bored-suit-deer.cyclic.cloud/api/companies?page=${page}&perPage=${perPage}&tag=${tag}`
                : `https://bored-suit-deer.cyclic.cloud/api/companies?page=${page}&perPage=${perPage}`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        let row = data.map(companyObjectToTableRowTemplate).join('');
        document.querySelector('#companiesTable tbody').innerHTML = row;
        const pagination = document.querySelector('.pagination');
        if (tag!==null){
            page = 1;
            pagination.classList.add('d-none');
        }
        else{
            document.querySelector('#current-page').innerHTML = page;
            pagination.classList.remove('d-none');
        }

        document.querySelectorAll('#companiesTable tbody tr').forEach((row) => {
            row.addEventListener('click', (e) => {
                let clicked = row.getAttribute('data-id');
                clicked = clicked.replace('-','.')
                fetch(`https://bored-suit-deer.cyclic.cloud/api/company/${clicked}`)
                .then((res) => res.json())
                .then((data) => {
                    let company = windowTemplate(data)
                    document.querySelector('#detailsModal .modal-body').innerHTML = company;
                    let modal = new bootstrap.Modal(document.getElementById("detailsModal"), {
                        backdrop: "static",
                        keyboard: false
                    });
                    modal.show();
                }); 
            });
        });

    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

}


windowTemplate = (companyObj) => {
    const description = companyObj.description ? `${companyObj.category_code}` : `n/a`
    const tags = companyObj.tag_list ? companyObj.tag_list.split(", ").map((x) => `<li>${x}</li>`).join('') : `n/a`;
    const products = companyObj.products ? companyObj.products.map((x) => `<li>${x.name}</li>`).join('') : `n/a`;
    const employees = companyObj.number_of_employees ? `${companyObj.number_of_employees}` : `n/a`;
    const person = companyObj.relationships.length>0 ?companyObj.relationships.map((x) => ` ${x.person.first_name} ${x.person.last_name} (${x.title})`).join('') : `n/a`;
    const date = companyObj.founded_year && companyObj.founded_month && companyObj.founded_day
          ? `${companyObj.founded_year}/${companyObj.founded_month}/${companyObj.founded_day}`
          : '--';

    if (companyObj.offices[0].city !==null && companyObj.offices[0].city.length >0){
        var office = companyObj.offices.length > 0 ? `${companyObj.offices[0].city}` : `--`;
        if(companyObj.offices[0].state_code !== null){
            office += `, ${companyObj.offices[0].state_code}`;
        }
        office += `, ${companyObj.offices[0].country_code}`;
    }
    else{
        var office = '--'
    }

    return `<li class="list-group-item">
    <strong>Category:</strong> ${companyObj.category_code}<br/><br/>
    <strong>Description:</strong> ${description}<br/><br/>
    <strong>Overview:</strong> ${companyObj.overview}
    <strong>Tag List:</strong> <ul>${tags}</ul>
    <strong>Founded:</strong> ${date}<br/><br />
    <strong>Key People:</strong> ${person}<br /><br />
    <strong>Products:</strong> 
    <ul>${products}</ul>
    <strong>Number of Employees:</strong> ${employees}<br/><br/>
    <strong>Website:</strong> <a href="${companyObj.homepage_url}">${companyObj.homepage_url}</a><br/><br />
    </li> `;
    }



companyObjectToTableRowTemplate  = (companyObj ) => {
        const founder = companyObj.relationships.length>0 ? `${companyObj.relationships[0].person.first_name} ${companyObj.relationships[0].person.last_name}` : '--';
        const employees = companyObj.number_of_employees ? `${companyObj.number_of_employees}` : `--`;
        if (companyObj.offices[0].city !==null && companyObj.offices[0].city.length >0){
            var office = companyObj.offices.length > 0 ? `${companyObj.offices[0].city}` : '--';
            if(companyObj.offices[0].state_code !== null){
                office += `, ${companyObj.offices[0].state_code}`;
            }
            office += `, ${companyObj.offices[0].country_code}`;
        }
        else{
            var office = '--'
        }
        const date = companyObj.founded_year && companyObj.founded_month && companyObj.founded_day
          ? `${companyObj.founded_year}/${companyObj.founded_month}/${companyObj.founded_day}`
          : '--';
        const tags = companyObj.tag_list ? `${companyObj.tag_list.split(",")[0]}, ${companyObj.tag_list.split(",")[1]}` : `--`
        const description = companyObj.description ? `${companyObj.description}` : `--`
        console.log(companyObj._id)
        return  `<tr data-id=${companyObj.permalink}>
        <td>${companyObj.name}</td>
        <td>${companyObj.category_code}</td>
        <td>${description}</td>
        <td>${date}</td>
        <td>${founder}</td>
        <td>${office}</td>
        <td>${employees}</td>
        <td>${tags}</td>
        <td><a href="${companyObj.homepage_url}">${companyObj.homepage_url}</a></td>
    </tr>`;
  } 





  document.addEventListener('DOMContentLoaded', function () {

    loadCompanyData() 

    document.querySelector('#searchForm').addEventListener('submit', (event) => {
        event.preventDefault();
        loadCompanyData(document.querySelector('#tag').value);
    });

    document.querySelector('#searchForm').addEventListener('reset', (event) => {
        event.preventDefault();
        console.log("hello")
        document.querySelector("#tag").value = "";
        loadCompanyData()
    });

    document.querySelector('#previous-page').addEventListener('click', (event) => {
        event.preventDefault();
        if (page >1){
            page-=1;
            loadCompanyData()
        }
        
    });

    document.querySelector('#next-page').addEventListener('click', (event) => {
        event.preventDefault();
            page+=1;
            loadCompanyData()
    });
});